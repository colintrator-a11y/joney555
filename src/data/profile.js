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
export const focusAreas = {
  ecommerce: ['shopify', 'ecommerce', 'mobileCommerce'],
  web: ['wordpress', 'saas', 'blockchain'],
  mobile: ['mobile', 'games'],
  automation: ['chatbot', 'automation'],
}

export const navSections = ['about', 'services', 'skills', 'work', 'experience', 'contact']

export const serviceIds = ['web', 'mobile', 'ecommerce', 'automation']

export const skillGroups = [
  {
    id: 'frontend',
    items: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Responsive Web Design', 'User Interface'],
  },
  {
    id: 'backend',
    items: ['Node.js', 'Python', 'Django', 'PHP', 'Laravel', 'REST API', 'PostgreSQL', 'MySQL', 'MongoDB'],
  },
  {
    id: 'mobile',
    items: ['React Native', 'Flutter', 'Android', 'iOS', 'Unity 3D'],
  },
  {
    id: 'ecommerce',
    items: ['Shopify', 'WooCommerce', 'WordPress', 'E-commerce', 'SaaS'],
  },
  {
    id: 'other',
    items: ['Chatbot / Rasa', 'Blockchain', 'Git', 'Linux'],
  },
]

// One entry per project. `media` lists files in src/assets/projects/ with their
// intrinsic size — the dimensions go on the <img> so the row does not jump as
// images load, and the first one's orientation decides the row's proportions.
// `accent` picks the colour band (see the palette in Projects.css) and the
// description lives in the locale files keyed by `id`.
export const projects = [
  {
    id: 'rasaHandoff',
    name: 'Human Handoff Demo Using Rasa',
    category: 'chatbot',
    accent: 'violet',
    media: [{ file: 'rasa-handoff.gif', width: 480, height: 810 }],
    tags: ['Python', 'Git', 'Chatbot', 'Docker', 'REST API'],
  },
  {
    id: 'arabianRange',
    name: 'Arabian Range Website',
    category: 'wordpress',
    accent: 'amber',
    media: [
      { file: 'arabian-hero.jpg', width: 1016, height: 464 },
      { file: 'arabian-pages.jpg', width: 155, height: 645 },
    ],
    tags: ['WordPress', 'Responsive Web Design', 'Web Development'],
  },
  {
    id: 'artisanBeauty',
    name: 'Artisan Beauty Clinic Website',
    category: 'wordpress',
    accent: 'rose',
    media: [
      { file: 'artisan-mockup.jpg', width: 1600, height: 1200 },
      { file: 'artisan-home.jpg', width: 1200, height: 820 },
      { file: 'artisan-about.jpg', width: 1200, height: 820 },
      { file: 'artisan-services.jpg', width: 1200, height: 820 },
      { file: 'artisan-pages.jpg', width: 1200, height: 820 },
      { file: 'artisan-events.jpg', width: 1200, height: 820 },
    ],
    tags: ['WordPress', 'Web design'],
  },
  {
    id: 'ayiko',
    name: 'Ayiko: Ecommerce Platform',
    category: 'mobileCommerce',
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
    id: 'collectMyJudgement',
    name: 'Collect My Judgement Landing Page',
    category: 'wordpress',
    accent: 'slate',
    media: [
      { file: 'cmj-laptop.jpg', width: 1400, height: 933 },
      { file: 'cmj-pages.jpg', width: 800, height: 533 },
      { file: 'cmj-desktop.jpg', width: 800, height: 533 },
      { file: 'cmj-analytics.jpg', width: 800, height: 533 },
    ],
    tags: ['WordPress', 'Responsive Web Design', 'Web Development'],
  },
  {
    id: 'enterpriseErp',
    name: 'EnterpriseERP',
    category: 'saas',
    accent: 'violet',
    media: [
      { file: 'erp-dashboard.jpg', width: 1400, height: 933 },
      { file: 'erp-finance.jpg', width: 800, height: 533 },
      { file: 'erp-sales.jpg', width: 800, height: 533 },
    ],
    tags: ['PHP', 'Laravel', 'AJAX', 'SaaS'],
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
    id: 'homeEnergy',
    name: 'Home Energy Shopify',
    category: 'shopify',
    accent: 'teal',
    media: [
      { file: 'biolite-home.jpg', width: 1400, height: 634 },
      { file: 'biolite-products.jpg', width: 800, height: 450 },
      { file: 'biolite-product.jpg', width: 800, height: 450 },
    ],
    tags: ['Shopify', 'AJAX', 'Chatbot'],
  },
  {
    id: 'hulkCharts',
    name: 'Live Streaming Charts DApp',
    category: 'blockchain',
    accent: 'violet',
    media: [
      { file: 'hulk-chart.jpg', width: 1400, height: 875 },
      { file: 'hulk-search.jpg', width: 800, height: 500 },
      { file: 'hulk-token.jpg', width: 800, height: 500 },
      { file: 'hulk-swap.jpg', width: 800, height: 500 },
      { file: 'hulk-sniper.jpg', width: 800, height: 500 },
      { file: 'hulk-trigger.jpg', width: 800, height: 500 },
    ],
    tags: ['Blockchain', 'BSC'],
  },
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
    id: 'vassalli',
    name: 'Product Listing Vassalli',
    category: 'shopify',
    accent: 'emerald',
    media: [
      { file: 'vassalli-apparel.jpg', width: 1400, height: 788 },
      { file: 'vassalli-footwear.jpg', width: 800, height: 450 },
      { file: 'vassalli-giftcard.jpg', width: 800, height: 450 },
    ],
    tags: ['Shopify', 'CSS', 'Project Management'],
  },
  {
    id: 'madsen',
    name: 'Shopify Bicycle Store',
    category: 'shopify',
    accent: 'teal',
    media: [
      { file: 'madsen-bikes.jpg', width: 1400, height: 788 },
      { file: 'madsen-map.jpg', width: 800, height: 450 },
      { file: 'madsen-signup.jpg', width: 800, height: 450 },
    ],
    tags: ['Shopify', 'E-commerce', 'AJAX', 'JavaScript'],
  },
  {
    id: 'richmond',
    name: 'Wheels and Castors',
    category: 'wordpress',
    accent: 'amber',
    media: [
      { file: 'richmond-home.jpg', width: 1400, height: 788 },
      { file: 'richmond-range.jpg', width: 800, height: 450 },
      { file: 'richmond-stores.jpg', width: 800, height: 450 },
    ],
    tags: ['WordPress', 'WooCommerce', 'JavaScript'],
  },
  {
    id: 'aiArt',
    name: 'AI Art Generator App',
    category: 'mobile',
    accent: 'rose',
    media: [{ file: 'aiart-app.jpg', width: 1600, height: 1200 }],
    tags: ['Mobile App Development', 'AI Mobile App Development'],
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
    id: 'n8nChatbot',
    name: 'WhatsApp Chatbot Automation with n8n',
    category: 'chatbot',
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
    id: 'dineamic',
    name: 'Dineamic Food Delivery Store',
    category: 'shopify',
    accent: 'violet',
    media: [{ file: 'dineamic.jpg', width: 995, height: 609 }],
    tags: ['Shopify', 'Shopify Templates', 'Bootstrap', 'Responsive Web Design'],
  },
  {
    id: 'excelDashboard',
    name: 'Excel Budget Planner Dashboard',
    category: 'automation',
    accent: 'emerald',
    media: [
      { file: 'excel-dashboard.jpg', width: 1272, height: 857 },
      { file: 'excel-income.jpg', width: 800, height: 527 },
      { file: 'excel-expenses.jpg', width: 800, height: 550 },
      { file: 'excel-savings.jpg', width: 800, height: 546 },
      { file: 'excel-debt.jpg', width: 800, height: 523 },
      { file: 'excel-investments.jpg', width: 800, height: 540 },
      { file: 'excel-summary.jpg', width: 800, height: 527 },
    ],
    tags: ['Excel', 'Excel VBA', 'Excel Macros', 'Data Visualization', 'Process Automation'],
  },
  {
    id: 'zohoStripe',
    name: 'Stripe → Zoho CRM Automation',
    category: 'automation',
    accent: 'amber',
    // Two halves of one flow diagram: readable across the row, not beside the text.
    layout: 'stacked',
    media: [
      { file: 'zapier-flow-1.jpg', width: 1474, height: 669 },
      { file: 'zapier-flow-2.jpg', width: 1464, height: 687 },
    ],
    tags: ['Zapier', 'Stripe', 'Zoho CRM', 'Process Automation'],
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
    id: 'monstersClan',
    name: 'Monsters Clan',
    category: 'blockchain',
    accent: 'rose',
    media: [{ file: 'monstersclan.jpg', width: 1600, height: 1200 }],
    tags: ['Web Development', 'Blockchain', 'NFT'],
  },
  {
    id: 'weatherParallax',
    name: 'Severe Weather Consult',
    category: 'wordpress',
    accent: 'slate',
    media: [{ file: 'weather-parallax.jpg', width: 800, height: 600 }],
    // The demo URL the client supplied, https://multisite.webencoder.net/demo20,
    // is not linked: webencoder.net has no DNS record at all any more.
    tags: ['WordPress', 'PHP', 'MySQL', 'HTML', 'CSS', 'jQuery'],
  },
  {
    id: 'rabbitRoyale',
    name: 'Rabbit Royale',
    category: 'games',
    accent: 'violet',
    media: [{ file: 'rabbit-royale.jpg', width: 1400, height: 1050 }],
    tags: ['Telegram Mini App', 'Game Development', 'Blockchain', 'Web Application'],
  },
  {
    id: 'ratehub',
    name: 'Ratehub',
    category: 'wordpress',
    accent: 'teal',
    media: [{ file: 'ratehub.jpg', width: 1400, height: 840 }],
    links: [{ kind: 'site', href: 'https://www.ratehub.ca/' }],
    tags: ['WordPress', 'PHP', 'JavaScript', 'jQuery', 'Cloudflare'],
  },
  {
    id: 'travelDaily',
    name: 'Travel Daily Media',
    category: 'wordpress',
    accent: 'rose',
    media: [{ file: 'travel-daily.jpg', width: 1400, height: 876 }],
    links: [{ kind: 'site', href: 'https://www.traveldailymedia.com/' }],
    tags: ['WordPress', 'PHP', 'JavaScript', 'jQuery', 'HubSpot', 'SEO'],
  },
  {
    id: 'tapio',
    name: 'Tapio',
    category: 'games',
    accent: 'amber',
    media: [{ file: 'tapio.jpg', width: 1600, height: 1200 }],
    tags: ['Telegram Mini App', 'Frontend Development', 'Backend Development', 'Web Development'],
  },
  {
    id: 'familj',
    name: 'Familj Pregnancy App',
    category: 'mobile',
    accent: 'violet',
    media: [{ file: 'familj.jpg', width: 1400, height: 730 }],
    links: [
      { kind: 'store', href: 'https://play.google.com/store/apps/details?id=com.cmh.familj' },
      { kind: 'appStore', href: 'https://apps.apple.com/us/app/familj-se/id6765674291' },
      { kind: 'demo', href: 'https://youtu.be/muK7w5R2THQ' },
    ],
    tags: ['Flutter', 'React.js', 'Node.js', 'MySQL', 'iOS', 'Android'],
  },
  {
    id: 'qalorie',
    name: 'Qalorie: Weight Loss & Health',
    category: 'mobile',
    accent: 'slate',
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
    id: 'wooBulkDiscount',
    name: 'WooCommerce Bulk Discount Display',
    category: 'wordpress',
    accent: 'rose',
    // A title card rather than a screenshot — the demo video is what shows the
    // plugin working. Swap in a capture of it in a store when one exists.
    media: [{ file: 'woo-bulk-discount.png', width: 1080, height: 1080 }],
    links: [{ kind: 'demo', href: 'https://youtu.be/OedzSDjqZnk' }],
    tags: ['WordPress', 'WooCommerce', 'PHP', 'jQuery', 'HTML', 'CSS'],
  },
  {
    id: 'keyzar',
    name: 'Keyzar Jewelry',
    category: 'shopify',
    accent: 'rose',
    media: [
      { file: 'keyzar-home.jpg', width: 1400, height: 875 },
      { file: 'keyzar-sec1.jpg', width: 800, height: 500 },
      { file: 'keyzar-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://keyzarjewelry.com/' }],
    tags: ['Shopify', 'E-commerce', 'Responsive Web Design', 'JavaScript'],
  },
  {
    id: 'tools4trade',
    name: 'Tools4Trade',
    category: 'shopify',
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
    id: 'illumivein',
    name: 'Illumivein',
    category: 'shopify',
    accent: 'slate',
    media: [
      { file: 'illumi-home.jpg', width: 1400, height: 875 },
      { file: 'illumi-sec1.jpg', width: 800, height: 500 },
      { file: 'illumi-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://illumivein.com/' }],
    tags: ['Shopify', 'E-commerce', 'Landing Page', 'Responsive Web Design'],
  },
  {
    id: 'videoMilkshake',
    name: 'Video Milkshake',
    category: 'shopify',
    accent: 'violet',
    media: [
      { file: 'milkshake-home.jpg', width: 1400, height: 875 },
      { file: 'milkshake-sec1.jpg', width: 800, height: 500 },
      { file: 'milkshake-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.videomilkshake.com/' }],
    tags: ['Shopify', 'Digital Products', 'E-commerce', 'CSS'],
  },
  {
    id: 'consciousInk',
    name: 'Conscious Ink',
    category: 'shopify',
    accent: 'emerald',
    media: [
      { file: 'cink-home.jpg', width: 1400, height: 875 },
      { file: 'cink-sec1.jpg', width: 800, height: 500 },
      { file: 'cink-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.consciousink.com/' }],
    tags: ['Shopify', 'E-commerce', 'Subscriptions', 'Responsive Web Design'],
  },
  {
    id: 'perriconeMd',
    name: 'Perricone MD',
    category: 'ecommerce',
    accent: 'rose',
    media: [
      { file: 'perricone-home.jpg', width: 1400, height: 875 },
      { file: 'perricone-sec1.jpg', width: 800, height: 500 },
      { file: 'perricone-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.perriconemd.com/' }],
    tags: ['E-commerce', 'Responsive Web Design', 'JavaScript', 'SEO'],
  },
  {
    id: 'wildfang',
    name: 'Wildfang',
    category: 'shopify',
    accent: 'violet',
    media: [
      { file: 'wildfang-home.jpg', width: 1400, height: 875 },
      { file: 'wildfang-sec1.jpg', width: 800, height: 500 },
      { file: 'wildfang-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.wildfang.com/' }],
    tags: ['Shopify', 'E-commerce', 'Responsive Web Design', 'CSS'],
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
    id: 'miroTea',
    name: 'Miro Tea',
    category: 'shopify',
    accent: 'amber',
    media: [
      { file: 'mirotea-home.jpg', width: 1400, height: 875 },
      { file: 'mirotea-sec1.jpg', width: 800, height: 500 },
      { file: 'mirotea-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://mirotea.com/' }],
    tags: ['Shopify', 'E-commerce', 'Shopify Templates', 'Responsive Web Design'],
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'saas',
    accent: 'amber',
    media: [
      { file: 'hubspot-home.jpg', width: 1400, height: 875 },
      { file: 'hubspot-sec1.jpg', width: 800, height: 500 },
      { file: 'hubspot-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.hubspot.com' }],
    tags: ['HubSpot', 'SaaS', 'Landing Page', 'SEO'],
  },
  {
    id: 'webfx',
    name: 'WebFX',
    category: 'wordpress',
    accent: 'teal',
    media: [
      { file: 'webfx-home.jpg', width: 1400, height: 875 },
      { file: 'webfx-sec1.jpg', width: 800, height: 500 },
      { file: 'webfx-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.webfx.com' }],
    tags: ['WordPress', 'PHP', 'SEO', 'Responsive Web Design'],
  },
  {
    id: 'belaySolutions',
    name: 'BELAY Solutions',
    category: 'saas',
    accent: 'emerald',
    media: [
      { file: 'belay-home.jpg', width: 1400, height: 875 },
      { file: 'belay-sec1.jpg', width: 800, height: 500 },
      { file: 'belay-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.belaysolutions.com' }],
    tags: ['HubSpot', 'Landing Page', 'SEO', 'Responsive Web Design'],
  },
  {
    id: 'hotelJobs',
    name: 'HotelJobs',
    category: 'saas',
    accent: 'violet',
    media: [
      { file: 'hoteljobs-home.jpg', width: 1400, height: 875 },
      { file: 'hoteljobs-sec1.jpg', width: 800, height: 500 },
      { file: 'hoteljobs-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.hoteljobs.co.za' }],
    tags: ['REST API', 'MySQL', 'Frontend Development', 'Responsive Web Design'],
  },
  {
    id: 'aimro',
    name: 'AIMRO',
    category: 'saas',
    accent: 'rose',
    media: [
      { file: 'aimro-home.jpg', width: 1400, height: 875 },
      { file: 'aimro-sec1.jpg', width: 800, height: 500 },
      { file: 'aimro-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.aimro.ie/' }],
    tags: ['React.js', 'Node.js', 'REST API', 'Frontend Development'],
  },
  {
    id: 'vizury',
    name: 'Vizury Engage360',
    category: 'saas',
    accent: 'slate',
    media: [
      { file: 'vizury-home.jpg', width: 1400, height: 875 },
      { file: 'vizury-sec1.jpg', width: 800, height: 500 },
      { file: 'vizury-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.vizury.com/' }],
    tags: ['HubSpot', 'SaaS', 'Data Visualization', 'Landing Page'],
  },
  {
    id: 'rembrr',
    name: 'Rembrr',
    category: 'chatbot',
    accent: 'violet',
    media: [
      { file: 'rembrr-home.jpg', width: 1400, height: 875 },
      { file: 'rembrr-sec1.jpg', width: 800, height: 500 },
      { file: 'rembrr-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://rembrr.com/' }],
    tags: ['WordPress', 'Chatbot', 'SaaS', 'Landing Page'],
  },
  {
    id: 'dentalis',
    name: 'Dentalis',
    category: 'chatbot',
    accent: 'teal',
    media: [
      { file: 'dentalis-home.jpg', width: 1400, height: 875 },
      { file: 'dentalis-sec1.jpg', width: 800, height: 500 },
      { file: 'dentalis-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'site', href: 'https://www.dentalis.com.br/' }],
    tags: ['WordPress', 'Chatbot', 'PHP', 'Process Automation'],
  },
  {
    id: 'trakMd',
    name: 'trakMD Doctor App',
    category: 'mobile',
    accent: 'slate',
    media: [
      { file: 'trakmd-home.jpg', width: 1400, height: 875 },
      { file: 'trakmd-sec1.jpg', width: 800, height: 500 },
      { file: 'trakmd-sec2.jpg', width: 800, height: 500 },
    ],
    links: [{ kind: 'appStore', href: 'https://apps.apple.com/us/app/trakmd-doctor-app/id1476907007' }],
    tags: ['React Native', 'iOS', 'Android', 'Mobile App Development'],
  },
]

// Declared after `projects` so the headline count follows the list itself.
export const stats = [
  { id: 'years', value: '7+' },
  { id: 'projects', value: String(projects.length) },
  // Every technology listed in the Skills section, counted rather than typed.
  { id: 'skills', value: String(skillGroups.reduce((sum, group) => sum + group.items.length, 0)) },
  { id: 'since', value: '2019' },
]

// Nothing listed at the moment. The About panel renders only when this has
// an entry, so adding one here (plus a name and detail under
// about.certifications in every locale) brings the panel back.
export const certifications = []
