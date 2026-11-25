// Kinyarwanda dictionary. Must match the shape of en.ts exactly.
// NOTE: have a native speaker from the ministry review these before launch.

import type { Dictionary } from "./en.ts";

export const rw: Dictionary = {
  nav: {
    about: "Abo turi bo",
    ministries: "Imirimo",
    gatherings: "Amateraniro",
    contact: "Twandikire",
    memberLogin: "Login",
    joinFamily: "Ba umunyamuryango",
    joinUs: "Iyunge natwe",
    toggleMenu: "Fungura cyangwa funga menyu",
    language: "Ururimi",
  },

  alt: {
    hero: "Abayobozi b'kuramya baririmbana",
    singer: "Umuyobozi w'kuramya aririmba",
  },

  hero: {
    tagline: "Urukundo · Gukorera Imana · Kuramya",
    eyebrow: "Umuryango umwe, ijwi rimwe, ibyiringiro b'imwe",
    titleLine1: "Kuramya",
    titleLine2: "guhindura ubuzima.",
    body: "Umuryango w'abizera bakura mu kwizera, bavumbura impano zabo, kandi bakorera Imana hamwe binyuze mu muziki, mu masengesho no mu busabane.",
    becomeMember: "Ba umunyamuryango",
    inviteMinistry: "Tumira umurimo wacu",
  },

  stats: [
    { top: "Ku cyumweru", main: "Saa 17:00", sub: "Imyitozo ya buri cyumweru" },
    { top: "Buri kwezi", main: "Amasengesho no kwiyiriza ubusa", sub: "Dukurira hamwe" },
    { top: "Igihembwe", main: "Gufasha", sub: "Inshingano duhuriyeho" },
    { top: "70%", main: "Intego yo kwitabira", sub: "Gukorera mu budahemuka" },
  ],

  about: {
    eyebrow: "Abo turi bo",
    titleLine1: "Turenze korali.",
    titleLine2Prefix: "Turi ",
    titleLine2Em: "umuryango.",
    body: "Duhuriza hamwe abantu bo mu matorero atandukanye bafite icyifuzo kimwe: gukorera Yesu Kristo no gufasha abandi kumusanganira binyuze mu kuramya k'umutima wose.",
    visionLabel: "Icyerekezo cyacu",
    vision:
      "Buri munyamuryango azwi, ashyigikirwa, kandi ahabwa umwanya wo gukorera Imana n'umutima ushima.",
  },

  ministries: {
    eyebrow: "Shaka umwanya wawe",
    titleLine1: "Hari umwanya",
    titleLine2Prefix: "w'",
    titleLine2Em: "impano yawe.",
    intro:
      "Waba uhamagariwe gukorera imbere y'abantu cyangwa inyuma y'ibikorwa, tugufasha kumenya aho wakurira ukanakorera.",
    explore: "Menya byinshi kuri uyu murimo",
    items: [
      {
        title: "Umurimo w'Abaririmbyi",
        body: "Zamura ijwi ryawe, wige kuyobora kuramya, ukorere mu matsinda yacu ya soprano, alto na tenor.",
      },
      {
        title: "Gusabira Abandi n'Amasengesho",
        body: "Fatanya n'umurimo mu isengesho, ufashe kubaka umuco ushingiye ku mizi yimbitse yo mu mwuka.",
      },
      {
        title: "Kwitana n'Ubusabane",
        body: "Tuma buri munyamuryango yumva azwi binyuze mu rukundo rugaragarira mu bikorwa, impuhwe n'ubusabane.",
      },
    ],
  },

  gatherings: {
    rhythmLabel: "Gahunda yacu",
    rhythmTitle: "Ubudahemuka bukurira hano.",
    eyebrow: "Duhurire hamwe",
    titleLine1: "Twubakwa na",
    titleLine2Prefix: "gahunda ",
    titleLine2Em: "duhuriyeho.",
    items: [
      { label: "Buri cyumweru", title: "Imyitozo ya buri cyumweru", time: "Saa 17:00 ku gihe" },
      { label: "Rimwe mu kwezi", title: "Amasengesho no kwiyiriza ubusa", time: "Itariki itangazwa buri kwezi" },
      { label: "Buri cyumweru", title: "Ubusabane bw'itorero", time: "Mu itorero ryawe" },
    ],
  },

  cta: {
    title: "Urugendo rwawe rufite umwanya hano.",
    body: "Ntukeneye kuba warabonye impano zawe zose. Ngwino witeguye gukura, natwe tuzagenda nawe.",
    button: "Tangira kwiyandikisha",
  },

  footer: {
    tagline: "Gukorera · Gukura · Kuramya",
    inquiry: "Ikibazo rusange",
    invitation: "Ubutumire bwemewe",
    portal: "Urubuga rw'abanyamuryango",
    copyright: "© 2026 The Worship Family",
    location: "Kigali, u Rwanda",
  },

  modal: {
    close: "Funga",
  },

  common: {
    select: "Hitamo",
    sending: "Birimo koherezwa…",
    email: "Aderesi ya imeri",
  },

  thanks: {
    title: "Murakoze",
    subtitle: "Amakuru yawe yakiriwe.",
    invitationTitle: "Ubutumire bwakiriwe",
    applicationTitle: "Ubusabe bwoherejwe",
    messageTitle: "Ubutumwa bwoherejwe",
    invitationRef: "Nimero yawe ikurikirana ni {ref}. ",
    invitationBody:
      "Ibi bigaragaza ko twakiriye ubutumire, ntibisobanura ko bwemewe. Abayobozi bazakuvugisha nyuma yo kubusuzuma.",
    generalBody:
      "Umuyobozi w'umurimo azasuzuma ibyo wohereje, akugezeho igisubizo akoresheje imeri watanze.",
    back: "Subira ku rubuga",
  },

  login: {
    title: "Murakaza neza",
    subtitle: "Injira mu rubuga rw'abanyamuryango.",
    emailPlaceholder: "wowe@example.com",
    password: "Ijambobanga",
    passwordPlaceholder: "Andika ijambobanga ryawe",
    remember: "Unyibuke",
    forgot: "Wibagiwe ijambobanga?",
    submit: "Injira mu rubuga",
    demo: "Uburyo bwo kugerageza: andika imeri n'ijambobanga iryo ari ryo ryose.",
  },

  contact: {
    title: "Ohereza ikibazo",
    subtitle: "Tuzishimira kukumva.",
    name: "Amazina yawe",
    subject: "Impamvu",
    message: "Ubutumwa",
    submit: "Ohereza ikibazo",
  },

  invite: {
    title: "Kudutumira",
    subtitle: "Ohereza ubutumire bwemewe kugira ngo abayobozi babusuzume.",
    organization: "Itorero cyangwa umuryango",
    contactName: "Amazina y'ukuvugisha",
    phone: "Nimero ya telefoni",
    eventName: "Izina ry'igikorwa",
    proposedDate: "Itariki iteganyijwe",
    eventLocation: "Aho igikorwa kizabera",
    eventDescription: "Ibisobanuro by'igikorwa",
    letter: "Ibaruwa y'ubutumire (si itegeko)",
    note: "Kohereza ubutumire bigaragaza ko twabwakiriye gusa. Ntibisobanura ko umurimo wemeye ubutumire.",
    submit: "Ohereza ubutumire bwemewe",
  },

  apply: {
    title: "Gusaba kuba umunyamuryango",
    subtitle: "Tubwire ibyawe, urugendo rwawe, n'uko wifuza gukorera.",
    section1: "01 · Amakuru bwite",
    section2: "02 · Urugendo rwawe n'impano zawe",
    section3: "03 · Inshingano z'abanyamuryango",
    fullName: "Amazina yose",
    age: "Imyaka",
    gender: "Igitsina",
    female: "Gore",
    male: "Gabo",
    maritalStatus: "Irangamimerere",
    single: "Ingaragu",
    married: "Narubatse",
    residence: "Aho utuye",
    church: "Itorero usengeramo ubu",
    documents: "Inyandiko zishyigikira ubusabe (si itegeko)",
    ministry: "Umurimo wifuza gukoreramo",
    ministryOptions: {
      singers: "Umurimo w'Abaririmbyi",
      intercession: "Gusabira Abandi n'Amasengesho",
      care: "Kwitanaho n'Ubusabane",
      guidance: "Nakwishimira kugirwa inama",
    },
    journey: "Tubwire ku rugendo rwawe rwo mu mwuka",
    abilities: "Ni izihe impano cyangwa ibyo ukunda wifuza guteza imbere?",
    clarity: "Usobanukiwe ute aho wifuza gukorera?",
    clarityOptions: {
      know: "Nzi aho nifuza gukorera",
      ideas: "Mfite ibitekerezo bike",
      guidance: "Nakwishimira kugirwa inama",
      notYet: "Sindavumbura impano zanjye",
    },
    commitments:
      "Niyemeje kubaho nk'umukristo ugira imyitwarire myiza, kwitabira imyitozo yo ku cyumweru saa 17:00, amateraniro y'amasengesho, kwita ku bandi banyamuryango, gutanga umusanzu wa 1,500 RWF buri kwezi, ubusabane mu itorero ryanjye, no kubaha abayobozi b'umurimo.",
    accept:
      "Nasomye kandi nemeye izi nshingano. Nsobanukiwe ko ibi bitavuze ko nahise nemererwa kwinjira mu murimo.",
    submit: "Ohereza ubusabe bwo kuba umunyamuryango",
  },

  files: {
    choose: "Hitamo dosiye",
    chooseMany: "Hitamo dosiye",
    none: "Nta dosiye yahiswemo",
    count: "Dosiye {n} zahiswemo",
    remove: "Kuraho",
    hint: "PDF, DOC, DOCX, JPG, PNG cyangwa WebP · kugeza kuri {max} MB",
    hintMany:
      "PDF, DOC, DOCX, JPG, PNG cyangwa WebP · dosiye zigera kuri {count}, buri imwe kugeza kuri {max} MB",
    problems: {
      type: "“{name}” ntiyemewe. Koresha PDF, DOC, DOCX, JPG, PNG cyangwa WebP.",
      size: "“{name}” iruta {max} MB.",
      empty: "“{name}” nta kintu irimo.",
      duplicate: "“{name}” yamaze kongerwamo.",
      count: "“{name}” ntiyongewemo. Ushobora gushyiraho dosiye zigera kuri {count}.",
      total: "“{name}” ntiyongewemo. Dosiye zose hamwe ntizigomba kurenga {total} MB.",
    },
  },

  errors: {
    network:
      "Ntitwashoboye kugera kuri seriveri. Reba interineti yawe hanyuma wongere ugerageze.",
    timeout: "Ibi byafashe igihe kirekire. Ongera ugerageze nyuma y'akanya.",
    too_large: "Dosiye zawe ziremereye cyane. Ongera ugerageze ukoresheje dosiye ntoya.",
    invalid_file:
      "Imwe muri dosiye zawe ntiyemewe. Koresha PDF, DOC, DOCX, JPG cyangwa PNG.",
    invalid_input:
      "Hari amakuru akenewe abuze cyangwa atari yo. Ongera usuzume ifishi.",
    server: "Hari ikitagenze neza mu kohereza. Ongera ugerageze.",
    rate_limited: "Wohereje inshuro nyinshi cyane. Tegereza iminota mike hanyuma wongere ugerageze.",
  },

  validation: {
    required: "Uzuza uyu mwanya.",
    select: "Hitamo kimwe.",
    checkbox: "Emera iyi nshingano kugira ngo ukomeze.",
    email: "Andika aderesi ya imeri yemewe.",
    minValue: "Agaciro kagomba kuba {min} cyangwa kayirenga.",
    invalid: "Suzuma ibyo wanditse hano.",
  },
};
