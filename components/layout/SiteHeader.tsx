"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { logoutAction } from "@/app/login/actions";
import { SITE_NAME } from "@/lib/seed-data";

const CLOSE_MS = 180;

export function SiteHeader({
  initialSession = null,
}: {
  initialSession?: Session | null;
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const openRef = useRef(false);
  const closingRef = useRef(false);

  const { data: clientSession, status } = useSession();
  const session =
    signingOut || status === "unauthenticated"
      ? null
      : (clientSession ?? initialSession);
  const isLoggedIn = Boolean(session?.user);
  const role = session?.user?.role;
  const isLoading = status === "loading" && !initialSession;

  const menuVisible = open || closing;

  useEffect(() => {
    openRef.current = open;
    closingRef.current = closing;
  }, [open, closing]);

  function clearCloseTimer() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu() {
    clearCloseTimer();
    setClosing(false);
    setOpen(true);
  }

  const closeMenu = useCallback(() => {
    if (!openRef.current && !closingRef.current) return;
    clearCloseTimer();
    setOpen(false);
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setClosing(false);
      closeTimer.current = null;
    }, CLOSE_MS);
  }, []);

  type MenuItem = { label: string; href: string };
  const menuItems: MenuItem[] = [
    { label: "BROWSE", href: "/browse" },
    { label: "REVIEWS", href: "#" },
  ];
  if (role === "ADMIN") {
    menuItems.push({ label: "ADMIN DASHBOARD", href: "/admin" });
  } else if (isLoggedIn) {
    menuItems.push({ label: "MY PROFILE", href: "#" });
  }

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    if (!menuVisible) return;

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("click", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuVisible, closeMenu]);

  const itemClassName =
    "block border-b border-white/5 px-5 py-3.5 font-kumbh text-sm font-normal uppercase tracking-[0.14em] text-white/80 transition-colors duration-200 last:border-b-0 hover:bg-[rgba(88,5,14,0.28)] hover:text-white";

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logoutAction();
      window.location.assign("/");
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <header className="relative z-50 border-b border-white/15">
      <div className="relative mx-auto flex h-[79px] max-w-[1280px] items-center justify-between px-6 md:px-[35px]">
        <div ref={menuRef} className="relative z-50">
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-[30px] w-[26px] flex-col justify-center gap-[5px]"
            onClick={() => (open ? closeMenu() : openMenu())}
          >
            <span
              className={`block h-[2px] w-full origin-center bg-[#8e0314] transition-transform duration-250 ease-out ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-full bg-[#8e0314] transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-full origin-center bg-[#8e0314] transition-transform duration-250 ease-out ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>

          {menuVisible ? (
            <nav
              aria-label="Site menu"
              data-state={closing ? "closing" : "open"}
              className="menu-dropdown absolute left-0 top-[calc(100%+14px)] min-w-[220px] overflow-hidden rounded-[10px] border border-[rgba(142,3,20,0.22)] bg-[rgba(88,5,14,0.12)] shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
            >
              {menuItems.map((item) =>
                item.href === "#" ? (
                  <a
                    key={item.label}
                    href="#"
                    className={itemClassName}
                    onClick={(e) => {
                      e.preventDefault();
                      closeMenu();
                    }}
                  >
                    {item.label}
                  </a>
                ) : item.href === "/admin" ? (
                  // Full navigation so /admin proxy + layout auth re-read the session cookie
                  <a
                    key={item.label}
                    href="/admin"
                    className={itemClassName}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={itemClassName}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          ) : null}
        </div>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-jersey text-[28px] leading-none text-white md:text-[36px]"
        >
          {SITE_NAME}
        </Link>

        {isLoggedIn ? (
          <button
            type="button"
            disabled={signingOut}
            className="glass-button flex h-10 w-[130px] items-center justify-center rounded-[10px] font-kumbh text-sm font-semibold text-white disabled:opacity-60"
            onClick={handleSignOut}
          >
            {signingOut ? "…" : "LOG OUT"}
          </button>
        ) : isLoading ? (
          <span className="flex h-10 w-[130px]" aria-hidden />
        ) : (
          <Link
            href="/login"
            className="glass-button flex h-10 w-[130px] items-center justify-center rounded-[10px] font-kumbh text-sm font-semibold text-white"
          >
            LOG IN
          </Link>
        )}
      </div>
    </header>
  );
}
