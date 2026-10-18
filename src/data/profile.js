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
  games: ['games'],
  ecommerce: ['ecommerce'],
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

// The ways to work together offered in the contact section, and the steps a
// piece of work goes through. Ids only: the words are in the locale file.
export const engagements = ['fulltime', 'contract', 'ai']
export const workSteps = ['talk', 'plan', 'build', 'launch']

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
    id: 'commerce',
    items: ['Unity 3D', 'Telegram Mini Apps', 'Shopify', 'WooCommerce', 'WordPress', 'PHP'],
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
    id: 'lordOfTheModels',
    name: 'Lord of the Models — Momentum Inverse Model',
    category: 'fullstack',
    accent: 'amber',
    media: [
      { file: 'lotm-overview.jpg', width: 1400, height: 933 },
      { file: 'lotm-dashboard.jpg', width: 800, height: 500 },
      { file: 'lotm-admin.jpg', width: 800, height: 500 },
    ],
    links: [
      { kind: 'site', href: 'https://lordofthemodels.com' },
      { kind: 'admin', href: 'https://admin.lordofthemodels.com' },
    ],
    tags: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JavaScript', 'Charles Schwab API', 'Trading Automation'],
  },
  {
    id: 'winterDesktops',
    name: 'Winter Desktops — Winter Panda Ecosystem',
    category: 'fullstack',
    accent: 'violet',
    media: [
      { file: 'winter-overview.jpg', width: 1400, height: 933 },
      { file: 'winter-desktop-app.jpg', width: 800, height: 500 },
      { file: 'winter-user-app.jpg', width: 800, height: 500 },
    ],
    links: [
      { kind: 'site', href: 'https://winterdesktops.com' },
      { kind: 'app', href: 'https://app.winterdesktops.com' },
      { kind: 'admin', href: 'https://admin.winterdesktops.com' },
    ],
    tags: ['Tauri', 'Rust', 'React', 'Desktop App Development', 'Web Development', 'Admin Dashboard', 'Responsive Design'],
  },
  {
    id: 'soluna',
    name: 'SoLuna Collective — Wellness Community Platform',
    category: 'fullstack',
    accent: 'violet',
    media: [
      { file: 'soluna-overview.jpg', width: 1400, height: 933 },
      { file: 'soluna-home.jpg', width: 800, height: 500 },
      { file: 'soluna-dashboard.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://solunacollective.org/' }],
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'JavaScript', 'Web Development'],
  },
  {
    id: 'safespace',
    name: 'Safespace — Content Protection Platform',
    category: 'fullstack',
    accent: 'violet',
    media: [
      { file: 'safespace-devices.jpg', width: 1400, height: 866 },
      { file: 'safespace-mobile.jpg', width: 1400, height: 934 },
    ],
    tags: ['Web Development', 'SaaS', 'Dashboard', 'Responsive Design', 'DMCA Automation'],
  },
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
    id: 'yogiApproved',
    name: 'YogiApproved Classes',
    category: 'mobile',
    accent: 'teal',
    media: [{ file: 'yogiapproved.jpg', width: 1400, height: 1050 }],
    links: [
      { kind: 'appStore', href: 'https://apps.apple.com/us/app/ya-classes-yoga-workouts/id1414489703' },
      { kind: 'store', href: 'https://play.google.com/store/apps/details?id=com.yaclasses.app' },
    ],
    tags: ['Java', 'Android', 'iOS Development', 'Mobile App Development', 'iPhone'],
  },
  {
    id: 'playFitt',
    name: 'PlayFitt — Daily Fitness Games',
    category: 'mobile',
    accent: 'emerald',
    media: [{ file: 'playfitt.jpg', width: 1400, height: 1050 }],
    links: [
      { kind: 'store', href: 'https://play.google.com/store/apps/details?id=com.play.playfit2021.smart' },
      { kind: 'appStore', href: 'https://apps.apple.com/us/app/playfitt-daily-workout-game/id1434731178' },
    ],
    tags: ['Flutter', 'PHP', 'Android', 'iOS Development', 'iPhone'],
  },
  {
    id: 'fieldService',
    name: 'Field Service Management Mobile App',
    category: 'mobile',
    accent: 'emerald',
    media: [
      { file: 'fieldservice-dashboard.jpg', width: 752, height: 564 },
      { file: 'fieldservice-fleet.jpg', width: 800, height: 800 },
    ],
    tags: ['Mobile App Development', 'API Integration'],
  },
  {
    id: 'foodNetworkKitchen',
    name: 'Food Network Kitchen',
    category: 'mobile',
    accent: 'amber',
    media: [
      { file: 'fnk-screens.jpg', width: 1400, height: 769 },
      { file: 'fnk-appstore.jpg', width: 1400, height: 1060 },
      { file: 'fnk-play.jpg', width: 1400, height: 756 },
      { file: 'fnk-dev-categories.jpg', width: 1400, height: 877 },
      { file: 'fnk-dev-home.jpg', width: 1400, height: 875 },
      { file: 'fnk-dev-recipe.jpg', width: 1400, height: 874 },
      { file: 'fnk-dev-welcome.jpg', width: 1400, height: 875 },
      { file: 'fnk-dev-restaurants.jpg', width: 1400, height: 875 },
      { file: 'fnk-dev-menu.jpg', width: 1400, height: 875 },
    ],
    tags: ['React Native', 'TypeScript', 'Redux', 'React.js', 'Firebase Cloud Messaging', 'Stripe', 'PayPal', 'i18n'],
  },
  {
    id: 'assymbly',
    name: 'Assymbly — Local Sports Leagues',
    category: 'mobile',
    accent: 'teal',
    media: [{ file: 'assymbly.jpg', width: 1168, height: 784 }],
    links: [
      { kind: 'appStore', href: 'https://apps.apple.com/us/app/assymbly-local-sports-leagues/id6444143481' },
      { kind: 'store', href: 'https://play.google.com/store/apps/details?id=com.assymbly' },
    ],
    tags: ['React Native', 'iOS', 'Android', 'Maps', 'Mobile App Development'],
  },
  {
    id: 'yogaForLife',
    name: 'Yoga for Life',
    category: 'mobile',
    accent: 'rose',
    media: [
      { file: 'yoga-platforms.gif', width: 586, height: 433 },
      { file: 'yoga-intro.jpg', width: 688, height: 870 },
      { file: 'yoga-meditation.jpg', width: 688, height: 930 },
      { file: 'yoga-levels.jpg', width: 688, height: 610 },
      { file: 'yoga-reminders.jpg', width: 688, height: 850 },
    ],
    tags: ['Flutter', 'Android', 'iOS Development', 'Mobile App Development', 'App Developer'],
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
    id: 'bedrockChatbot',
    name: 'Serverless AI Chatbot Platform on AWS Bedrock',
    category: 'ai',
    accent: 'amber',
    media: [{ file: 'bedrock-architecture.jpg', width: 1131, height: 501 }],
    tags: ['Amazon Bedrock', 'Claude', 'SDXL', 'AWS Lambda', 'API Gateway', 'AWS Amplify', 'Amazon Cognito', 'Amazon S3', 'AWS CDK', 'CloudWatch', 'Serverless'],
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
    id: 'hasfit',
    name: 'HASfit Personal Trainer — WordPress Redesign & Local SEO',
    category: 'fullstack',
    accent: 'rose',
    media: [
      { file: 'hasfit-overview.jpg', width: 1400, height: 1050 },
      { file: 'hasfit-home.jpg', width: 800, height: 500 },
      { file: 'hasfit-stats.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://hasfitpersonaltrainer.com' }],
    tags: ['WordPress', 'Website Design', 'Web Development', 'SEO'],
  },
  {
    id: 'northbridge',
    name: 'Northbridge Talent — Recruitment Website',
    category: 'fullstack',
    accent: 'violet',
    media: [
      { file: 'northbridge-overview.jpg', width: 1400, height: 933 },
      { file: 'northbridge-home.jpg', width: 800, height: 500 },
      { file: 'northbridge-pages.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.northbridge-talent.com/' }],
    tags: ['WordPress', 'Elementor', 'PHP', 'MySQL', 'Website Design', 'Responsive Design', 'SEO'],
  },
  {
    id: 'dentalia',
    name: 'Dentalia — Dental Clinic Network Website',
    category: 'fullstack',
    accent: 'violet',
    media: [{ file: 'dentalia-home.jpg', width: 1400, height: 875 }],
    links: [{ kind: 'site', href: 'https://www.dentalia.com/' }],
    tags: ['Web Design', 'Web Development', 'Responsive Design', 'SEO'],
  },
  {
    id: 'homely',
    name: 'Homely — Real Estate Website',
    category: 'fullstack',
    accent: 'rose',
    media: [
      { file: 'homely-home.jpg', width: 605, height: 378 },
      { file: 'homely-listings.jpg', width: 605, height: 378 },
      { file: 'homely-neighbourhoods.jpg', width: 605, height: 378 },
    ],
    links: [{ kind: 'site', href: 'https://www.homely.com.au' }],
    tags: ['Web Development', 'Front-end Development', 'Back-end Development', 'REST API', 'Maps Integration', 'SEO'],
  },
  {
    id: 'zego',
    name: 'Zego — Motor Insurance Website',
    category: 'fullstack',
    accent: 'teal',
    media: [
      { file: 'zego-home.jpg', width: 1400, height: 800 },
      { file: 'zego-delivery.jpg', width: 1400, height: 771 },
      { file: 'zego-about.jpg', width: 1400, height: 796 },
    ],
    links: [{ kind: 'site', href: 'https://www.zego.com/' }],
    tags: ['Front-end Development', 'Figma', 'Responsive Design', 'Server-side Rendering', 'Static Site Generation', 'Web Performance'],
  },
  {
    id: 'rjOsaki',
    name: 'RJ Osaki — Rental Office Website (Tokyo)',
    category: 'fullstack',
    accent: 'rose',
    media: [
      { file: 'rjosaki-home.jpg', width: 361, height: 226 },
      { file: 'rjosaki-plan.jpg', width: 361, height: 226 },
      { file: 'rjosaki-pricing.jpg', width: 361, height: 226 },
    ],
    tags: ['WordPress', 'PHP', 'JavaScript', 'Website Design', 'PSD to HTML'],
  },
  {
    id: 'alpineComfort',
    name: '4 Valleys Chalet Rental — Luxury Chalets in Switzerland',
    category: 'fullstack',
    accent: 'rose',
    media: [
      { file: 'chalet-overview.jpg', width: 1055, height: 1491 },
      { file: 'chalet-hero.jpg', width: 800, height: 500 },
      { file: 'chalet-pages.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://4valleyschaletrental.com/' }],
    tags: ['WordPress', 'PHP', 'ACF', 'Sass', 'JavaScript', 'jQuery', 'GSAP', 'Website Design', 'SEO'],
  },
  {
    id: 'southieMap',
    name: 'SouthieMap — Data-Driven Real Estate Brokerage',
    category: 'fullstack',
    accent: 'violet',
    media: [
      { file: 'southiemap-home.jpg', width: 1291, height: 806 },
      { file: 'southiemap-broker.jpg', width: 1291, height: 490 },
      { file: 'southiemap-guide.jpg', width: 1291, height: 330 },
    ],
    tags: ['React.js', 'Node.js', 'Express JS', 'MEAN Stack', 'Programming'],
  },
  {
    id: 'safewayFoundation',
    name: 'Safeway Foundation — Nourishing Neighbors',
    category: 'fullstack',
    accent: 'teal',
    media: [
      { file: 'safeway-home.jpg', width: 1342, height: 1190 },
      { file: 'safeway-give.jpg', width: 1342, height: 815 },
      { file: 'safeway-node.jpg', width: 600, height: 433 },
    ],
    tags: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'Website Design'],
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
  // Beyond the headline: games, then e-commerce. Real work, placed after
  // the mobile, AI and full-stack rows so the first screen of the list
  // still says what the title says.
  {
    id: 'mmorpg',
    name: 'MMORPG Mobile Game',
    category: 'games',
    accent: 'amber',
    media: [
      { file: 'mmo-battle.jpg', width: 943, height: 518 },
      { file: 'mmo-research.jpg', width: 800, height: 442 },
      { file: 'mmo-barracks.jpg', width: 800, height: 439 },
      { file: 'mmo-victory.jpg', width: 800, height: 440 },
      { file: 'mmo-rewards.jpg', width: 800, height: 434 },
      { file: 'mmo-shop.jpg', width: 800, height: 436 },
      { file: 'mmo-leaderboard.jpg', width: 800, height: 436 },
    ],
    tags: ['Unity 3D', 'Android', 'iOS', 'Game Design', 'Game Development'],
  },
  {
    id: 'tapio',
    name: 'Tapio',
    category: 'games',
    accent: 'violet',
    media: [{ file: 'tapio.jpg', width: 1600, height: 1200 }],
    tags: ['Telegram Mini App', 'Frontend Development', 'Backend Development', 'Web Development'],
  },
  {
    id: 'rabbitRoyale',
    name: 'Rabbit Royale',
    category: 'games',
    accent: 'rose',
    media: [{ file: 'rabbit-royale.jpg', width: 1400, height: 1050 }],
    tags: ['Telegram Mini App', 'Game Development', 'Blockchain', 'Web Application'],
  },
  {
    id: 'giovvani',
    name: 'Giovvani Milan — Luxury Shoes on Shopify',
    category: 'ecommerce',
    accent: 'slate',
    media: [
      { file: 'giovvani-home.jpg', width: 1400, height: 646 },
      { file: 'giovvani-hero.jpg', width: 1400, height: 674 },
      { file: 'giovvani-collection.jpg', width: 1400, height: 663 },
    ],
    links: [{ kind: 'site', href: 'https://www.giovvani.com/' }],
    tags: ['Shopify Development', 'Liquid Template', 'HTML5', 'CSS3', 'SEO', 'UX / User Experience', 'Payment Gateway Integration'],
  },
  {
    id: 'agCashCarry',
    name: 'AG Cash & Carry — Wholesale eCommerce',
    category: 'ecommerce',
    accent: 'amber',
    media: [
      { file: 'agcc-overview.jpg', width: 1400, height: 933 },
      { file: 'agcc-home.jpg', width: 800, height: 500 },
      { file: 'agcc-pages.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://agcashcarry.co.uk/' }],
    tags: ['WordPress', 'WooCommerce', 'PHP', 'MySQL', 'Website Design', 'Responsive Design'],
  },
  {
    id: 'ramboBikes',
    name: 'Rambo Bikes — Shopify Automation & Interactive Bike Builder',
    category: 'ecommerce',
    accent: 'emerald',
    media: [
      { file: 'rambo-overview.jpg', width: 1400, height: 1050 },
      { file: 'rambo-campaign.jpg', width: 800, height: 500 },
      { file: 'rambo-store.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.rambobikes.com/' }],
    tags: ['Shopify Development', 'Shopify Templates', 'Backend Development', 'Frontend Development', 'Website Optimization', 'Web Development'],
  },
  {
    id: 'hazardKit',
    name: 'HazardKit — Survival Gear Store',
    category: 'ecommerce',
    accent: 'rose',
    media: [
      { file: 'hazardkit-home.jpg', width: 1249, height: 780 },
      { file: 'hazardkit-brands.jpg', width: 1249, height: 480 },
    ],
    tags: ['WordPress', 'PHP', 'JavaScript', 'Website Design', 'PSD to HTML'],
  },
  {
    id: 'wooBulkDiscount',
    name: 'WooCommerce Bulk Discount Display',
    category: 'ecommerce',
    accent: 'violet',
    // A title card rather than a screenshot — the demo video is what shows the
    // plugin working. Swap in a capture of it in a store when one exists.
    media: [{ file: 'woo-bulk-discount.png', width: 1080, height: 1080 }],
    links: [{ kind: 'demo', href: 'https://youtu.be/OedzSDjqZnk' }],
    tags: ['WordPress', 'WooCommerce', 'PHP', 'jQuery', 'HTML', 'CSS'],
  },
  {
    id: 'garnetMarketplace',
    name: 'Garnet Marketplace',
    category: 'ecommerce',
    accent: 'emerald',
    media: [
      { file: 'garnet-home.jpg', width: 1400, height: 875 },
      { file: 'garnet-sec1.jpg', width: 800, height: 500 },
      { file: 'garnet-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://garnetmarketplace.com/' }],
    tags: ['Shopify', 'E-commerce', 'SaaS', 'Subscriptions'],
  },
  {
    id: 'tools4trade',
    name: 'Tools4Trade',
    category: 'ecommerce',
    accent: 'amber',
    media: [
      { file: 't4t-home.jpg', width: 1400, height: 875 },
      { file: 't4t-sec1.jpg', width: 800, height: 500 },
      { file: 't4t-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://tools4trade.co.uk/' }],
    tags: ['Shopify', 'E-commerce', 'Shopify Templates', 'JavaScript'],
  },
  {
    id: 'richmond',
    name: 'Wheels and Castors',
    category: 'ecommerce',
    accent: 'teal',
    media: [
      { file: 'richmond-home.jpg', width: 1400, height: 788 },
      { file: 'richmond-range.jpg', width: 800, height: 450 },
      { file: 'richmond-stores.jpg', width: 800, height: 450 },
    ],
    tags: ['WordPress', 'WooCommerce', 'JavaScript'],
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
