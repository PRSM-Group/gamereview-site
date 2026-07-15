"use client";

import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  initialUsers,
  ROLES,
  type MockReview,
  type MockUser,
  type Role,
} from "@/lib/admin-mock";

type UsersTabProps = {
  gamesById: Record<string, string>;
  reviews: MockReview[];
  setReviewsAction: React.Dispatch<React.SetStateAction<MockReview[]>>;
};

export function UsersTab({
  gamesById,
  reviews,
  setReviewsAction,
}: UsersTabProps) {
  const [users, setUsers] = useState<MockUser[]>(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<{
    userId: string;
    role: Role;
    username: string;
  } | null>(null);
  const [pendingDeleteReviewId, setPendingDeleteReviewId] = useState<
    string | null
  >(null);

  const selected = users.find((u) => u.id === selectedUserId) ?? null;
  const userReviews = useMemo(
    () => reviews.filter((r) => r.authorId === selectedUserId),
    [reviews, selectedUserId],
  );

  const usersWithFlags = users.map((user) => {
    const theirs = reviews.filter((r) => r.authorId === user.id);
    return {
      ...user,
      reviewCount: theirs.length,
      flagTotal: theirs.reduce((sum, r) => sum + r.flagCount, 0),
    };
  });

  function requestRoleChange(user: MockUser, role: Role) {
    if (user.role === role) return;
    setPendingRole({ userId: user.id, role, username: user.username });
  }

  function confirmRoleChange() {
    if (!pendingRole) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === pendingRole.userId ? { ...u, role: pendingRole.role } : u,
      ),
    );
    setPendingRole(null);
  }

  function confirmDeleteReview() {
    if (!pendingDeleteReviewId) return;
    setReviewsAction((prev) => prev.filter((r) => r.id !== pendingDeleteReviewId));
    setPendingDeleteReviewId(null);
  }

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.35fr_0.95fr]">
      <section className="overflow-hidden rounded-xl border border-white/8 bg-black/25">
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">All users</h2>
            <p className="mt-0.5 text-xs text-white/40">
              {usersWithFlags.length} accounts
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.12em] text-white/35">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Flags</th>
              </tr>
            </thead>
            <tbody>
              {usersWithFlags.map((user) => (
                <tr
                  key={user.id}
                  className="admin-table-row cursor-pointer"
                  data-selected={selectedUserId === user.id}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-white">@{user.username}</p>
                    <p className="text-xs text-white/40">{user.displayName}</p>
                  </td>
                  <td className="px-4 py-3.5 text-white/65">{user.email}</td>
                  <td className="px-4 py-3.5 text-white/55">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="px-4 py-3.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      className="admin-input max-w-[110px] py-1.5 text-xs"
                      value={user.role}
                      onChange={(e) =>
                        requestRoleChange(user, e.target.value as Role)
                      }
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex min-w-7 justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        user.flagTotal > 0
                          ? "bg-[rgba(142,3,20,0.35)] text-[#ff8f8f]"
                          : "bg-white/5 text-white/45"
                      }`}
                    >
                      {user.flagTotal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-white/8 bg-black/25 p-5">
        {!selected ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-white/5 text-white/40">
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                aria-hidden
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M5 19v-1a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm text-white/55">Select a user</p>
            <p className="mt-1 max-w-[220px] text-xs text-white/35">
              Review history, flags, and role controls appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-white/8 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  @{selected.username}
                </h3>
                <p className="mt-1 text-xs text-white/45">
                  {selected.displayName} · {selected.email}
                </p>
                <p className="mt-2 text-xs text-white/40">
                  {userReviews.length} reviews ·{" "}
                  {userReviews.reduce((s, r) => s + r.flagCount, 0)} flags
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg px-2.5 py-1 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
                onClick={() => setSelectedUserId(null)}
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {userReviews.length === 0 ? (
                <p className="text-sm text-white/45">No reviews.</p>
              ) : (
                userReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-xl border border-white/8 bg-white/[0.02] p-4"
                  >
                    <h4 className="text-sm font-semibold text-white">
                      {review.title}
                    </h4>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-white/35">
                      {gamesById[review.gameId] ?? "Unknown"} · {review.rating}
                      /5 · {review.flagCount} flags
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {review.content}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {review.flagCount > 0 ? (
                        <button
                          type="button"
                          className="glass-button rounded-lg px-3 py-1.5 text-xs"
                          onClick={() =>
                            setReviewsAction((prev) =>
                              prev.map((r) =>
                                r.id === review.id ? { ...r, flagCount: 0 } : r,
                              ),
                            )
                          }
                        >
                          Dismiss Flags
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="glass-button rounded-lg px-3 py-1.5 text-xs text-[#ffb4b4]"
                        onClick={() => setPendingDeleteReviewId(review.id)}
                      >
                        Delete Review
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingRole)}
        title="Change user access"
        message={
          pendingRole
            ? `Change @${pendingRole.username}'s role to ${pendingRole.role}? This affects what they can access.`
            : ""
        }
        confirmLabel="Update role"
        onCancel={() => setPendingRole(null)}
        onConfirm={confirmRoleChange}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteReviewId)}
        title="Delete review"
        message="This review will be permanently removed. This cannot be undone."
        confirmLabel="Delete review"
        destructive
        onCancel={() => setPendingDeleteReviewId(null)}
        onConfirm={confirmDeleteReview}
      />
    </div>
  );
}
