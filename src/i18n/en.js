export default {
  code: 'en',
  htmlLang: 'en',
  name: 'English',
  short: 'EN',

  a11y: {
    skip: 'Skip to content',
    sections: 'Sections',
    footer: 'Footer',
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
    backToTop: 'Back to top',
    filter: 'Filter projects by category',
    close: 'Close',
    prevImage: 'Previous image',
    nextImage: 'Next image',
    openPreview: 'Open a larger preview',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetZoom: 'Reset zoom',
  },

  nav: {
    about: 'About',
    services: 'Services',
    skills: 'Skills',
    work: 'Work',
    experience: 'Experience',
    contact: 'Contact',
  },

  hero: {
    status: 'Open to new opportunities',
    title: 'Full Stack & Mobile Developer',
    tagline:
      'Web applications, mobile apps and online stores — taken from the first requirement through to deployment.',
    note: 'This site introduces my skills and the projects behind them.',
    cta: 'See the work',
    caption: 'Full stack developer',
    captionValue: 'Since 2019',
    stats: {
      years: 'Years building software',
      projects: 'Featured projects',
      skills: 'Technologies',
      since: 'Developing since',
    },
  },

  about: {
    eyebrow: 'About',
    heading: 'Seven years of building for web and mobile',
    lead: 'I\u2019m a full stack and mobile developer. I build web applications, mobile apps, online stores and automations, and I work across the whole path — from the first requirement to a product running in production.',
    reach: (count) =>
      `7 years and ${count} projects across web, mobile, e-commerce and automation. This page walks through the skills and the work behind them.`,
    bestTitle: 'What I do best',
    best: [
      { id: 'ecommerce', area: 'E-commerce', detail: 'Shopify and WordPress/WooCommerce stores, custom themes, payment integrations' },
      { id: 'web', area: 'Web apps', detail: 'React, Node.js, Laravel/PHP, from landing pages to enterprise ERP platforms' },
      { id: 'mobile', area: 'Mobile', detail: 'React Native, Kotlin, Java for Android and iOS' },
      { id: 'automation', area: 'AI & automation', detail: 'chatbots with Rasa, workflow automation with n8n and Python' },
    ],
    approachTitle: 'How I work',
    approach:
      'Understand the problem before writing code. Plan in realistic milestones. Keep communication clear and regular. Write clean, documented code that another developer can pick up and maintain.',
    closing:
      'Scroll down for the skills and projects in detail. If you would like to work together or talk about any of it, the contact form is at the bottom of the page.',
    certTitle: 'Certification',
    certifications: {
    },
  },

  services: {
    eyebrow: 'Services',
    heading: 'What I build',
    note: 'Requirements → build → deployment, in clear stages',
    items: {
      web: {
        title: 'Web applications',
        body: 'React and Next.js front ends on Node.js, Python or PHP back ends, with REST APIs and a database that fits the project.',
      },
      mobile: {
        title: 'Mobile apps',
        body: 'React Native and Flutter apps for Android and iOS, native Android work, and Unity 3D games shipped to both stores.',
      },
      shopify: 'Shopify',
      ecommerce: {
        title: 'E-commerce',
        body: 'Shopify and WooCommerce stores, product catalogues, theme work and the integrations that keep a shop running.',
      },
      automation: {
        title: 'Chatbots & automation',
        body: 'Rasa assistants with human handoff, plus Python automations that take the repetitive work off your team.',
      },
    },
  },

  skills: {
    eyebrow: 'Skills',
    heading: 'The stack I work in',
    note: (count, areas) => `${count} technologies across ${areas} areas`,
    groups: {
      frontend: 'Front end',
      backend: 'Back end & data',
      mobile: 'Mobile & games',
      shopify: 'Shopify',
      ecommerce: 'E-commerce & CMS',
      other: 'Other',
    },
  },

  projects: {
    eyebrow: 'Work',
    heading: 'Selected projects',
    note: (count) => (count === 1 ? 'One project' : `${count} projects`),
    bySkill: 'Skill',
    allSkills: 'All skills',
    reset: 'Clear filters',
    empty: 'No projects match these filters.',
      skillsCommon: 'Most used',
      skillsOther: 'Everything else',
    all: 'All work',
    categories: {
      chatbot: 'Chatbot / AI',
      saas: 'Enterprise SaaS',
      mobileCommerce: 'Mobile / E-commerce',
      mobile: 'Mobile',
      games: 'Mobile / Games',
      blockchain: 'Blockchain',
      shopify: 'Shopify',
      ecommerce: 'E-commerce',
      automation: 'Automation / Data',
      wordpress: 'WordPress',
    },
    items: {
      rasaHandoff: [
        'This is a Rasa chatbot example demonstrating how to build an AI assistant for an IT Helpdesk. It includes an integration with the Service Now API to open incident reports and check on incident report statuses. Below is an example conversation, showing the bot helping a user open a support ticket and query its status.',
        'You can use this chatbot as a starting point for building customer service assistants or as a template for collecting required pieces of information from a user before making an API call. This bot includes a simple skill for handing off the conversation to another bot or a human.',
        'Using this demo, we can transfer the conversation from one bot to another bot, or hand off to a human.',
      ],
      arabianRange: [
        'Design and development of the Arabian Ranges website — a WordPress site for a commercial and sport shooting-range business, covering its products, services, training programmes, gallery and partners.',
        'The site is fully responsive and optimised, and I still maintain it. It was delivered on a modest budget and a tight timeline, and the client left a five-star review.',
      ],
      artisanBeauty: [
        'I designed and developed a complete WordPress website for Artisan Beauty Clinic, a beauty and skincare clinic in Scarborough. The project included full layout design, service pages, pricing structure, booking flow, mobile responsiveness, and a clean modern UI to match their brand.',
        'The goal was to create a professional, easy-to-navigate website that clearly presents their services and builds trust with local clients.',
      ],
      ayiko: [
        'Ayiko is a multi-vendor eCommerce platform built to bring sellers, customers, drivers, and agents into one system. The idea was to create a marketplace where sellers can run their own operations while customers enjoy a smooth shopping and delivery experience.',
        'Customers can browse products from multiple sellers and place orders easily. On the other side, sellers can manage their own listings, handle orders, and assign deliveries to their own drivers. Drivers receive the required details and handle last-mile delivery, keeping the process fast and controlled at the seller level.',
        'The platform also includes an agent model to support growth. Agents can promote the platform using their own codes, and whenever a new customer signs up through them, the agent earns a commission. This helps the business grow through referrals, without heavy marketing spend.',
        'Overall, Ayiko was built as a complete system that integrates operations, delivery, and growth in one place.',
      ],
      collectMyJudgement: [
        'Collect My Judgement specializes in debt collection and judgment enforcement, providing nationwide coverage with a team of expert attorneys, negotiators, and investigators. With over 30 years of proven success, they handle even the most complex cases, ensuring efficient and effective recovery for their clients.',
        'I designed a high-impact landing page for them, showcasing their expertise and credibility in the industry.',
      ],
      enterpriseErp: [
        'EnterpriseERP is a cloud-based Enterprise Resource Planning platform designed to centralize and automate core business operations within a single integrated system. The solution provides organizations with real-time visibility into financial performance, sales activities, inventory levels, procurement processes, customer relationships, and workforce management, enabling data-driven decision-making and operational efficiency.',
        'The platform consists of multiple interconnected modules, including Finance, Sales, Purchasing, Inventory, Production, CRM, Human Resources, Projects, Assets, Reports, and Document Management. Each module shares a unified database, ensuring data consistency and eliminating duplicate data entry across departments.',
        'The Finance module manages accounts payable, accounts receivable, general ledger, budgeting, tax management, banking, and financial reporting.',
      ],
      eMuvas: [
        'E-Muvas is a delivery service mobile app that allows users to request deliveries in two modes: Instant Requests and Scheduled Requests. It provides real-time updates and live tracking for both modes.',
        'Users can also rate and review drivers after completing deliveries, ensuring transparency and quality service. Payment is processed via a secure gateway, requiring a linked card for transactions.',
      ],
      homeEnergy: [
        'Built a dynamic and user-friendly Shopify store for BioLite, showcasing eco-friendly energy products with seamless shopping and mobile optimization.',
      ],
      hulkCharts: [
        'A live streaming charts dApp for Binance Smart Chain (BSC) tokens, built around Hulk Token — in the same vein as PooCoin.',
        'The screens cover market search ranked by volume and liquidity, live token charts with trading history, swaps across PancakeSwap and ApeSwap, a token sniper driven by contract address and trigger amount, and per-token profile pages with transfers and holders.',
      ],
      mmorpg: [
        'A Unity 3D mobile MMORPG for Android and iOS, in the massively multiplayer base-building strategy genre: players raise an army, upgrade a castle and its economy, and fight real-time battles against other players.',
        'The build covers the whole live-game loop — troop training and barracks upgrades, a research tree for farming, stone, timber, gold and build speed, real-time siege combat with victory rewards, power and troops-killed leaderboards, hero and leader selection, seven-day login rewards, and an in-app purchase shop of chest packs, gem packs, memberships and subscriptions. The build shown runs with a Spanish-language interface.',
      ],
      vassalli: [
        'Created a clean and organized Shopify product listing for Vassalli, showcasing apparel with detailed descriptions, size options, and stylish visuals for an enhanced shopping experience.',
      ],
      madsen: [
        'Developed a sleek and responsive MADSEN Shopify store for a bicycle brand, featuring dynamic product displays and a smooth shopping experience.',
      ],
      richmond: [
        'Richmond offers rolling solutions, including wheels and castors, across Australia and New Zealand, supplying reliable, high-quality material handling and custom-engineered rolling products for a wide range of industries.',
        'The site is a WordPress and WooCommerce store, with the range organised into product categories from castors, wheels and tyres through to pallet jacks, conveyors, roll cages and gate hardware, alongside site-wide product search and a store finder.',
      ],
      aiArt: [
        'AI Art Generator is a revolutionary mobile app that enables users to create stunning artwork effortlessly with just a few taps. Powered by advanced artificial intelligence, this innovative app transforms your text prompts into breathtaking, high-quality visuals.',
        "Whether you're an artist, designer, or someone looking to explore their creative side, AI Art Generator provides a seamless platform to bring your ideas to life. Its intuitive interface allows you to generate unique and personalized artwork, offering endless creative possibilities. By leveraging cutting-edge AI technology, the app redefines the way we create and experience art, making it accessible to everyone, regardless of skill level.",
      ],
      musicPlayer: [
        'A feature-rich Android music player built for a client, with a modern interface and a smooth playback experience. This was the first phase of development for a popular music app.',
        'It covers a custom equalizer — five bands plus reverb, bass, virtualizer and loudness — along with custom playlist creation, advanced search, metadata editing, custom filters for organising a library, and easy deletion of unwanted audio files. The app is built for speed, usability and audio performance.',
      ],
      n8nChatbot: [
        'I built and launched a robust WhatsApp chatbot workflow for property management in 3 weeks, streamlining how support teams handle incoming requests and ticket creation.',
        'The system handles incoming messages, media attachments, and user verification by combining n8n automation with PostgreSQL persistence. It uses stateful conversation management to guide users smoothly through multi-step forms like ticket types, titles, and descriptions while keeping track of user sessions.',
        'Results: automated user verification, reduced ticket creation time from hours to minutes, round-the-clock customer support availability, and reliable data consistency across all user interactions.',
        'Tech stack: n8n, WhatsApp API, PostgreSQL, relational database architecture, event-driven workflows, state machine logic, and automated notification integrations.',
      ],
      currencyConverter: [
        'This Currency Converter mobile app is built using Flutter, delivering fast, accurate, and real-time currency conversion. I integrated a high-speed API to ensure reliable and up-to-date exchange rates.',
        'Key features and technologies: fast and accurate currency data via a high-performance API, GetX for state management and smooth app performance, Firebase Authentication for secure user access, GetStorage as a local database for user preferences and data, user data persistence through efficient state management, and a fully responsive design that looks great on all devices.',
        'The app provides a seamless user experience with modern architecture, high performance, and a clean UI across all screen sizes.',
      ],
      dineamic: [
        'A Shopify e-commerce site for Dineamic, a fresh-meal delivery brand. The store covers the menu and dietary options, delivery and NDIS ordering, with a postcode check at the top of every page so a visitor knows straight away whether they can be delivered to.',
        'Built to hold up the same on desktop, laptop, tablet and phone.',
      ],
      excelDashboard: [
        'This project involved developing a fully automated Excel Budget Planner Dashboard using Microsoft Excel Automation, advanced Excel formulas, Pivot Tables, Pivot Charts, Data Validation, Conditional Formatting, and interactive dashboards.',
        'I designed multiple worksheets for income tracking, expense management, savings, debt monitoring, net worth analysis, investment forecasting, and annual summaries. Dynamic charts, KPI cards, category breakdowns, and automated calculations provided real-time financial insights with minimal manual input.',
        'The workbook was optimized for accuracy, usability, and performance, enabling efficient personal finance management, budget analysis, financial reporting, and decision-making through a professional, user-friendly Excel dashboard and financial automation solution.',
      ],
      zohoStripe: [
        'Designed and implemented an automation workflow using Zapier to seamlessly integrate Stripe and Zoho CRM.',
        'The automation triggers as soon as a payment completes in Stripe, creates or updates a Contact in Zoho CRM from the Stripe customer data, configures workflow triggers in Zoho CRM to initiate actions like welcome emails or task assignments, and ensures no duplicate records are created by checking existing entries before creating new ones.',
        'This solution eliminated manual data entry, enabled real-time customer record updates, and ensured smooth synchronization between the payment platform and the CRM. It significantly improved operational efficiency and responsiveness.',
      ],
      keepNote: [
        'KeepNote is a fast, simple, and privacy-first note-taking app that stores all your data locally on your device. With no complicated setup or online account required, the app ensures your notes stay private.',
        'Key features: local storage with no cloud, a simple interface for quick note creation, a privacy-focused design, and full offline functionality. Built with Flutter and SQLite.',
      ],
      monstersClan: [
        "Monsters Clan's website showcases the game's core features, including NFT swapping and staking.",
        "It's a revolutionary NFT game where players control unique monsters, training and customizing them for epic battles. By integrating blockchain technology, the game ensures secure, transparent ownership of in-game assets, allowing players to truly own and trade their monsters.",
        "With strategic gameplay and engaging features, Monsters Clan offers an immersive, interactive experience where players can shape their monsters' abilities and compete for rewards in a dynamic, decentralized environment.",
      ],
      weatherParallax: [
        'A parallax website for a weather news provider, built from scratch.',
        'It started as an HTML and CSS build, was then made responsive for tablet and mobile, and was finally converted into a WordPress theme.',
      ],
      rabbitRoyale: [
        'Rabbit Royale is an innovative Telegram mini-app that offers users an exciting tap-to-earn game experience. Designed to keep players engaged, Rabbit Royale combines fun and rewards in a seamless, interactive platform.',
        'As users tap their way through the game, they have the opportunity to earn rewards and watch their profits grow daily. With its easy-to-use interface and engaging gameplay, Rabbit Royale provides a thrilling way to earn while enjoying a dynamic, rewarding experience.',
      ],
      ratehub: [
        'Ratehub is a Canadian financial product comparison website, covering mortgages, credit cards, banking, investing and insurance.',
        'My work on it: installed the SSL certificate, set up Cloudflare, implemented the payment gateway, redesigned the Mortgages and Credit Cards pages, made the site mobile-responsive, and implemented multi-language functionality.',
      ],
      travelDaily: [
        'Travel Daily Media is a travel trade news publication, organised by markets, sectors and features, with jobs, events and advertising alongside the news.',
        'I built the site from scratch, and its blog is the largest I have worked on: over 70,000 subscribers, with more than 100,000 emails going out daily through Interspire according to each subscriber\u2019s criteria. It carries a jobs section as well.',
        'Also on this site: HubSpot integration, customisation of the Publisher theme, SEO work to the client\u2019s requirements, and the Yoast plugin.',
      ],
      tapio: [
        'Introducing Tapio, the best tap-to-earn game available on Telegram. With every tap, users dive into a world of instant rewards, where each action brings new opportunities.',
        'As players engage in the game, they not only earn rewards but also gather exclusive perks, unlocking more benefits as they rise up the rankings. Tapio makes earning fun, interactive, and rewarding, providing a dynamic experience that keeps users coming back for more.',
      ],
      familj: [
        'A pregnancy health app built as a client project, designed to support pregnant women throughout their pregnancy journey. It brings guidance, health tips and community interaction together in one easy-to-use platform.',
        'Features: weekly pregnancy suggestions and health tips, a checklist of what needs to be done at each stage, a community system with blog comments for discussion and support, a web application for easy access, and mobile apps on iOS and Android.',
        'Tech stack: Node.js on the back end, React.js on the web front end, and Flutter for the iOS and Android apps. The result is a scalable, user-friendly solution that holds up across every device while helping expectant mothers stay informed and connected.',
      ],
      qalorie: [
        'Qalorie is a health coaching app, published on both stores as Qalorie: Weight Loss & Health. Users connect with coaches for consultations, diet plans, workouts and biohacking tips, and track calories, macros, water and exercise against daily goals.',
        'I worked across the mobile app and the back end. The app is React Native with Redux, hooks and sagas; the back end is Node.js on MongoDB, with AWS S3 holding the media.',
        'Built into it: social sign-in through Firebase for Facebook, Apple, Google and email; video and voice calling and live chat on CometChat; push notifications; Google Analytics and AppsFlyer; a social feed with multi-image and video posts, comments, likes and following; and PayPal and Stripe payments. Publishing to the App Store and Play Store was mine as well.',
        'The hard part was editing and trimming video inside the app for sharing to the feed. Designs came in as Figma and InVision files.',
      ],
      wooBulkDiscount: [
        'A custom WordPress plugin that shows discounted prices dynamically. Built with PHP, HTML and CSS against WordPress and WooCommerce\u2019s own functions.',
      ],
      keyzar: [
        'A Shopify storefront for Keyzar, a fine jewellery brand selling engagement rings, wedding bands, diamonds and gemstones.',
        'The store is built around a considered purchase rather than an impulse one: diamonds browsable by shape, an education section, consultation booking in the New York showroom or online, and the reassurances a buyer looks for before spending on a ring — free resizing, certification and appraisal, conflict-free stones, a lifetime warranty.',
      ],
      tools4trade: [
        'A Shopify store for Tools4Trade, a UK retailer of power tools, hand tools, workwear and site equipment.',
        'This one is a catalogue problem. Thousands of lines across a dozen categories and every trade brand stocked side by side, with search by category, brand or part number, and merchandising that has to carry clearance, warehouse deals, new arrivals, brand redemptions and a rewards scheme without burying the products underneath them.',
      ],
      illumivein: [
        'A Shopify store for Illumivein, a handheld vein finder sold to nurses, phlebotomists and students.',
        'It is a single-product store, so the whole page is one argument: the problem in the headline, the price stated up front, the proof beside it — clinicians carrying one, verified reviews, FDA registration — and then the features, a demonstration video and the three-step instructions.',
      ],
      videoMilkshake: [
        'A Shopify store for Video Milkshake, selling editing assets for video work: presets, overlays, film textures, mattes, titles and colour looks.',
        'Everything here is a digital download, so there is no shipping, no stock and no returns to design around. What the store has to do instead is show motion in a still catalogue — the assets preview as video, they are sorted by what they do rather than what they are, and they sell in bundles as well as singly.',
      ],
      consciousInk: [
        'A Shopify store for Conscious Ink, which sells manifestation temporary tattoos — wearable affirmations meant to interrupt negative self-talk.',
        'The store sells a habit rather than an object, so it explains before it sells: the claim, the reasoning behind it, the benefits set out one by one, the product guarantees, and a long wall of customer reviews. A subscription runs alongside the one-off purchase.',
      ],
      perriconeMd: [
        "A storefront for Perricone MD, a US skincare brand built on its founder's anti-inflammatory research — serums, moisturisers, cleansers and supplements sold as one regimen.",
        'The catalogue is organised around a concern rather than a product line: a shopper picks the problem, is matched to a serum, and is walked toward the three-tier philosophy of diet, supplements and topical care. Subscriptions, a rewards programme and bundled routines sit on top of the individual product pages.',
      ],
      wildfang: [
        'A Shopify store for Wildfang, an apparel brand selling suiting, workwear and everyday basics cut outside conventional sizing.',
        'The work here is collection filtering. A deep catalogue spread across new arrivals, button-ups, bottoms, coveralls and blazers has to stay navigable while sale banners, countdown timers and lookbook photography run over the top of it.',
      ],
      garnetMarketplace: [
        'The product site for Garnet, a Shopify app that turns a single-vendor store into a multi-vendor B2B or B2C marketplace.',
        'The site sells a platform rather than a product, so it is built as an argument: a scaling roadmap, integrations with Stripe, WooCommerce, Klaviyo and Google Analytics, onboarding times stated in minutes, and a booked consultation as the call to action.',
      ],
      miroTea: [
        'A Shopify store for Miro Tea, a Seattle tea shop selling single-estate leaf, caffeine-free blends and artisanal teaware.',
        'The storefront leans on photography and restraint — a long editorial hero, then the catalogue. The collection page carries the weight instead, filtering hundreds of teas by type, flavour, origin and format.',
      ],
      hubspot: [
        'The marketing site for HubSpot, the customer platform that ties marketing, sales and service onto a single customer record.',
        'It is a large content structure serving several products at once: the platform overview, per-product pages, AI agents, pricing tiers and a demo funnel, all held together by a consistent set of section patterns and one conversion path.',
      ],
      webfx: [
        'The site for WebFX, a US digital marketing agency selling SEO, paid media, CRO and web development.',
        'A WordPress build with a very large content structure — service pages several levels deep, case studies, industry pages and a proposal funnel — where the navigation and the internal linking matter as much as any single page.',
      ],
      belaySolutions: [
        'The site for BELAY, a US staffing company placing virtual assistants, bookkeepers and marketing help with small businesses.',
        'Everything on the page runs toward a single lead-capture step. The comparison table against traditional hiring, the client testimonials, the trust logos and the pricing request all exist to move a visitor into the same form.',
      ],
      hotelJobs: [
        'HotelJobs, a South African recruitment portal for the hospitality industry — hotels, lodges and restaurants posting to candidates.',
        'Two audiences share one system: employers posting and managing vacancies, and candidates searching by job type, location and seniority, then applying against a stored CV. Premium listings are merchandised above the free ones.',
      ],
      aimro: [
        'The site for AIMRO, the association of Irish market research organisations, which represents the industry to regulators and sets its standards.',
        'A React front end on a Node API. The public side is a small editorial site — members, polls, news, standards — but the content behind it is structured data, so the pages are generated from the API rather than built by hand.',
      ],
      vizury: [
        'The product site for Vizury Engage360, a marketing platform for user acquisition, conversion and retention across web, app and WhatsApp.',
        'It has to explain a technical product to a commercial buyer, so the page carries the mechanism and the outcome side by side: journey builders and segment data on one hand, ROAS and incremental conversion on the other.',
      ],
      rembrr: [
        'The product site for Rembrr, a voice-driven reminder assistant that turns a spoken note into email, tasks and calendar entries.',
        'The product is an assistant, so the site is written as a conversation: you speak, Rembrr does the rest. Three steps, a phone mockup for each, then the audiences — freelancers, entrepreneurs, corporate teams — and a free trial rather than a booked demo.',
      ],
      dentalis: [
        'The site for Dentalis, a Brazilian dental practice management product sold to clinics as one system for scheduling, records and billing.',
        'Booking runs through the WhatsApp Business API rather than a form, which is how patients in that market actually book. The site carries the automation argument — a practice that runs 24 hours a day — alongside the numbers and a tour of the software.',
      ],
      trakMd: [
        'trakMD Doctor App, a React Native app for clinicians on iOS and Android, published on the App Store.',
        'The doctor-facing half of a patient tracking system: appointments, patient records and messaging in one place, with a single codebase shipping to both platforms.',
      ],
    },
      links: { demo: 'Watch the demo', store: 'View on Google Play', site: 'Visit the site', appStore: 'View on the App Store' },
    mediaAlt: (name) => `Preview of ${name}`,
  },

  experience: {
    eyebrow: 'Experience',
    heading: 'Work history',
    role: 'Full Stack & Mobile Developer',
    company: 'Remote Development — Freelance',
    period: 'August 2019 — Present',
    points: [
      'Collaborating remotely with clients across Latin America, Brazil and the United States.',
      'Building web applications with React, Next.js, Node.js and TypeScript, and back ends with Python, Django, PHP and Laravel.',
      'Shipping Android and iOS apps with React Native, Flutter and Unity 3D.',
      'Delivering WordPress sites and Shopify stores, from design through to launch.',
    ],
  },

  contact: {
    eyebrow: 'Contact',
    heading: 'Get in touch',
    body: 'Questions about my work, a role or a project? Send a message and I will get back to you.',
    form: {
      name: 'Your name',
      email: 'Your email',
      message: 'Your message',
      send: 'Send email',
      subject: 'Message from your portfolio',
      direct: 'Or write to me directly at',
      note: 'This opens your own mail app with the message ready to send.',
    },
  },

  footer: {
    role: 'Full Stack & Mobile Developer · Poland',
  },
}
