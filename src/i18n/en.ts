// English dictionary. The shape of this object is the contract:
// rw.ts must provide every key, or TypeScript will refuse to compile.

export const en = {
  nav: {
    about: "About us",
    ministries: "Ministries",
    gatherings: "Gatherings",
    contact: "Contact",
    memberLogin: "Member login",
    joinFamily: "Join the family",
    joinUs: "Join us",
    toggleMenu: "Toggle menu",
    language: "Language",
  },

  alt: {
    hero: "Worship leaders singing together",
    singer: "A worship leader singing",
  },

  hero: {
    tagline: " Love· Serve· Worship",
    eyebrow: "One family, one sound, one purpose",
    titleLine1: "Worship that",
    titleLine2: "shapes lives.",
    body: "A community of believers growing in faith, discovering their gifts, and serving God together through music, prayer, and fellowship.",
    becomeMember: "Become a member",
    inviteMinistry: "Invite the ministry",
  },

  stats: [
    { top: "Sunday", main: "5:00 PM", sub: "Weekly rehearsal" },
    { top: "Monthly", main: "Prayer & fasting", sub: "Growing together" },
    { top: "1,500 RWF", main: "Monthly giving", sub: "Shared commitment" },
    { top: "70%", main: "Attendance goal", sub: "Faithful service" },
  ],

  about: {
    eyebrow: "Who we are",
    titleLine1: "More than a choir.",
    titleLine2Prefix: "We are a ",
    titleLine2Em: "family.",
    body: "We bring together people from different churches with one shared desire: to serve Jesus Christ and help others encounter Him through wholehearted worship.",
    visionLabel: "Our vision",
    vision: "Every member known, equipped, and given room to serve with purpose.",
  },

  ministries: {
    eyebrow: "Find your place",
    titleLine1: "There is room for",
    titleLine2Prefix: "your ",
    titleLine2Em: "gift.",
    intro:
      "Whether your calling is on the platform or behind the scenes, we help you discover where you can grow and serve.",
    explore: "Explore this ministry",
    items: [
      {
        title: "Ministry of Singers",
        body: "Grow your voice, learn to lead worship, and serve across our soprano, alto, and tenor groups.",
      },
      {
        title: "Intercession & Prayer",
        body: "Stand with the ministry in prayer and help build a culture rooted in spiritual depth.",
      },
      {
        title: "Care & Fellowship",
        body: "Make every member feel known through practical love, compassion, and shared community.",
      },
    ],
  },

  gatherings: {
    rhythmLabel: "Our rhythm",
    rhythmTitle: "Faithfulness grows here.",
    eyebrow: "Gather with us",
    titleLine1: "Built through a",
    titleLine2Prefix: "shared ",
    titleLine2Em: "rhythm.",
    items: [
      { label: "Every Sunday", title: "Weekly rehearsal", time: "5:00 PM sharp" },
      { label: "Once a month", title: "Prayer & fasting", time: "Date announced monthly" },
      { label: "Every Sunday", title: "Church fellowship", time: "At your local church" },
    ],
  },

  cta: {
    title: "Your journey has a place here.",
    body: "You do not need to have every gift figured out. Come willing to grow, and we will walk with you.",
    button: "Start your application",
  },

  footer: {
    tagline: "Serve · Grow · Worship",
    inquiry: "General inquiry",
    invitation: "Official invitation",
    portal: "Member portal",
    copyright: "© 2026 The Worship Family",
    location: "Kigali, Rwanda",
  },

  modal: {
    close: "Close",
  },

  common: {
    select: "Select",
    sending: "Sending…",
    email: "Email address",
  },

  thanks: {
    title: "Thank you",
    subtitle: "Your information has been received.",
    invitationTitle: "Invitation received",
    applicationTitle: "Application submitted",
    messageTitle: "Message sent",
    // {ref} is replaced with the reference number when the server returns one
    invitationRef: "Your reference is {ref}. ",
    invitationBody:
      "This confirms receipt, not acceptance. Leadership will contact you after review.",
    generalBody:
      "A ministry leader will review your submission and contact you using the email address provided.",
    back: "Return to website",
  },

  login: {
    title: "Welcome back",
    subtitle: "Sign in to your member portal.",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    remember: "Remember me",
    forgot: "Forgot password?",
    submit: "Sign in to portal",
    demo: "Demo mode: enter any email and password.",
  },

  contact: {
    title: "Send an inquiry",
    subtitle: "We would be glad to hear from you.",
    name: "Your name",
    subject: "Subject",
    message: "Message",
    submit: "Send inquiry",
  },

  invite: {
    title: "Invite the ministry",
    subtitle: "Submit an official invitation for leadership review.",
    organization: "Church or organization",
    contactName: "Contact person's name",
    phone: "Phone number",
    eventName: "Event name",
    proposedDate: "Proposed date",
    eventLocation: "Event location",
    eventDescription: "Event description",
    letter: "Invitation letter (optional)",
    note: "Submitting an invitation confirms receipt only. It does not mean the ministry has accepted the invitation.",
    submit: "Submit official invitation",
  },

  apply: {
    title: "Membership application",
    subtitle: "Tell us about yourself, your journey, and how you hope to serve.",
    section1: "01 · Personal information",
    section2: "02 · Your journey and gifts",
    section3: "03 · Membership commitments",
    fullName: "Full names",
    age: "Age",
    gender: "Gender",
    female: "Female",
    male: "Male",
    maritalStatus: "Marital status",
    single: "Single",
    married: "Married",
    residence: "Residence",
    church: "Church currently attending",
    documents: "Supporting documents (optional)",
    ministry: "Ministry of interest",
    ministryOptions: {
      singers: "Ministry of Singers",
      intercession: "Intercession & Prayer",
      care: "Care & Fellowship",
      guidance: "I would appreciate guidance",
    },
    journey: "Tell us about your spiritual journey",
    abilities: "What abilities, talents, or interests would you like to develop?",
    clarity: "How clear are you about where you would like to serve?",
    clarityOptions: {
      know: "I know where I would like to serve",
      ideas: "I have a few ideas",
      guidance: "I would appreciate guidance",
      notYet: "I have not discovered my gifts yet",
    },
    commitments:
      "I commit to Christian discipline, Sunday rehearsal at 5:00 PM, prayer gatherings, care for fellow members, monthly giving of 1,500 RWF, local church fellowship, and respect for ministry leadership.",
    accept:
      "I have read and accept these commitments. I understand this does not automatically mean acceptance into the ministry.",
    submit: "Submit membership application",
  },

  files: {
    choose: "Choose file",
    chooseMany: "Choose files",
    none: "No file chosen",
    count: "{n} files selected",
    remove: "Remove",
    hint: "PDF, DOC, DOCX, JPG, PNG or WebP · up to {max} MB",
    hintMany: "PDF, DOC, DOCX, JPG, PNG or WebP · up to {count} files, {max} MB each",
    problems: {
      type: "“{name}” is not a supported file type. Please use PDF, DOC, DOCX, JPG, PNG or WebP.",
      size: "“{name}” is larger than {max} MB.",
      empty: "“{name}” is empty.",
      duplicate: "“{name}” has already been added.",
      count: "“{name}” was not added. You can attach up to {count} files.",
      total: "“{name}” was not added. The files together may not exceed {total} MB.",
    },
  },

  errors: {
    network:
      "We could not reach the server. Please check your internet connection and try again.",
    timeout: "This is taking too long. Please try again in a moment.",
    too_large: "Your files are too large. Please attach smaller files and try again.",
    invalid_file:
      "One of your files is not a supported type. Please use PDF, DOC, DOCX, JPG or PNG.",
    invalid_input:
      "Some required information is missing or incorrect. Please review the form.",
    server: "Something went wrong while sending your submission. Please try again.",
    rate_limited:
      "Too many submissions from your connection. Please wait a few minutes and try again.",
  },

  // Replaces the browser's own (browser-language) form validation bubbles
  validation: {
    required: "Please fill out this field.",
    select: "Please select an option.",
    checkbox: "Please tick this box if you want to continue.",
    email: "Please enter a valid email address.",
    minValue: "Value must be {min} or greater.",
    invalid: "Please check this field.",
  },
};

export type Dictionary = typeof en;
