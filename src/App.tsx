import {
  type ChangeEvent,
  type FormEvent,
  type FormHTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import heroImage from "./assets/images/background.jpeg"
import singerImage from "./assets/images/second.jpeg"
import { submitForm, SubmitError, type SubmitErrorCode } from "./lib/api";
import { useLang } from "./i18n/context";
import {
  ACCEPT_ATTR,
  FILE_LIMITS,
  formatSize,
  validateFiles,
  type FileProblem,
} from "./lib/fileRules";
type View = "home" | "dashboard";
type Modal = "apply" | "invite" | "contact" | "login" | null;
type DashTab = "overview" | "applications" | "attendance" | "contributions" | "announcements";

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
  | "arrow"
  | "calendar"
  | "check"
  | "chevron"
  | "clock"
  | "close"
  | "document"
  | "eye"
  | "heart"
  | "home"
  | "mail"
  | "menu"
  | "money"
  | "music"
  | "people"
  | "plus"
  | "search"
  | "spark"
  | "trend"
  | "user";
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    calendar: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: <path d="M18 6 6 18M6 6l12 12" />,
    document: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h6" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" />
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    money: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M16 9h2M6 15H4" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l10-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </>
    ),
    people: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) => (
  <button className={`btn btn-${variant} ${className}`} {...props}>
    {children}
  </button>
);

function Logo({
  light = false,
  showMark = true,
  brandLogo = false,
  tagline = "Serve · Grow · Worship",
}: {
  light?: boolean;
  showMark?: boolean;
  brandLogo?: boolean;
  tagline?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {showMark &&
        (brandLogo ? (
          <img
            src="/Ezob_Logo.svg"
            alt="Ezob Praise and Worship"
            className="h-16 w-auto shrink-0 sm:h-20"
          />
        ) : (
          <div
            className={`grid h-10 w-10 place-items-center rounded-full ${light ? "bg-white/12 text-white" : "bg-[#264438] text-white"}`}
          >
            <Icon name="music" className="h-5 w-5" />
          </div>
        ))}
      <div className={light ? "text-white" : "text-[#20332c]"}>
        <p className="font-display text-[19px] font-semibold leading-none tracking-[-0.02em]">
          Ezob Worship Ministry
        </p>
        <p
          className={`mt-1 text-[9px] font-bold uppercase tracking-[0.25em] ${light ? "text-white/55" : "text-[#96734a]"}`}
        >
          {tagline}
        </p>
      </div>
    </div>
  );
}

function LanguageToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`flex items-center rounded-full border p-0.5 text-[11px] font-bold tracking-[.12em] ${dark ? "border-[#d8d0bf]" : "border-white/25"}`}
    >
      {(["en", "rw"] as const).map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          title={code === "en" ? "English" : "Kinyarwanda"}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`rounded-full px-3 py-1.5 transition ${
            lang === code
              ? "bg-[#dcae67] text-[#20332c]"
              : dark
                ? "text-[#46584f] hover:bg-[#eeece5]"
                : "text-white/75 hover:text-white"
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function PublicHeader({
  openModal,
  enterDashboard,
}: {
  openModal: (m: Modal) => void;
  enterDashboard: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLang();
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-24 max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Logo light showMark={false} tagline={t.hero.tagline} />
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 lg:flex">
          <a href="#about">{t.nav.about}</a>
          <a href="#ministries">{t.nav.ministries}</a>
          <a href="#gatherings">{t.nav.gatherings}</a>
          <button onClick={() => openModal("contact")}>{t.nav.contact}</button>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <Button
            variant="ghost"
            onClick={() => openModal("login")}
            className="text-white hover:bg-white/10"
          >
            {t.nav.memberLogin}
          </Button>
          <Button variant="secondary" onClick={() => openModal("apply")}>
            {t.nav.joinFamily} <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>
        <button
          className="text-white lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t.nav.toggleMenu}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </div>
      {menuOpen && (
        <div className="mx-4 rounded-2xl bg-[#faf8f1] p-5 text-[#20332c] shadow-xl lg:hidden">
          <div className="grid gap-4 text-sm font-semibold">
            <a href="#about">{t.nav.about}</a>
            <a href="#ministries">{t.nav.ministries}</a>
            <a href="#gatherings">{t.nav.gatherings}</a>
          </div>
          <div className="mt-5">
            <LanguageToggle dark />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={enterDashboard}>
              {t.nav.memberLogin}
            </Button>
            <Button onClick={() => openModal("apply")}>{t.nav.joinUs}</Button>
          </div>
        </div>
      )}
    </header>
  );
}

const MINISTRY_META: { num: string; icon: "music" | "heart" | "people"; buttonFont: string }[] = [
  { num: "01", icon: "music", buttonFont: "font-galindo" },
  { num: "02", icon: "heart", buttonFont: "font-galada" },
  { num: "03", icon: "people", buttonFont: "" },
];
const RHYTHM_ICONS = ["music", "heart", "people"] as const;

function Home({
  openModal,
  enterDashboard,
}: {
  openModal: (m: Modal) => void;
  enterDashboard: () => void;
}) {
  const { t } = useLang();
  return (
    <div className="bg-[#f7f4ec] text-[#20332c]">
      <section className="relative min-h-[760px] overflow-hidden bg-[#183229]">
        <img
          src={heroImage}
          alt={t.alt.hero}
          className="absolute inset-0 h-full w-full object-cover object-center shadow-[0_4px_4px_rgba(9,89,36,0.32)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,38,30,.97)_0%,rgba(15,38,30,.74)_42%,rgba(15,38,30,.25)_75%,rgba(15,38,30,.55)_100%)]" />
        <PublicHeader openModal={openModal} enterDashboard={enterDashboard} />
        <div className="relative mx-auto grid min-h-[760px] max-w-[1240px] flex-row items-center px-5 pb-12 pt-32 lg:px-8">
          <div className="max-w-[720px]">
            <div className="eyebrow font-fruktur text-[#e4bd76]">
              <span className="h-px w-9 bg-current" />
              {t.hero.eyebrow}
            </div>
            <h1 className="mt-7 font-display text-[56px] font-medium leading-[0.98] tracking-[-0.045em] text-white sm:text-[76px] lg:text-[92px]">
              {t.hero.titleLine1}
              <br />
              <span className="text-[#e4bd76]">{t.hero.titleLine2}</span>
            </h1>
            <p className="font-diphylleia mt-7 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              {t.hero.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="secondary" className="h-13 px-6" onClick={() => openModal("apply")}>
                {t.hero.becomeMember} <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-13 border border-white/25 px-6 text-white hover:bg-white/10"
                onClick={() => openModal("invite")}
              >
                {t.hero.inviteMinistry}
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-[#10261f]/70 backdrop-blur-sm">
          <div className="mx-auto grid max-w-[1240px] grid-cols-2 divide-x divide-white/10 px-5 sm:grid-cols-4 lg:px-8">
            {t.stats.map(({ top, main, sub }) => (
              <div className="px-4 py-5 sm:px-7" key={main}>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#e4bd76]">
                  {top}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white sm:text-base">{main}</p>
                <p className="mt-0.5 hidden text-xs text-white/45 sm:block">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-32"
      >
        <div>
          <div className="eyebrow text-[#96734a]">
            <span className="h-px w-9 bg-current" />
            {t.about.eyebrow}
          </div>
          <h2 className="section-title mt-5">
            {t.about.titleLine1}
            <br />
            {t.about.titleLine2Prefix}
            <em>{t.about.titleLine2Em}</em>
          </h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="font-diphylleia text-lg leading-8 text-[#4d5e57]">
              {t.about.body}
            </p>
          </div>
          <div className="border-l border-[#d8d0bf] pl-7">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#96734a]">
              {t.about.visionLabel}
            </p>
            <p className="mt-3 font-display text-2xl leading-snug">
              {t.about.vision}
            </p>
          </div>
        </div>
      </section>

      <section id="ministries" className="bg-[#20392f] py-24 text-white lg:py-28">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow text-[#e4bd76]">
                <span className="h-px w-9 bg-current" />
                {t.ministries.eyebrow}
              </div>
              <h2 className="section-title mt-5 text-white">
                {t.ministries.titleLine1}
                <br />
                {t.ministries.titleLine2Prefix}
                <em>{t.ministries.titleLine2Em}</em>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/60">
              {t.ministries.intro}
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/10 md:grid-cols-3">
            {t.ministries.items.map(({ title, body }, i) => (
              <article
                className="group bg-[#20392f] p-8 transition hover:bg-[#29483c] lg:p-10"
                key={title}
              >
                <div className="flex items-center justify-between text-[#e4bd76]">
                  <span className="text-xs font-bold tracking-[.2em]">{MINISTRY_META[i].num}</span>
                  <Icon name={MINISTRY_META[i].icon} className="h-7 w-7" />
                </div>
                <h3 className="mt-14 font-display text-3xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/58">{body}</p>
                <button
                  onClick={() => openModal("apply")}
                  className={`mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#e4bd76] ${MINISTRY_META[i].buttonFont}`}
                >
                  {t.ministries.explore}{" "}
                  <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="gatherings"
        className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32"
      >
        <div className="relative min-h-[480px] overflow-hidden rounded-[2rem]">
          <img
            src={singerImage}
            className="absolute inset-0 h-full w-full object-cover"
            alt={t.alt.singer}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142b23]/85 via-transparent to-transparent" />
          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e4bd76]">
                {t.gatherings.rhythmLabel}
              </p>
              <p className="mt-2 font-display text-3xl">{t.gatherings.rhythmTitle}</p>
            </div>
            <div className="hidden h-12 w-12 place-items-center rounded-full border border-white/30 sm:grid">
              <Icon name="spark" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="eyebrow text-[#96734a]">
            <span className="h-px w-9 bg-current" />
            {t.gatherings.eyebrow}
          </div>
          <h2 className="section-title mt-5">
            {t.gatherings.titleLine1}<br />
            {t.gatherings.titleLine2Prefix}<em>{t.gatherings.titleLine2Em}</em>
          </h2>
          <div className="mt-9 divide-y divide-[#d8d0bf] border-y border-[#d8d0bf]">
            {t.gatherings.items.map(({ label, title, time }, i) => (
              <div className="flex items-center gap-5 py-5" key={title}>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e8e1d2] text-[#765a37]">
                  <Icon name={RHYTHM_ICONS[i]} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#96734a]">
                    {label}
                  </p>
                  <p className="mt-1 font-semibold">{title}</p>
                </div>
                <p className="text-sm text-[#66756f]">{time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#dcae67] px-5 py-20 text-center text-[#20332c]">
        <div className="mx-auto max-w-3xl">
          <Icon name="spark" className="mx-auto h-7 w-7" />
          <h2 className="mt-5 font-display text-4xl font-medium tracking-[-.03em] sm:text-6xl">
            {t.cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#374d44]">
            {t.cta.body}
          </p>
          <Button className="mt-8" onClick={() => openModal("apply")}>
            {t.cta.button} <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <footer className="bg-[#12271f] px-5 py-12 text-white lg:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <Logo light brandLogo tagline={t.footer.tagline} />
          <div className="flex flex-wrap gap-6 text-xs text-white/55">
            <button onClick={() => openModal("contact")}>{t.footer.inquiry}</button>
            <button onClick={() => openModal("invite")}>{t.footer.invitation}</button>
            <button onClick={() => openModal("login")}>{t.footer.portal}</button>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1240px] justify-between border-t border-white/10 pt-6 text-[11px] text-white/35">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.location}</p>
        </div>
      </footer>
    </div>
  );
}

const applications = [
  {
    initials: "IN",
    name: "Ineza Naomi",
    ministry: "Ministry of Singers",
    date: "14 Nov 2026",
    status: "New",
  },
  {
    initials: "EM",
    name: "Emmanuel M.",
    ministry: "Needs guidance",
    date: "12 Nov 2026",
    status: "In review",
  },
  {
    initials: "KA",
    name: "Keza Alice",
    ministry: "Intercession & Prayer",
    date: "08 Nov 2026",
    status: "In review",
  },
];

function Dashboard({ exit }: { exit: () => void }) {
  const [tab, setTab] = useState<DashTab>("overview");
  const [sideOpen, setSideOpen] = useState(false);
  const [toast, setToast] = useState("");
  const nav: [DashTab, string, "home" | "document" | "calendar" | "money" | "mail"][] = [
    ["overview", "Overview", "home"],
    ["applications", "Applications", "document"],
    ["attendance", "Attendance", "calendar"],
    ["contributions", "Contributions", "money"],
    ["announcements", "Announcements", "mail"],
  ];
  const selectTab = (value: DashTab) => {
    setTab(value);
    setSideOpen(false);
  };
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };
  return (
    <div className="min-h-screen bg-[#f3f2ed] text-[#20332c]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[268px] bg-[#173128] p-5 text-white transition-transform lg:translate-x-0 ${sideOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Logo light />
          <button className="lg:hidden" onClick={() => setSideOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#dcae67]">
            Current workspace
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#dcae67] font-display text-[#173128]">
              W
            </div>
            <div>
              <p className="text-sm font-semibold">Main Ministry</p>
              <p className="text-[11px] text-white/45">Leadership team</p>
            </div>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {nav.map(([value, label, icon]) => (
            <button
              onClick={() => selectTab(value)}
              key={value}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${tab === value ? "bg-white text-[#20332c]" : "text-white/58 hover:bg-white/7 hover:text-white"}`}
            >
              <Icon name={icon} className="h-[18px] w-[18px]" />
              {label}
              {value === "applications" && (
                <span className="ml-auto rounded-full bg-[#dcae67] px-2 py-0.5 text-[10px] font-bold text-[#20332c]">
                  6
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 border-t border-white/10 pt-5">
          <button onClick={exit} className="flex w-full items-center gap-3 text-left">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#dcae67] text-sm font-bold text-[#173128]">
              JM
            </div>
            <div>
              <p className="text-sm font-semibold">Jean Mugenzi</p>
              <p className="text-[11px] text-white/45">President</p>
            </div>
            <Icon name="chevron" className="ml-auto h-4 w-4 text-white/35" />
          </button>
        </div>
      </aside>
      {sideOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSideOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}
      <main className="lg:ml-[268px]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#deddd6] bg-white/75 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(true)} className="lg:hidden">
              <Icon name="menu" />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#9b7b52]">
                Leadership portal
              </p>
              <h1 className="mt-0.5 font-display text-xl capitalize">{tab}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-[#deddd6] bg-white text-[#5c6c65]">
              <Icon name="search" className="h-4 w-4" />
            </button>
            <button
              onClick={() => notify("You are all caught up")}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[#deddd6] bg-white text-[#5c6c65]"
            >
              <Icon name="mail" className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#bc6b52]" />
            </button>
          </div>
        </header>
        <div className="p-5 lg:p-8">
          {tab === "overview" && <Overview selectTab={selectTab} notify={notify} />}
          {tab === "applications" && <Applications notify={notify} />}
          {tab === "attendance" && <Attendance notify={notify} />}
          {tab === "contributions" && <Contributions notify={notify} />}
          {tab === "announcements" && <Announcements notify={notify} />}
        </div>
      </main>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#20392f] px-4 py-3 text-sm font-medium text-white shadow-xl">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#dcae67] text-[#20392f]">
            <Icon name="check" className="h-4 w-4" />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#deddd6] bg-white ${className}`}>{children}</div>
  );
}

function Overview({
  selectTab,
  notify,
}: {
  selectTab: (t: DashTab) => void;
  notify: (m: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl tracking-[-.02em] sm:text-4xl">
            Good morning, Jean.
          </h2>
          <p className="mt-2 text-sm text-[#738079]">
            Here is what is happening in the ministry today.
          </p>
        </div>
        <Button onClick={() => notify("Announcement composer opened")}>
          <Icon name="plus" className="h-4 w-4" /> New announcement
        </Button>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["124", "Active members", "+4 this month", "people"],
          ["6", "Pending applications", "2 need review", "document"],
          ["82%", "November attendance", "Above target", "trend"],
          ["88%", "Contributions paid", "109 of 124", "money"],
        ].map(([value, label, detail, icon]) => (
          <Panel className="p-5" key={label}>
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef1ed] text-[#315749]">
                <Icon name={icon as "people"} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#779085]">
                {detail}
              </span>
            </div>
            <p className="mt-6 font-display text-4xl">{value}</p>
            <p className="mt-1 text-sm text-[#68766f]">{label}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.8fr]">
        <Panel>
          <div className="flex items-center justify-between border-b border-[#e6e4dc] p-5">
            <div>
              <h3 className="font-display text-xl">Recent applications</h3>
              <p className="mt-1 text-xs text-[#859089]">
                Applicants waiting for leadership review
              </p>
            </div>
            <button
              onClick={() => selectTab("applications")}
              className="text-xs font-bold text-[#7b5c37]"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-[#eceae4]">
            {applications.map((a) => (
              <div
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 sm:grid-cols-[auto_1fr_1fr_auto] sm:px-5"
                key={a.name}
              >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e4eee8] text-xs font-bold text-[#315749]">
                  {a.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="mt-0.5 text-[11px] text-[#8a958f] sm:hidden">{a.ministry}</p>
                </div>
                <p className="hidden text-xs text-[#6f7d76] sm:block">{a.ministry}</p>
                <span className={`status ${a.status === "New" ? "status-gold" : ""}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl">Next gathering</h3>
              <p className="mt-1 text-xs text-[#859089]">Sunday rehearsal</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4e8d4] text-[#8b6230]">
              <Icon name="calendar" />
            </div>
          </div>
          <div className="mt-7 flex items-end gap-3">
            <p className="font-display text-6xl leading-none">22</p>
            <div className="pb-1">
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9b7b52]">
                November
              </p>
              <p className="mt-1 text-sm">Sunday · 5:00 PM</p>
            </div>
          </div>
          <div className="mt-7 rounded-xl bg-[#f3f5f1] p-4">
            <div className="flex justify-between text-xs">
              <span className="text-[#718078]">Expected members</span>
              <b>124</b>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#dce1dc]">
              <div className="h-full w-[78%] rounded-full bg-[#3f7562]" />
            </div>
          </div>
          <Button
            onClick={() => selectTab("attendance")}
            variant="secondary"
            className="mt-4 w-full"
          >
            Prepare attendance
          </Button>
        </Panel>
      </div>
    </div>
  );
}

function Applications({ notify }: { notify: (m: string) => void }) {
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl">Membership applications</h2>
          <p className="mt-2 text-sm text-[#738079]">
            Review each applicant’s story, gifts, and commitments.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="input-shell">
            <Icon name="search" className="h-4 w-4" />
            <input placeholder="Search applicants" />
          </div>
        </div>
      </div>
      <Panel className="mt-7 overflow-hidden">
        <div className="border-b border-[#e7e5de] bg-[#faf9f5] px-5 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#849088]">
          6 applications require a decision
        </div>
        {[
          ...applications,
          {
            initials: "UM",
            name: "Uwase Marie",
            ministry: "Ministry of Singers",
            date: "03 Nov 2026",
            status: "New",
          },
        ].map((a) => (
          <div
            className="flex flex-col gap-4 border-b border-[#eceae4] p-5 last:border-0 sm:flex-row sm:items-center"
            key={a.name}
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e4eee8] text-xs font-bold text-[#315749]">
              {a.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <p className="font-semibold">{a.name}</p>
                <span className={`status ${a.status === "New" ? "status-gold" : ""}`}>
                  {a.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#78857e]">
                {a.ministry} · Applied {a.date}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="border border-[#dfddd6]"
                onClick={() => notify(`${a.name}'s application opened`)}
              >
                <Icon name="eye" className="h-4 w-4" /> Review
              </Button>
              <Button onClick={() => notify(`${a.name} marked as accepted`)}>Accept</Button>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function Attendance({ notify }: { notify: (m: string) => void }) {
  const rows = [
    ["Ineza Naomi", "17:02", "On time"],
    ["Mugenzi David", "17:08", "On time"],
    ["Keza Alice", "17:14", "Late"],
    ["Emmanuel M.", "—", "Absent"],
  ];
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl">Attendance</h2>
          <p className="mt-2 text-sm text-[#738079]">Sunday rehearsal · 22 November 2026</p>
        </div>
        <Button onClick={() => notify("Attendance session saved")}>
          <Icon name="check" className="h-4 w-4" /> Save session
        </Button>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[
          ["98", "Present"],
          ["7", "Late arrivals"],
          ["19", "Not recorded"],
        ].map(([v, l]) => (
          <Panel className="p-5" key={l}>
            <p className="font-display text-4xl">{v}</p>
            <p className="mt-1 text-sm text-[#748079]">{l}</p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e6e4dc] p-5">
          <h3 className="font-display text-xl">Member register</h3>
          <span className="text-xs text-[#75827b]">Grace period ends at 5:10 PM</span>
        </div>
        {rows.map(([name, time, status]) => (
          <div
            className="grid grid-cols-[1fr_auto_auto] items-center gap-5 border-b border-[#eceae4] px-5 py-4 last:border-0"
            key={name}
          >
            <p className="text-sm font-semibold">{name}</p>
            <div className="flex items-center gap-2 text-xs text-[#6d7a74]">
              <Icon name="clock" className="h-4 w-4" />
              {time}
            </div>
            <select
              className={`attendance-select ${status.toLowerCase().replace(" ", "-")}`}
              defaultValue={status}
            >
              <option>On time</option>
              <option>Late</option>
              <option>Absent</option>
            </select>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function Contributions({ notify }: { notify: (m: string) => void }) {
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl">Monthly contributions</h2>
          <p className="mt-2 text-sm text-[#738079]">
            Restricted financial records · November 2026
          </p>
        </div>
        <Button onClick={() => notify("New payment entry opened")}>
          <Icon name="plus" className="h-4 w-4" /> Record payment
        </Button>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <p className="text-xs font-bold uppercase tracking-[.13em] text-[#829088]">Expected</p>
          <p className="mt-3 font-display text-3xl">186,000 RWF</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs font-bold uppercase tracking-[.13em] text-[#829088]">Received</p>
          <p className="mt-3 font-display text-3xl text-[#376b59]">163,500 RWF</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs font-bold uppercase tracking-[.13em] text-[#829088]">Outstanding</p>
          <p className="mt-3 font-display text-3xl text-[#a45f4a]">22,500 RWF</p>
        </Panel>
      </div>
      <Panel className="mt-5 p-5">
        <div className="flex items-center gap-3 rounded-xl bg-[#eef1ed] p-4 text-sm text-[#51645b]">
          <Icon name="eye" className="h-5 w-5" />
          <p>Only the Treasurer and President can view individual contribution records.</p>
        </div>
        <div className="mt-5 space-y-4">
          {[
            ["Paid in full", 109, "88%"],
            ["Pending", 15, "12%"],
          ].map(([label, count, width], i) => (
            <div key={label}>
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <b>{count} members</b>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#e3e4df]">
                <div
                  className={`h-full rounded-full ${i ? "bg-[#c68970]" : "bg-[#4a7a68]"}`}
                  style={{ width }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Announcements({ notify }: { notify: (m: string) => void }) {
  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl">Announcements</h2>
          <p className="mt-2 text-sm text-[#738079]">
            Publish notices to the right ministry audiences.
          </p>
        </div>
        <Button onClick={() => notify("Announcement composer opened")}>
          <Icon name="plus" className="h-4 w-4" /> New announcement
        </Button>
      </div>
      <div className="mt-7 space-y-4">
        {[
          [
            "Prayer & fasting gathering",
            "All ministry members",
            "Published 16 Nov 2026",
            "Our monthly prayer and fasting gathering will take place this Saturday from 8:00 AM.",
          ],
          [
            "Soprano rehearsal update",
            "Soprano voice group",
            "Published 14 Nov 2026",
            "Section rehearsal moves to Thursday at 6:30 PM this week.",
          ],
          [
            "External ministry invitation",
            "Main leadership committee",
            "Draft",
            "Leadership review is needed for the invitation received from Grace Community Church.",
          ],
        ].map(([title, audience, date, body]) => (
          <Panel className="p-5" key={title}>
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{title}</h3>
                  {date === "Draft" && <span className="status status-gold">Draft</span>}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#697770]">{body}</p>
              </div>
              <button
                onClick={() => notify(`${title} opened`)}
                className="shrink-0 text-xs font-bold text-[#7b5c37]"
              >
                View details
              </button>
            </div>
            <div className="mt-4 flex gap-4 border-t border-[#eceae4] pt-4 text-[11px] text-[#88928d]">
              <span>{audience}</span>
              <span>{date}</span>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// A normal <form> whose built-in browser validation bubbles ("Please fill out this
// field") are replaced with messages in the website's current language.
function LocalizedForm(props: FormHTMLAttributes<HTMLFormElement>) {
  const { t } = useLang();
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const form = ref.current;
    if (!form) return;
    const onInvalid = (e: Event) => {
      const el = e.target as Control;
      const v = el.validity;
      let message: string = t.validation.invalid;
      if (v.valueMissing) {
        message =
          el instanceof HTMLSelectElement
            ? t.validation.select
            : el instanceof HTMLInputElement && el.type === "checkbox"
              ? t.validation.checkbox
              : t.validation.required;
      } else if (v.typeMismatch) {
        message = t.validation.email;
      } else if (v.rangeUnderflow) {
        message = t.validation.minValue.replace("{min}", (el as HTMLInputElement).min);
      }
      el.setCustomValidity(message);
    };
    const onInput = (e: Event) => (e.target as Control).setCustomValidity("");
    form.addEventListener("invalid", onInvalid, true);
    form.addEventListener("input", onInput);
    return () => {
      form.removeEventListener("invalid", onInvalid, true);
      form.removeEventListener("input", onInput);
    };
  }, [t]);
  return <form ref={ref} {...props} />;
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const { t } = useLang();
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#10231d]/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative my-auto w-full ${wide ? "max-w-3xl" : "max-w-lg"} overflow-hidden rounded-2xl bg-[#faf9f5] shadow-2xl`}
      >
        {/* Ezob logo watermark: one faint tone so it reads on the light panel */}
        <img
          src="/Ezob_Logo.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute left-1/2 top-1/2 w-[80%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.07] brightness-0"
        />
        <div className="relative flex items-start justify-between border-b border-[#e5e1d7] p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9a7445]">
              The Worship Family
            </p>
            <h2 className="mt-2 font-display text-3xl">{title}</h2>
            <p className="mt-1 text-sm text-[#738079]">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={t.modal.close}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#edeae2]"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="relative max-h-[72vh] overflow-y-auto p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-[#46584f]">{label}</span>
      {children}
    </label>
  );
}

// A file picker that checks every file the moment it is chosen. Rejected files
// are never dropped silently: each one is listed with the reason. The real
// <input> always holds exactly the accepted files, so the form submits what
// the person sees.
function FileField({
  name,
  label,
  multiple = false,
  maxFiles,
}: {
  name: string;
  label: string;
  multiple?: boolean;
  maxFiles: number;
}) {
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [problems, setProblems] = useState<FileProblem[]>([]);

  const commit = (next: File[]) => {
    const transfer = new DataTransfer();
    next.forEach((file) => transfer.items.add(file));
    if (inputRef.current) inputRef.current.files = transfer.files;
    setFiles(next);
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return commit(files); // dialog cancelled: keep what we had
    const base = multiple ? files : [];
    const result = validateFiles(base, picked, { maxFiles });
    setProblems(result.problems);
    if (multiple) commit([...base, ...result.accepted]);
    else commit(result.accepted.length > 0 ? result.accepted : files);
  };

  const remove = (index: number) => {
    setProblems([]);
    commit(files.filter((_, i) => i !== index));
  };

  const fill = (text: string, file?: string) =>
    text
      .replace("{name}", file ?? "")
      .replace("{max}", String(FILE_LIMITS.maxFileMB))
      .replace("{total}", String(FILE_LIMITS.maxTotalMB))
      .replace("{count}", String(maxFiles))
      .replace("{n}", String(files.length));

  return (
    <div>
      <span className="mb-2 block text-xs font-bold text-[#46584f]">{label}</span>
      <label className="field flex cursor-pointer items-center gap-3 focus-within:border-[#547565] focus-within:shadow-[0_0_0_3px_rgb(84_117_101/0.12)]">
        <input
          ref={inputRef}
          type="file"
          name={name}
          multiple={multiple}
          accept={ACCEPT_ATTR}
          onChange={onPick}
          className="sr-only"
        />
        <span className="shrink-0 rounded-lg bg-[#e8e3d7] px-3 py-2 text-xs font-bold">
          {multiple ? t.files.chooseMany : t.files.choose}
        </span>
        <span className="min-w-0 truncate text-xs text-[#6c7972]">
          {files.length === 0
            ? t.files.none
            : files.length === 1
              ? files[0].name
              : fill(t.files.count)}
        </span>
      </label>
      <p className="mt-2 text-[11px] text-[#87918c]">
        {fill(multiple ? t.files.hintMany : t.files.hint)}
      </p>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex items-center gap-3 rounded-lg bg-[#f0ece1] px-3 py-2 text-xs text-[#46584f]"
            >
              <span className="min-w-0 flex-1 truncate font-semibold">{file.name}</span>
              <span className="shrink-0 text-[#87918c]">{formatSize(file.size)}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`${t.files.remove}: ${file.name}`}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e3ded1]"
              >
                <Icon name="close" className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {problems.length > 0 && (
        <div
          role="alert"
          className="mt-3 space-y-1 rounded-xl border border-[#e6c4b8] bg-[#f8ebe5] p-4 text-xs leading-5 text-[#8a4630]"
        >
          {problems.map((problem, i) => (
            <p key={i}>{fill(t.files.problems[problem.code], problem.name)}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function FormError({ code }: { code: SubmitErrorCode | null }) {
  const { t } = useLang();
  if (!code) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-[#e6c4b8] bg-[#f8ebe5] p-4 text-xs leading-5 text-[#8a4630]"
    >
      {t.errors[code]}
    </div>
  );
}

function SubmitLabel({ sending, children }: { sending: boolean; children: ReactNode }) {
  const { t } = useLang();
  return sending ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {t.common.sending}
    </>
  ) : (
    <>{children}</>
  );
}

function Modals({ modal, close, login }: { modal: Modal; close: () => void; login: () => void }) {
  const { t, lang } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<SubmitErrorCode | null>(null);
  const [reference, setReference] = useState("");
  if (!modal) return null;
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || modal === "login") return;
    setError(null);
    setSending(true);
    try {
      const data = new FormData(e.currentTarget);
      data.append("language", lang); // lets the admin email show which language was used
      const result = await submitForm(modal, data);
      setReference(result.reference ?? "");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof SubmitError ? err.code : "server");
    } finally {
      setSending(false);
    }
  };
  if (submitted)
    return (
      <ModalShell title={t.thanks.title} subtitle={t.thanks.subtitle} onClose={close}>
        <div className="py-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dcebe3] text-[#315f4f]">
            <Icon name="check" className="h-8 w-8" />
          </div>
          <h3 className="mt-5 font-display text-2xl">
            {modal === "invite"
              ? t.thanks.invitationTitle
              : modal === "apply"
                ? t.thanks.applicationTitle
                : t.thanks.messageTitle}
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6c7972]">
            {modal === "invite"
              ? `${reference ? t.thanks.invitationRef.replace("{ref}", reference) : ""}${t.thanks.invitationBody}`
              : t.thanks.generalBody}
          </p>
          <Button onClick={close} className="mt-6">
            {t.thanks.back}
          </Button>
        </div>
      </ModalShell>
    );
  if (modal === "login")
    return (
      <ModalShell title={t.login.title} subtitle={t.login.subtitle} onClose={close}>
        <LocalizedForm
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="space-y-4"
        >
          <Field label={t.common.email}>
            <input className="field" type="email" placeholder={t.login.emailPlaceholder} required />
          </Field>
          <Field label={t.login.password}>
            <input className="field" type="password" placeholder={t.login.passwordPlaceholder} required />
          </Field>
          <div className="flex justify-between text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> {t.login.remember}
            </label>
            <button type="button" className="font-bold text-[#7d5c33]">
              {t.login.forgot}
            </button>
          </div>
          <Button className="w-full">
            {t.login.submit} <Icon name="arrow" className="h-4 w-4" />
          </Button>
          <p className="text-center text-[11px] text-[#87918c]">
            {t.login.demo}
          </p>
        </LocalizedForm>
      </ModalShell>
    );
  if (modal === "contact")
    return (
      <ModalShell
        title={t.contact.title}
        subtitle={t.contact.subtitle}
        onClose={close}
      >
        <LocalizedForm onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.contact.name}>
              <input className="field" name="name" required />
            </Field>
            <Field label={t.common.email}>
              <input className="field" name="email" type="email" required />
            </Field>
          </div>
          <Field label={t.contact.subject}>
            <input className="field" name="subject" required />
          </Field>
          <Field label={t.contact.message}>
            <textarea className="field min-h-28" name="message" required />
          </Field>
          <FormError code={error} />
          <Button className="w-full" disabled={sending}>
            <SubmitLabel sending={sending}>
              {t.contact.submit} <Icon name="arrow" className="h-4 w-4" />
            </SubmitLabel>
          </Button>
        </LocalizedForm>
      </ModalShell>
    );
  if (modal === "invite")
    return (
      <ModalShell
        title={t.invite.title}
        subtitle={t.invite.subtitle}
        onClose={close}
        wide
      >
        <LocalizedForm onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.invite.organization}>
              <input className="field" name="organization" required />
            </Field>
            <Field label={t.invite.contactName}>
              <input className="field" name="contactName" required />
            </Field>
            <Field label={t.common.email}>
              <input className="field" name="email" type="email" required />
            </Field>
            <Field label={t.invite.phone}>
              <input className="field" name="phone" type="tel" required />
            </Field>
            <Field label={t.invite.eventName}>
              <input className="field" name="eventName" required />
            </Field>
            <Field label={t.invite.proposedDate}>
              <input className="field" name="proposedDate" type="date" required />
            </Field>
          </div>
          <Field label={t.invite.eventLocation}>
            <input className="field" name="eventLocation" required />
          </Field>
          <Field label={t.invite.eventDescription}>
            <textarea className="field min-h-24" name="eventDescription" required />
          </Field>
          <FileField name="letter" label={t.invite.letter} maxFiles={1} />
          <div className="rounded-xl bg-[#f0ece1] p-4 text-xs leading-5 text-[#65736c]">
            {t.invite.note}
          </div>
          <FormError code={error} />
          <Button className="w-full" disabled={sending}>
            <SubmitLabel sending={sending}>
              {t.invite.submit} <Icon name="arrow" className="h-4 w-4" />
            </SubmitLabel>
          </Button>
        </LocalizedForm>
      </ModalShell>
    );
  return (
    <ModalShell
      title={t.apply.title}
      subtitle={t.apply.subtitle}
      onClose={close}
      wide
    >
      <LocalizedForm onSubmit={submit} className="space-y-6">
        <div>
          <p className="form-section">{t.apply.section1}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t.apply.fullName}>
              <input className="field" name="fullName" required />
            </Field>
            <Field label={t.apply.age}>
              <input className="field" name="age" type="number" min="16" required />
            </Field>
            <Field label={t.apply.gender}>
              <select className="field" name="gender" required>
                <option value="">{t.common.select}</option>
                <option value="Female">{t.apply.female}</option>
                <option value="Male">{t.apply.male}</option>
              </select>
            </Field>
            <Field label={t.apply.maritalStatus}>
              <select className="field" name="maritalStatus" required>
                <option value="">{t.common.select}</option>
                <option value="Single">{t.apply.single}</option>
                <option value="Married">{t.apply.married}</option>
              </select>
            </Field>
            <Field label={t.apply.residence}>
              <input className="field" name="residence" required />
            </Field>
            <Field label={t.apply.church}>
              <input className="field" name="church" required />
            </Field>
            <Field label={t.common.email}>
              <input className="field" name="email" type="email" required />
            </Field>
            <Field label={t.apply.ministry}>
              <select className="field" name="ministry" required>
                <option value="Ministry of Singers">{t.apply.ministryOptions.singers}</option>
                <option value="Intercession & Prayer">{t.apply.ministryOptions.intercession}</option>
                <option value="Care & Fellowship">{t.apply.ministryOptions.care}</option>
                <option value="I would appreciate guidance">{t.apply.ministryOptions.guidance}</option>
              </select>
            </Field>
          </div>
        </div>
        <div>
          <p className="form-section">{t.apply.section2}</p>
          <div className="mt-4 space-y-4">
            <Field label={t.apply.journey}>
              <textarea className="field min-h-24" name="journey" required />
            </Field>
            <Field label={t.apply.abilities}>
              <textarea className="field min-h-24" name="abilities" required />
            </Field>
            <Field label={t.apply.clarity}>
              <select className="field" name="clarity">
                <option value="I know where I would like to serve">{t.apply.clarityOptions.know}</option>
                <option value="I have a few ideas">{t.apply.clarityOptions.ideas}</option>
                <option value="I would appreciate guidance">{t.apply.clarityOptions.guidance}</option>
                <option value="I have not discovered my gifts yet">{t.apply.clarityOptions.notYet}</option>
              </select>
            </Field>
            <FileField
              name="documents"
              label={t.apply.documents}
              multiple
              maxFiles={FILE_LIMITS.maxDocuments}
            />
          </div>
        </div>
        <div>
          <p className="form-section">{t.apply.section3}</p>
          <div className="mt-4 rounded-xl border border-[#ddd6c7] bg-[#f4f0e6] p-4 text-sm leading-6 text-[#596961]">
            <p>{t.apply.commitments}</p>
            <label className="mt-4 flex items-start gap-3 font-semibold text-[#30483e]">
              <input type="checkbox" className="mt-1" name="commitmentsAccepted" required />
              {t.apply.accept}
            </label>
          </div>
        </div>
        <FormError code={error} />
        <Button className="w-full" disabled={sending}>
          <SubmitLabel sending={sending}>
            {t.apply.submit} <Icon name="arrow" className="h-4 w-4" />
          </SubmitLabel>
        </Button>
      </LocalizedForm>
    </ModalShell>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [modal, setModal] = useState<Modal>(null);
  const login = () => {
    setModal(null);
    setView("dashboard");
    window.scrollTo(0, 0);
  };
  const exit = () => {
    setView("home");
    window.scrollTo(0, 0);
  };
  return (
    <>
      {view === "home" ? (
        <Home openModal={setModal} enterDashboard={login} />
      ) : (
        <Dashboard exit={exit} />
      )}
      <Modals key={modal ?? "closed"} modal={modal} close={() => setModal(null)} login={login} />
    </>
  );
}
