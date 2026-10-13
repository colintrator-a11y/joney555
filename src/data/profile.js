// Language-independent structure only. Everything a translator would touch
// lives in src/i18n/<locale>.js and is keyed by the ids below.

export const profile = {
  name: 'Joney',
  // Where the contact form and the address beside it both point. This is a
  // static build with no server, so the form composes a mailto: rather than
  // posting anywhere; change this one line and both follow.
  contactEmail: 'joney555.dev@outlook.com',
}

// The four areas the About list names. Each is broader than one category — a
// visitor who clicks "Mobile" means phone work of any kind, games included —
// so a focus selects a set of categories rather than a single one.
// Every way to reach me, in the order they are shown. `value` is what the
// page prints, `href` where it goes: wa.me wants the number with no spaces or
// punctuation, t.me the handle without its @.
export const contactChannels = [
  {
    id: 'email',
    value: profile.contactEmail,
    href: `mailto:${profile.contactEmail}`,
  },
  { id: 'telegram', value: '@joney555', href: 'https://t.me/joney555' },
  { id: 'whatsapp', value: '+1 (857) 822-8963', href: 'https://wa.me/18578228963' },
]

export const focusAreas = {
  mobile: ['mobile'],
  ai: ['ai'],
  fullstack: ['fullstack'],
}

/**
 * Work history, newest first. What a translator would never touch lives here:
 * employer, place, dates and the technologies, which are proper nouns.
 *
 * `start` and `end` are ISO months, not printed strings — the section formats
 * them and works out how long each role lasted, so the current one does not
 * need editing as the months pass. `end: null` means "to this day".
 */
export const experience = [
  {
    id: 'originallyUs',
    company: 'Originally US',
    location: 'Singapore',
    start: '2025-01',
    end: null,
    skills: ['Flutter', 'React Native', 'Python', 'FastAPI', 'OpenAI API', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'techJdi',
    company: 'Tech JDI',
    location: 'Singapore',
    start: '2023-07',
    end: '2024-12',
    skills: ['React', 'TypeScript', 'Python', 'Django', 'FastAPI', 'Docker', 'AWS'],
  },
  {
    id: 'buuuk',
    company: 'Buuuk',
    location: 'Singapore',
    start: '2022-01',
    end: '2023-06',
    skills: ['Flutter', 'Dart', 'React Native', 'TypeScript', 'Firebase', 'REST API'],
  },
  {
    id: 'codigo',
    company: 'Codigo',
    location: 'Singapore',
    start: '2020-07',
    end: '2021-12',
    skills: ['React Native', 'Flutter', 'JavaScript', 'Dart', 'Firebase', 'Git'],
  },
  {
    id: 'vinova',
    company: 'Vinova',
    location: 'Singapore',
    start: '2019-01',
    end: '2020-06',
    skills: ['Python', 'Flask', 'JavaScript', 'MySQL', 'REST API', 'Git'],
  },
]

// The four labels that ring the portrait in the About section. Four because
// the frame has four sides to hang them from.
export const orbitSkills = ['Flutter', 'React Native', 'Python', 'AI']

export const navSections = ['about', 'services', 'skills', 'work', 'experience', 'contact']

export const serviceIds = ['mobile', 'ai', 'fullstack']

export const skillGroups = [
  {
    id: 'mobile',
    items: ['Flutter', 'Dart', 'React Native', 'Android', 'iOS', 'BLoC', 'Redux', 'Firebase'],
  },
  {
    id: 'ai',
    items: ['Python', 'OpenAI API', 'LLM integration', 'Rasa', 'n8n', 'Document processing'],
  },
  {
    id: 'backend',
    items: ['FastAPI', 'Django', 'Flask', 'Node.js', 'REST API', 'PostgreSQL', 'MySQL', 'MongoDB'],
  },
  {
    id: 'frontend',
    items: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 'other',
    items: ['Docker', 'AWS', 'CI/CD', 'Git', 'Linux'],
  },
]

// One entry per project. `media` lists files in src/assets/projects/ with their
// intrinsic size — the dimensions go on the <img> so the row does not jump as
// images load, and the first one's orientation decides the row's proportions.
// `accent` picks the colour band (see the palette in Projects.css) and the
// description lives in the locale files keyed by `id`.
// The work, curated to the headline: mobile apps, AI integration and
// full-stack systems. Declared order is display order — the strongest
// mobile work first, since that is what the title leads with.
//
// Entries with `placeholder: true` are empty slots, kept where the work
// history describes a kind of project the page cannot show yet. They render
// as marked blocks and are left out of every count.
export const projects = [
  {
    id: 'familj',
    name: 'Familj Pregnancy App',
    category: 'mobile',
    accent: 'teal',
    media: [{ file: 'familj.jpg', width: 1400, height: 730 }],
    links: [
      { kind: 'store', href: 'https://play.google.com/store/apps/details?id=com.cmh.familj' },
      { kind: 'appStore', href: 'https://apps.apple.com/us/app/familj-se/id6765674291' },
      { kind: 'demo', href: 'https://youtu.be/muK7w5R2THQ' },
    ],
    tags: ['Flutter', 'React.js', 'Node.js', 'MySQL', 'iOS', 'Android'],
  },
  {
    id: 'trakMd',
    name: 'trakMD Doctor App',
    category: 'mobile',
    accent: 'violet',
    media: [
      { file: 'trakmd-home.jpg', width: 1400, height: 875 },
      { file: 'trakmd-sec1.jpg', width: 800, height: 500 },
      { file: 'trakmd-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'appStore', href: 'https://apps.apple.com/us/app/trakmd-doctor-app/id1476907007' }],
    tags: ['React Native', 'iOS', 'Android', 'Mobile App Development'],
  },
  {
    id: 'keepNote',
    name: 'KeepNote',
    category: 'mobile',
    accent: 'emerald',
    media: [{ file: 'keepnote.jpg', width: 1400, height: 1050 }],
    links: [
      { kind: 'store', href: 'https://play.google.com/store/apps/details?id=net.encoderit.encoderkeepnote' },
    ],
    tags: ['Flutter', 'SQLite', 'iOS Development', 'Mobile App Development', 'Mobile App Testing'],
  },
  {
    id: 'currencyConverter',
    name: 'Encoder Currency Converter',
    category: 'mobile',
    accent: 'slate',
    media: [{ file: 'currency-app.jpg', width: 1400, height: 1050 }],
    links: [
      { kind: 'store', href: 'https://play.google.com/store/apps/details?id=net.encoderit.currency_converter' },
      { kind: 'demo', href: 'https://youtu.be/V3-nlAYCV6o' },
    ],
    tags: ['Flutter', 'FastAPI', 'GetX', 'Firebase', 'Mobile App Development'],
  },
  {
    id: 'aiArt',
    name: 'AI Art Generator App',
    category: 'ai',
    accent: 'rose',
    media: [{ file: 'aiart-app.jpg', width: 1600, height: 1200 }],
    tags: ['Mobile App Development', 'AI Mobile App Development'],
  },
  {
    id: 'slotMobileAi',
    // An empty slot: the experience says this work exists, and there is
    // nothing on the page to show it yet. Replace with the real project —
    // name, media, tags and links — and drop `placeholder`.
    placeholder: true,
    name: 'Project to add',
    category: 'ai',
    accent: 'violet',
    company: 'Originally US',
    stack: ['Flutter', 'React Native', 'Python', 'FastAPI', 'OpenAI API', 'PostgreSQL', 'AWS'],
    media: [],
    tags: [],
  },
  {
    id: 'qalorie',
    name: 'Qalorie: Weight Loss & Health',
    category: 'mobile',
    accent: 'amber',
    media: [
      { file: 'qalorie-site.jpg', width: 1400, height: 677 },
      { file: 'qalorie-screens.jpg', width: 800, height: 387 },
      { file: 'qalorie-appstore.jpg', width: 800, height: 607 },
      { file: 'qalorie-play.jpg', width: 800, height: 438 },
      { file: 'qalorie-backend.jpg', width: 800, height: 500 },
    ],
    tags: ['React Native', 'Redux.js', 'Node.js', 'MongoDB', 'Stripe', 'PayPal API'],
  },
  {
    id: 'ayiko',
    name: 'Ayiko: Ecommerce Platform',
    category: 'mobile',
    accent: 'teal',
    media: [
      { file: 'ayiko-app.jpg', width: 1000, height: 1303 },
      { file: 'ayiko-home.jpg', width: 800, height: 870 },
      { file: 'ayiko-about.jpg', width: 800, height: 870 },
      { file: 'ayiko-dashboard.jpg', width: 800, height: 607 },
      { file: 'ayiko-contact.jpg', width: 800, height: 777 },
      { file: 'ayiko-login.jpg', width: 800, height: 493 },
    ],
    tags: ['Laravel', 'React Native', 'HTML', 'CSS'],
  },
  {
    id: 'eMuvas',
    name: 'E-Muvas Delivery Service',
    category: 'mobile',
    accent: 'emerald',
    media: [
      { file: 'emuvas-customer.jpg', width: 1000, height: 750 },
      { file: 'emuvas-driver.jpg', width: 800, height: 600 },
      { file: 'emuvas-overview.jpg', width: 800, height: 600 },
    ],
    tags: ['React Native', 'Android', 'iOS', 'Node.js', 'MongoDB'],
  },
  {
    id: 'slotDocumentAi',
    // An empty slot: the experience says this work exists, and there is
    // nothing on the page to show it yet. Replace with the real project —
    // name, media, tags and links — and drop `placeholder`.
    placeholder: true,
    name: 'Project to add',
    category: 'ai',
    accent: 'violet',
    company: 'Tech JDI',
    stack: ['Python', 'FastAPI', 'Django', 'Docker', 'AWS'],
    media: [],
    tags: [],
  },
  {
    id: 'rasaHandoff',
    name: 'Human Handoff Demo Using Rasa',
    category: 'ai',
    accent: 'violet',
    media: [{ file: 'rasa-handoff.gif', width: 480, height: 810 }],
    tags: ['Python', 'Git', 'Chatbot', 'Docker', 'REST API'],
  },
  {
    id: 'n8nChatbot',
    name: 'WhatsApp Chatbot Automation with n8n',
    category: 'ai',
    accent: 'teal',
    media: [
      { file: 'n8n-case-study.jpg', width: 1400, height: 1050 },
      { file: 'n8n-workflow.jpg', width: 800, height: 517 },
      { file: 'n8n-report.jpg', width: 800, height: 519 },
      { file: 'n8n-report-2.jpg', width: 800, height: 564 },
    ],
    tags: ['n8n', 'WhatsApp API', 'PostgreSQL', 'Process Automation', 'Chatbot Development'],
  },
  {
    id: 'musicPlayer',
    name: 'Android Music Player · Custom EQ',
    category: 'mobile',
    accent: 'violet',
    media: [{ file: 'music-player.jpg', width: 1400, height: 1050 }],
    // Each `kind` picks its label from projects.links in the locale files.
    links: [{ kind: 'demo', href: 'https://youtu.be/CyUvzhzyjdA' }],
    tags: ['Java', 'Kotlin', 'Android App Development', 'Mobile App Development', 'Mobile App Testing'],
  },
  {
    id: 'enterpriseErp',
    name: 'EnterpriseERP',
    category: 'fullstack',
    accent: 'slate',
    media: [
      { file: 'erp-dashboard.jpg', width: 1400, height: 933 },
      { file: 'erp-finance.jpg', width: 800, height: 533 },
      { file: 'erp-sales.jpg', width: 800, height: 533 },
    ],
    tags: ['PHP', 'Laravel', 'AJAX', 'SaaS'],
  },
  {
    id: 'slotWebPlatform',
    // An empty slot: the experience says this work exists, and there is
    // nothing on the page to show it yet. Replace with the real project —
    // name, media, tags and links — and drop `placeholder`.
    placeholder: true,
    name: 'Project to add',
    category: 'fullstack',
    accent: 'slate',
    company: 'Tech JDI',
    stack: ['React', 'TypeScript', 'Python', 'Django', 'Docker', 'AWS'],
    media: [],
    tags: [],
  },
  {
    id: 'slotFlutterProduct',
    // An empty slot: the experience says this work exists, and there is
    // nothing on the page to show it yet. Replace with the real project —
    // name, media, tags and links — and drop `placeholder`.
    placeholder: true,
    name: 'Project to add',
    category: 'mobile',
    accent: 'teal',
    company: 'Buuuk',
    stack: ['Flutter', 'Dart', 'BLoC', 'Firebase', 'REST API'],
    media: [],
    tags: [],
  },
]

// Declared after `projects` so the headline count follows the list itself.
// The projects with something behind them; the empty slots are not work.
export const shipped = projects.filter((project) => !project.placeholder)

export const stats = [
  { id: 'years', value: '7+' },
  // Rounded down to the ten below, so the hero makes a claim the list always
  // covers: 47 projects shows as 40+, and it only changes when a tenth one
  // is added.
  { id: 'projects', value: `${Math.floor(shipped.length / 10) * 10}+` },
  // Every technology listed in the Skills section, counted rather than typed.
  { id: 'skills', value: String(skillGroups.reduce((sum, group) => sum + group.items.length, 0)) },
  { id: 'since', value: '2019' },
]

// Nothing listed at the moment. The About panel renders only when this has
// an entry, so adding one here (plus a name and detail under
// about.certifications in every locale) brings the panel back.
export const certifications = []
