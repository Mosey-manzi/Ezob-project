import { type FormEvent, type ReactNode, useState } from "react";
import heroImage from "./assets/images/background.jpeg"
import singerImage from "./assets/images/second.jpeg"
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
  tagline = "Serve · Grow · Worship",
}: {
  light?: boolean;
  showMark?: boolean;
  tagline?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {showMark && (
        <div
          className={`grid h-10 w-10 place-items-center rounded-full ${light ? "bg-white/12 text-white" : "bg-[#264438] text-white"}`}
        >
          <Icon name="music" className="h-5 w-5" />
        </div>
      )}
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

function PublicHeader({
  openModal,
  enterDashboard,
}: {
  openModal: (m: Modal) => void;
  enterDashboard: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-24 max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Logo light showMark={false} tagline=" Love· Serve· Worship" />
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 lg:flex">
          <a href="#about">About us</a>
          <a href="#ministries">Ministries</a>
          <a href="#gatherings">Gatherings</a>
          <button onClick={() => openModal("contact")}>Contact</button>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="ghost"
            onClick={() => openModal("login")}
            className="text-white hover:bg-white/10"
          >
            Member login
          </Button>
          <Button variant="secondary" onClick={() => openModal("apply")}>
            Join the family <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>
        <button
          className="text-white lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </div>
      {menuOpen && (
        <div className="mx-4 rounded-2xl bg-[#faf8f1] p-5 text-[#20332c] shadow-xl lg:hidden">
          <div className="grid gap-4 text-sm font-semibold">
            <a href="#about">About us</a>
            <a href="#ministries">Ministries</a>
            <a href="#gatherings">Gatherings</a>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={enterDashboard}>
              Member login
            </Button>
            <Button onClick={() => openModal("apply")}>Join us</Button>
          </div>
        </div>
      )}
    </header>
  );
}

function Home({
  openModal,
  enterDashboard,
}: {
  openModal: (m: Modal) => void;
  enterDashboard: () => void;
}) {
  return (
    <div className="bg-[#f7f4ec] text-[#20332c]">
      <section className="relative min-h-[760px] overflow-hidden bg-[#183229]">
        <img
          src={heroImage}
          alt="Worship leaders singing together"
          className="absolute inset-0 h-full w-full object-cover object-center shadow-[0_4px_4px_rgba(9,89,36,0.32)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,38,30,.97)_0%,rgba(15,38,30,.74)_42%,rgba(15,38,30,.25)_75%,rgba(15,38,30,.55)_100%)]" />
        <PublicHeader openModal={openModal} enterDashboard={enterDashboard} />
        <div className="relative mx-auto grid min-h-[760px] max-w-[1240px] flex-row items-center px-5 pb-12 pt-32 lg:px-8">
          <div className="max-w-[720px]">
            <div className="eyebrow font-fruktur text-[#e4bd76]">
              <span className="h-px w-9 bg-current" />
              One family, one sound, one purpose
            </div>
            <h1 className="mt-7 font-display text-[56px] font-medium leading-[0.98] tracking-[-0.045em] text-white sm:text-[76px] lg:text-[92px]">
              Worship that
              <br />
              <span className="text-[#e4bd76]">shapes lives.</span>
            </h1>
            <p className="font-diphylleia mt-7 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              A community of believers growing in faith, discovering their gifts, and serving God
              together through music, prayer, and fellowship.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="secondary" className="h-13 px-6" onClick={() => openModal("apply")}>
                Become a member <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-13 border border-white/25 px-6 text-white hover:bg-white/10"
                onClick={() => openModal("invite")}
              >
                Invite the ministry
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-[#10261f]/70 backdrop-blur-sm">
          <div className="mx-auto grid max-w-[1240px] grid-cols-2 divide-x divide-white/10 px-5 sm:grid-cols-4 lg:px-8">
            {[
              ["Sunday", "5:00 PM", "Weekly rehearsal"],
              ["Monthly", "Prayer & fasting", "Growing together"],
              ["1,500 RWF", "Monthly giving", "Shared commitment"],
              ["70%", "Attendance goal", "Faithful service"],
            ].map(([top, main, sub]) => (
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
            Who we are
          </div>
          <h2 className="section-title mt-5">
            More than a choir.
            <br />
            We are a <em>family.</em>
          </h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="font-diphylleia text-lg leading-8 text-[#4d5e57]">
              We bring together people from different churches with one shared desire: to serve
              Jesus Christ and help others encounter Him through wholehearted worship.
            </p>
          </div>
          <div className="border-l border-[#d8d0bf] pl-7">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#96734a]">
              Our vision
            </p>
            <p className="mt-3 font-display text-2xl leading-snug">
              Every member known, equipped, and given room to serve with purpose.
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
                Find your place
              </div>
              <h2 className="section-title mt-5 text-white">
                There is room for
                <br />
                your <em>gift.</em>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/60">
              Whether your calling is on the platform or behind the scenes, we help you discover
              where you can grow and serve.
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/10 md:grid-cols-3">
            {[
              [
                "01",
                "Ministry of Singers",
                "Grow your voice, learn to lead worship, and serve across our soprano, alto, and tenor groups.",
                "music",
                "font-galindo",
              ],
              [
                "02",
                "Intercession & Prayer",
                "Stand with the ministry in prayer and help build a culture rooted in spiritual depth.",
                "heart",
                "font-galada",
              ],
              [
                "03",
                "Care & Fellowship",
                "Make every member feel known through practical love, compassion, and shared community.",
                "people",
                "",
              ],
            ].map(([num, title, body, icon, buttonFont]) => (
              <article
                className="group bg-[#20392f] p-8 transition hover:bg-[#29483c] lg:p-10"
                key={title}
              >
                <div className="flex items-center justify-between text-[#e4bd76]">
                  <span className="text-xs font-bold tracking-[.2em]">{num}</span>
                  <Icon name={icon as "music"} className="h-7 w-7" />
                </div>
                <h3 className="mt-14 font-display text-3xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/58">{body}</p>
                <button
                  onClick={() => openModal("apply")}
                  className={`mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#e4bd76] ${buttonFont}`}
                >
                  Explore this ministry{" "}
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
            alt="A worship leader singing"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142b23]/85 via-transparent to-transparent" />
          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e4bd76]">
                Our rhythm
              </p>
              <p className="mt-2 font-display text-3xl">Faithfulness grows here.</p>
            </div>
            <div className="hidden h-12 w-12 place-items-center rounded-full border border-white/30 sm:grid">
              <Icon name="spark" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="eyebrow text-[#96734a]">
            <span className="h-px w-9 bg-current" />
            Gather with us
          </div>
          <h2 className="section-title mt-5">
            Built through a<br />
            shared <em>rhythm.</em>
          </h2>
          <div className="mt-9 divide-y divide-[#d8d0bf] border-y border-[#d8d0bf]">
            {[
              ["Every Sunday", "Weekly rehearsal", "5:00 PM sharp", "music"],
              ["Once a month", "Prayer & fasting", "Date announced monthly", "heart"],
              ["Every Sunday", "Church fellowship", "At your local church", "people"],
            ].map(([label, title, time, icon]) => (
              <div className="flex items-center gap-5 py-5" key={title}>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e8e1d2] text-[#765a37]">
                  <Icon name={icon as "music"} />
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
            Your journey has a place here.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#374d44]">
            You do not need to have every gift figured out. Come willing to grow, and we will walk
            with you.
          </p>
          <Button className="mt-8" onClick={() => openModal("apply")}>
            Start your application <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <footer className="bg-[#12271f] px-5 py-12 text-white lg:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <Logo light />
          <div className="flex flex-wrap gap-6 text-xs text-white/55">
            <button onClick={() => openModal("contact")}>General inquiry</button>
            <button onClick={() => openModal("invite")}>Official invitation</button>
            <button onClick={() => openModal("login")}>Member portal</button>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1240px] justify-between border-t border-white/10 pt-6 text-[11px] text-white/35">
          <p>© 2026 The Worship Family</p>
          <p>Kigali, Rwanda</p>
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
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#10231d]/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`my-auto w-full ${wide ? "max-w-3xl" : "max-w-lg"} overflow-hidden rounded-2xl bg-[#faf9f5] shadow-2xl`}
      >
        <div className="flex items-start justify-between border-b border-[#e5e1d7] p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9a7445]">
              The Worship Family
            </p>
            <h2 className="mt-2 font-display text-3xl">{title}</h2>
            <p className="mt-1 text-sm text-[#738079]">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#edeae2]"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[72vh] overflow-y-auto p-5 sm:p-6">{children}</div>
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

function Modals({ modal, close, login }: { modal: Modal; close: () => void; login: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  if (!modal) return null;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  if (submitted)
    return (
      <ModalShell title="Thank you" subtitle="Your information has been received." onClose={close}>
        <div className="py-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dcebe3] text-[#315f4f]">
            <Icon name="check" className="h-8 w-8" />
          </div>
          <h3 className="mt-5 font-display text-2xl">
            {modal === "invite"
              ? "Invitation received"
              : modal === "apply"
                ? "Application submitted"
                : "Message sent"}
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6c7972]">
            {modal === "invite"
              ? "Your reference is TWF-2026-118. This confirms receipt, not acceptance. Leadership will contact you after review."
              : "A ministry leader will review your submission and contact you using the email address provided."}
          </p>
          <Button onClick={close} className="mt-6">
            Return to website
          </Button>
        </div>
      </ModalShell>
    );
  if (modal === "login")
    return (
      <ModalShell title="Welcome back" subtitle="Sign in to your member portal." onClose={close}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="space-y-4"
        >
          <Field label="Email address">
            <input className="field" type="email" placeholder="you@example.com" required />
          </Field>
          <Field label="Password">
            <input className="field" type="password" placeholder="Enter your password" required />
          </Field>
          <div className="flex justify-between text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" className="font-bold text-[#7d5c33]">
              Forgot password?
            </button>
          </div>
          <Button className="w-full">
            Sign in to portal <Icon name="arrow" className="h-4 w-4" />
          </Button>
          <p className="text-center text-[11px] text-[#87918c]">
            Demo mode: enter any email and password.
          </p>
        </form>
      </ModalShell>
    );
  if (modal === "contact")
    return (
      <ModalShell
        title="Send an inquiry"
        subtitle="We would be glad to hear from you."
        onClose={close}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name">
              <input className="field" required />
            </Field>
            <Field label="Email address">
              <input className="field" type="email" required />
            </Field>
          </div>
          <Field label="Subject">
            <input className="field" required />
          </Field>
          <Field label="Message">
            <textarea className="field min-h-28" required />
          </Field>
          <Button className="w-full">
            Send inquiry <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </form>
      </ModalShell>
    );
  if (modal === "invite")
    return (
      <ModalShell
        title="Invite the ministry"
        subtitle="Submit an official invitation for leadership review."
        onClose={close}
        wide
      >
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Church or organization">
              <input className="field" required />
            </Field>
            <Field label="Contact person's name">
              <input className="field" required />
            </Field>
            <Field label="Email address">
              <input className="field" type="email" required />
            </Field>
            <Field label="Phone number">
              <input className="field" type="tel" required />
            </Field>
            <Field label="Event name">
              <input className="field" required />
            </Field>
            <Field label="Proposed date">
              <input className="field" type="date" required />
            </Field>
          </div>
          <Field label="Event location">
            <input className="field" required />
          </Field>
          <Field label="Event description">
            <textarea className="field min-h-24" required />
          </Field>
          <Field label="Invitation letter (optional)">
            <input
              className="field file:mr-3 file:rounded-lg file:border-0 file:bg-[#e8e3d7] file:px-3 file:py-2 file:text-xs file:font-bold"
              type="file"
            />
          </Field>
          <div className="rounded-xl bg-[#f0ece1] p-4 text-xs leading-5 text-[#65736c]">
            Submitting an invitation confirms receipt only. It does not mean the ministry has
            accepted the invitation.
          </div>
          <Button className="w-full">
            Submit official invitation <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </form>
      </ModalShell>
    );
  return (
    <ModalShell
      title="Membership application"
      subtitle="Tell us about yourself, your journey, and how you hope to serve."
      onClose={close}
      wide
    >
      <form onSubmit={submit} className="space-y-6">
        <div>
          <p className="form-section">01 · Personal information</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full names">
              <input className="field" required />
            </Field>
            <Field label="Age">
              <input className="field" type="number" min="16" required />
            </Field>
            <Field label="Gender">
              <select className="field" required>
                <option value="">Select</option>
                <option>Female</option>
                <option>Male</option>
              </select>
            </Field>
            <Field label="Marital status">
              <select className="field" required>
                <option value="">Select</option>
                <option>Single</option>
                <option>Married</option>
              </select>
            </Field>
            <Field label="Residence">
              <input className="field" required />
            </Field>
            <Field label="Church currently attending">
              <input className="field" required />
            </Field>
            <Field label="Email address">
              <input className="field" type="email" required />
            </Field>
            <Field label="Ministry of interest">
              <select className="field" required>
                <option>Ministry of Singers</option>
                <option>Intercession & Prayer</option>
                <option>Care & Fellowship</option>
                <option>I would appreciate guidance</option>
              </select>
            </Field>
          </div>
        </div>
        <div>
          <p className="form-section">02 · Your journey and gifts</p>
          <div className="mt-4 space-y-4">
            <Field label="Tell us about your spiritual journey">
              <textarea className="field min-h-24" required />
            </Field>
            <Field label="What abilities, talents, or interests would you like to develop?">
              <textarea className="field min-h-24" required />
            </Field>
            <Field label="How clear are you about where you would like to serve?">
              <select className="field">
                <option>I know where I would like to serve</option>
                <option>I have a few ideas</option>
                <option>I would appreciate guidance</option>
                <option>I have not discovered my gifts yet</option>
              </select>
            </Field>
          </div>
        </div>
        <div>
          <p className="form-section">03 · Membership commitments</p>
          <div className="mt-4 rounded-xl border border-[#ddd6c7] bg-[#f4f0e6] p-4 text-sm leading-6 text-[#596961]">
            <p>
              I commit to Christian discipline, Sunday rehearsal at 5:00 PM, prayer gatherings, care
              for fellow members, monthly giving of 1,500 RWF, local church fellowship, and respect
              for ministry leadership.
            </p>
            <label className="mt-4 flex items-start gap-3 font-semibold text-[#30483e]">
              <input type="checkbox" className="mt-1" required />I have read and accept these
              commitments. I understand this does not automatically mean acceptance into the
              ministry.
            </label>
          </div>
        </div>
        <Button className="w-full">
          Submit membership application <Icon name="arrow" className="h-4 w-4" />
        </Button>
      </form>
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
      <Modals modal={modal} close={() => setModal(null)} login={login} />
    </>
  );
}
