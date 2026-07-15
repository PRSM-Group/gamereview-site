"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/seed-data";

const MENU_ITEMS = [
  { label: "BROWSE", href: "/browse" },
  { label: "REVIEWS", href: "#" },
  { label: "MY PROFILE", href: "#" },
] as const;

const CLOSE_MS = 180;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const menuVisible = open || closing;

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

  function closeMenu() {
    if (!open && !closing) return;
    clearCloseTimer();
    setOpen(false);
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setClosing(false);
      closeTimer.current = null;
    }, CLOSE_MS);
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

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuVisible]);

  const itemClassName =
    "block border-b border-white/5 px-5 py-3.5 font-kumbh text-sm font-normal uppercase tracking-[0.14em] text-white/80 transition-colors duration-200 last:border-b-0 hover:bg-[rgba(88,5,14,0.28)] hover:text-white";

  return (
    <header className="relative z-40 border-b border-white/15">
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
              className="menu-dropdown absolute left-0 top-[calc(100%+14px)] min-w-[180px] overflow-hidden rounded-[10px] border border-[rgba(142,3,20,0.22)] bg-[rgba(88,5,14,0.12)] shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
            >
              {MENU_ITEMS.map((item) =>
                item.href === "#" ? (
                  <a
                    key={item.label}
                    href="#"
                    className={itemClassName}
                    onClick={closeMenu}
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

        <a
          href="#"
          className="glass-button flex h-10 w-[130px] items-center justify-center rounded-[10px] font-kumbh text-sm font-semibold text-white"
        >
          LOG IN
        </a>
      </div>
    </header>
  );
}
