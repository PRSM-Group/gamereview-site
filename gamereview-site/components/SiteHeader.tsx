import { SITE_NAME } from "@/lib/seed-data";

export function SiteHeader() {
  return (
    <header className="relative border-b border-white/15">
      <div className="mx-auto flex h-[79px] max-w-[1280px] items-center justify-between px-6 md:px-[35px]">
        <button
          type="button"
          aria-label="Menu"
          className="flex h-[30px] w-[26px] flex-col justify-center gap-[5px]"
        >
          <span className="block h-[2px] w-full bg-white" />
          <span className="block h-[2px] w-full bg-white" />
          <span className="block h-[2px] w-full bg-white" />
        </button>

        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-jersey text-[28px] leading-none text-white md:text-[36px]">
          {SITE_NAME}
        </p>

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
