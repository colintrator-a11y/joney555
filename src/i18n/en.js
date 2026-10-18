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
    title: 'Full Stack & Mobile & AI automation Developer',
    tagline:
      'Web applications, mobile apps, online stores and AI automation — taken from the first requirement through to deployment.',
    note: 'This site introduces my skills and the projects behind them.',
    cta: 'See the work',
    // The hero's two lines under the name: the title, then the stack it is
    // built on. Split so the title can be set wide and the stack small.
    headline: 'Senior Mobile & AI Software Engineer',
    // The words the particle name cycles through after the name itself, ten
    // seconds each: the headline's stack, short enough to set large.
    cycle: ['Flutter', 'React Native', 'Python', 'Full-Stack', 'AI Integration'],
    // Four clicks on the name.
    secret: 'Wendy',
    stack: 'Flutter · React Native · Python · Full-Stack Development · AI Integration · 7+ Years of Software Engineering Experience',
    scroll: 'Scroll to explore',
    // Printed under the portrait in the About section.
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
    // The pipe-separated line is rendered as its own row of segments; the
    // separators are drawn rather than typed, so they can be styled.
    headline:
      'Senior Mobile & AI Software Engineer | Flutter | React Native | Python | Full-Stack Development | AI Integration | 7+ Years of Software Engineering Experience',
    lead: 'I build cross-platform apps in Flutter and React Native, the Python and Node services behind them, and the AI that increasingly sits in the middle \u2014 LLM APIs, chat, document processing, automation. Seven years of it, with product teams in Singapore.',
    reach: (count) =>
      `7 years and ${count} projects across mobile, AI and full-stack work. This page walks through the skills and the work behind them.`,
    bestTitle: 'What I do best',
    // The label at the foot of each area card; the card itself is the link.
    bestGo: 'See these projects →',
    best: [
      { id: 'mobile', area: 'Mobile apps', detail: 'Flutter and React Native for Android and iOS, from first build to store release' },
      { id: 'ai', area: 'AI integration', detail: 'LLM APIs, chat, document processing and automation, built into real products' },
      { id: 'fullstack', area: 'Full-stack', detail: 'Python, FastAPI and Django or Node.js back ends, React front ends, PostgreSQL' },
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
      mobile: {
        title: 'Mobile apps',
        body: 'Cross-platform apps in Flutter and React Native for Android and iOS — state management, authentication, push notifications, and releases to both stores.',
      },
      ai: {
        title: 'AI integration',
        body: 'LLM APIs and intelligent chat built into products, AI-powered document processing, and the Python services that run them in production.',
      },
      fullstack: {
        title: 'Full-stack & APIs',
        body: 'REST APIs in FastAPI, Django or Node.js on PostgreSQL, React and TypeScript front ends, containerised with Docker and deployed on AWS.',
      },
    },
  },

  skills: {
    eyebrow: 'Skills',
    heading: 'The stack I work in',
    note: (count, areas) => `${count} technologies across ${areas} areas`,
    groups: {
      mobile: 'Mobile',
      ai: 'AI & automation',
      backend: 'Back end & data',
      commerce: 'Games & e-commerce',
      frontend: 'Front end',
      other: 'Delivery',
    },
  },

  projects: {
    eyebrow: 'Work',
    heading: 'Selected projects',
    note: (count) => (count === 1 ? 'One project' : `${count} projects`),
    bySkill: 'Skill',
    allSkills: 'All skills',
    reset: 'Clear filters',
    more: (count) => `View ${count} more`,
    progress: (shown, total) => `${shown} of ${total} shown`,
    empty: 'No projects match these filters.',
      skillsCommon: 'Most used',
      skillsOther: 'Everything else',
    all: 'All work',
    categories: {
      mobile: 'Mobile',
      ai: 'AI integration',
      fullstack: 'Full-stack',
      games: 'Games',
      ecommerce: 'E-commerce',
    },
    // The empty slots. Shown on the page, deliberately plain, so the places
    // where a project belongs are easy to find.
    slot: {
      label: 'Project slot — to be added',
      from: (company) => `Work from ${company}`,
      stack: 'Expected stack',
    },
    items: {
      lordOfTheModels: [
        'Lord of the Models is a trading automation platform, built around its Momentum Inverse Model. I designed and developed it from A to Z: the public website and the admin dashboard, with a custom UI, responsive design, the back end, content management and secure administration.',
        'The admin dashboard runs the strategy: it shows live system status, the current position with its quantity, entry price and value, and the full trade history. From it you control trading and simulation, configure market hours, ETFs, trading parameters and alerts, manage trading accounts and tokens, set holidays, and connect a Charles Schwab account to switch into real trading mode.',
        'Built on the MERN stack — MongoDB, Express.js, React and Node.js — with Tailwind CSS, and fully responsive across desktop, tablet and mobile.',
      ],
      winterDesktops: [
        'Winter Desktops is the home of Winter Panda, a calm, privacy-first companion that lives on your desktop — reacting to your rhythm with gentle animations and one warm daily check-in, with no accounts and no tracking. I designed and developed the complete ecosystem from A to Z: the public website, the user web app, the admin dashboard, the back end, a responsive UI and the platform management tools.',
        'The Windows app is built with Tauri and Rust, published on Steam and the Microsoft Store, with ambient soundscapes, loop and shuffle, and the panda settled into the corner of the screen. The website presents the experience and a gift flow to send Winter Panda to friends, family or a whole team; the user app lets businesses manage subscriptions, licences and gift invitations.',
        'The admin console runs the business platform — customers, plans and pricing, subscriptions, invitations, prospects and CSV exports — alongside Bagel Warmth analytics on installs, mood distribution and reflection words.',
      ],
      familj: [
        'A pregnancy health app built as a client project, designed to support pregnant women throughout their pregnancy journey. It brings guidance, health tips and community interaction together in one easy-to-use platform.',
        'Features: weekly pregnancy suggestions and health tips, a checklist of what needs to be done at each stage, a community system with blog comments for discussion and support, a web application for easy access, and mobile apps on iOS and Android.',
        'Tech stack: Node.js on the back end, React.js on the web front end, and Flutter for the iOS and Android apps. The result is a scalable, user-friendly solution that holds up across every device while helping expectant mothers stay informed and connected.',
      ],
      yogiApproved: [
        'Find your OM at home! YogiApproved Classes — Home Yoga & Fitness Workouts — features premium on-demand yoga and fitness classes with world-class instructors. Follow along with knowledgeable, approachable instructors through the yoga or fitness class of your choice, with hundreds of unique classes from complete beginner to advanced.',
        'In the app: hundreds of yoga, fitness and movement classes with new ones added weekly; classes downloaded and taken offline across yoga, fitness, meditation and mindfulness; programs that work towards a goal; a personal collection of classes and programs; and a tree planted for every class taken, over 250,000 so far. Published on the App Store and Google Play, with a 14-day trial.',
        'Skills: Java, Android, iOS development and mobile app development for iPhone.',
      ],
      playFitt: [
        'PlayFitt is the fitness game that gets you addicted to moving! It motivates you to lead an achievable, active lifestyle by turning your daily home workout into a game. All your steps, stairs, squats, push-ups and active breaks are counted automatically.',
        'PlayFitt makes movement just as fun as your favourite video game, or as routine as scrolling through social media. With daily and weekly goals, it encourages you to stay active in small bites, more often — and in the app you earn coins to invest, plant trees, invite and nudge friends, and climb a friends leaderboard.',
        'Built with Flutter for iOS and Android, on a PHP back end, and published on the App Store and Google Play.',
      ],
      hasfit: [
        'I redesigned and developed the WordPress website of HASfit Personal Trainer, a San Antonio personal training business, with a focus on service presentation, customer inquiries and local SEO.',
        'The site has dedicated pages for personal training, training for two and in-home training, alongside trainer profiles, client testimonials, and a prominent "start with $100 in free training" offer linked to the contact form. Visitors can explore the Central and Northwest locations, with their addresses, phone numbers and directions, and the business\'s 4.9-star Google rating and 15 years in San Antonio are shown up front.',
        'The brief was to modernise the site while keeping its existing functionality and search visibility, fully responsive on desktop and mobile. The completed project received a 5.0 client review on Freelancer.',
      ],
      agCashCarry: [
        'AG Cash & Carry is a UK wholesale supplier of food and non-food products for businesses. I designed and developed its website from scratch: a professional, responsive eCommerce site with custom layouts, clear service presentation, intuitive navigation and a polished user experience.',
        'Built for wholesale customers, it makes products easy to find through clear categories, search and filters, and a Top Sellers section; product pages carry variations, images and related products; customers have accounts for easy reordering, with a simple, secure cart and checkout — browse, view, add to cart, check out.',
        'Built on WordPress and WooCommerce with PHP and MySQL, fully responsive across desktop, tablet and mobile, and optimised for speed and SEO.',
      ],
      ramboBikes: [
        "I worked on Rambo Bikes' existing Shopify store — the e-bike brand behind the Rambo Revolt and the No. 1 hunting e-bike — to clear backend roadblocks and make shopping for a bike more intuitive. My role: Shopify developer, focused on custom functionality and backend improvements.",
        'The scope combined Shopify automation and backend troubleshooting with an interactive bike-builder workflow: guided questions, customisable parts selection, and a visual representation of the parts chosen. Speed optimisation and user experience were key priorities throughout.',
        'The completed project received a 5.0/5 client review. The client highlighted how I identified the backend issues, implemented a practical solution efficiently, and kept communication clear and responsive: "His communication was excellent, and he made what could have been a complicated process feel simple."',
      ],
      fieldService: [
        'I developed a mobile application for field service companies, helping technicians and managers handle daily operations more efficiently.',
        'Technicians receive work orders, update job statuses, upload photos, collect customer signatures and complete service reports directly from their phones. Managers assign tasks, monitor job progress and review technician activity through a centralised system, with live tracking of vehicles, fleet performance and analytics on the dashboard.',
        'The app and the management dashboard are tied together through API integration, so every update from the field reaches the office as it happens.',
      ],
      northbridge: [
        'Northbridge Talent is a recruitment and talent solutions firm connecting organisations with exceptional people. I designed and developed its website from scratch: a professional, responsive site with custom layouts, clear service presentation, intuitive navigation and a polished user experience.',
        'The site speaks to both sides of hiring. Employers find the services — executive search, talent acquisition, contract and temporary staffing, and talent consulting — while candidates get their own pages for finding opportunities, career support and working with a trusted partner. Every path leads to a clear next step: explore, read the details, submit an inquiry or browse opportunities.',
        'Built on WordPress with Elementor, PHP and MySQL; fully responsive across desktop, tablet and mobile, and optimised for performance and SEO.',
      ],
      dentalia: [
        'Dentalia is a network of more than 60 dental clinics across Mexico. Through my expertise in web design and development, I transformed its website into a visually striking, user-friendly platform that performs exceptionally across devices and search engines.',
        'The site brings the whole network together: a clinic locator with booking online, by phone or WhatsApp; treatments from implants and orthodontics to whitening and children\'s dentistry; individual and family memberships; insurance and corporate plans; promotions and financing; and a free first evaluation as part of booking.',
      ],
      homely: [
        'Homely is an Australian real estate platform for finding homes to buy and rent. I developed the Homely website from scratch, creating a fully functional, responsive and user-friendly platform — from conceptual design to deployment.',
        'Front end: a modern UI/UX with seamless navigation across all devices. Back end: scalable server-side logic, APIs and database management to handle listings, user accounts and search. Integration: advanced property search, filtering and interactive maps.',
        'Optimisation: high performance, fast load times and an SEO-friendly architecture — an end-to-end web solution held to high standards of performance and usability.',
      ],
      trakMd: [
        'trakMD Doctor App, a React Native app for clinicians on iOS and Android, published on the App Store.',
        'The doctor-facing half of a patient tracking system: appointments, patient records and messaging in one place, with a single codebase shipping to both platforms.',
      ],
      keepNote: [
        'KeepNote is a fast, simple, and privacy-first note-taking app that stores all your data locally on your device. With no complicated setup or online account required, the app ensures your notes stay private.',
        'Key features: local storage with no cloud, a simple interface for quick note creation, a privacy-focused design, and full offline functionality. Built with Flutter and SQLite.',
      ],
      currencyConverter: [
        'This Currency Converter mobile app is built using Flutter, delivering fast, accurate, and real-time currency conversion. I integrated a high-speed API to ensure reliable and up-to-date exchange rates.',
        'Key features and technologies: fast and accurate currency data via a high-performance API, GetX for state management and smooth app performance, Firebase Authentication for secure user access, GetStorage as a local database for user preferences and data, user data persistence through efficient state management, and a fully responsive design that looks great on all devices.',
        'The app provides a seamless user experience with modern architecture, high performance, and a clean UI across all screen sizes.',
      ],
      aiArt: [
        'AI Art Generator is a revolutionary mobile app that enables users to create stunning artwork effortlessly with just a few taps. Powered by advanced artificial intelligence, this innovative app transforms your text prompts into breathtaking, high-quality visuals.',
        "Whether you're an artist, designer, or someone looking to explore their creative side, AI Art Generator provides a seamless platform to bring your ideas to life. Its intuitive interface allows you to generate unique and personalized artwork, offering endless creative possibilities. By leveraging cutting-edge AI technology, the app redefines the way we create and experience art, making it accessible to everyone, regardless of skill level.",
      ],
      qalorie: [
        'Qalorie is a health coaching app, published on both stores as Qalorie: Weight Loss & Health. Users connect with coaches for consultations, diet plans, workouts and biohacking tips, and track calories, macros, water and exercise against daily goals.',
        'I worked across the mobile app and the back end. The app is React Native with Redux, hooks and sagas; the back end is Node.js on MongoDB, with AWS S3 holding the media.',
        'Built into it: social sign-in through Firebase for Facebook, Apple, Google and email; video and voice calling and live chat on CometChat; push notifications; Google Analytics and AppsFlyer; a social feed with multi-image and video posts, comments, likes and following; and PayPal and Stripe payments. Publishing to the App Store and Play Store was mine as well.',
        'The hard part was editing and trimming video inside the app for sharing to the feed. Designs came in as Figma and InVision files.',
      ],
      ayiko: [
        'Ayiko is a multi-vendor eCommerce platform built to bring sellers, customers, drivers, and agents into one system. The idea was to create a marketplace where sellers can run their own operations while customers enjoy a smooth shopping and delivery experience.',
        'Customers can browse products from multiple sellers and place orders easily. On the other side, sellers can manage their own listings, handle orders, and assign deliveries to their own drivers. Drivers receive the required details and handle last-mile delivery, keeping the process fast and controlled at the seller level.',
        'The platform also includes an agent model to support growth. Agents can promote the platform using their own codes, and whenever a new customer signs up through them, the agent earns a commission. This helps the business grow through referrals, without heavy marketing spend.',
        'Overall, Ayiko was built as a complete system that integrates operations, delivery, and growth in one place.',
      ],
      eMuvas: [
        'E-Muvas is a delivery service mobile app that allows users to request deliveries in two modes: Instant Requests and Scheduled Requests. It provides real-time updates and live tracking for both modes.',
        'Users can also rate and review drivers after completing deliveries, ensuring transparency and quality service. Payment is processed via a secure gateway, requiring a linked card for transactions.',
      ],
      rasaHandoff: [
        'This is a Rasa chatbot example demonstrating how to build an AI assistant for an IT Helpdesk. It includes an integration with the Service Now API to open incident reports and check on incident report statuses. Below is an example conversation, showing the bot helping a user open a support ticket and query its status.',
        'You can use this chatbot as a starting point for building customer service assistants or as a template for collecting required pieces of information from a user before making an API call. This bot includes a simple skill for handing off the conversation to another bot or a human.',
        'Using this demo, we can transfer the conversation from one bot to another bot, or hand off to a human.',
      ],
      n8nChatbot: [
        'I built and launched a robust WhatsApp chatbot workflow for property management in 3 weeks, streamlining how support teams handle incoming requests and ticket creation.',
        'The system handles incoming messages, media attachments, and user verification by combining n8n automation with PostgreSQL persistence. It uses stateful conversation management to guide users smoothly through multi-step forms like ticket types, titles, and descriptions while keeping track of user sessions.',
        'Results: automated user verification, reduced ticket creation time from hours to minutes, round-the-clock customer support availability, and reliable data consistency across all user interactions.',
        'Tech stack: n8n, WhatsApp API, PostgreSQL, relational database architecture, event-driven workflows, state machine logic, and automated notification integrations.',
      ],
      musicPlayer: [
        'A feature-rich Android music player built for a client, with a modern interface and a smooth playback experience. This was the first phase of development for a popular music app.',
        'It covers a custom equalizer — five bands plus reverb, bass, virtualizer and loudness — along with custom playlist creation, advanced search, metadata editing, custom filters for organising a library, and easy deletion of unwanted audio files. The app is built for speed, usability and audio performance.',
      ],
      enterpriseErp: [
        'EnterpriseERP is a cloud-based Enterprise Resource Planning platform designed to centralize and automate core business operations within a single integrated system. The solution provides organizations with real-time visibility into financial performance, sales activities, inventory levels, procurement processes, customer relationships, and workforce management, enabling data-driven decision-making and operational efficiency.',
        'The platform consists of multiple interconnected modules, including Finance, Sales, Purchasing, Inventory, Production, CRM, Human Resources, Projects, Assets, Reports, and Document Management. Each module shares a unified database, ensuring data consistency and eliminating duplicate data entry across departments.',
        'The Finance module manages accounts payable, accounts receivable, general ledger, budgeting, tax management, banking, and financial reporting.',
      ],
      slotMobileAi: [
        'Your flagship from Originally US: a cross-platform app with LLM-powered chat or AI features. Show the app screens, what the AI does for the person using it, and one outcome — users, rating, or a measured improvement.',
      ],
      slotDocumentAi: [
        'The AI document processing and workflow automation from Tech JDI. Show the pipeline — what goes in, what the model extracts, where it ends up — and how much manual work it took off the team.',
      ],
      slotWebPlatform: [
        'A web application from Tech JDI: a React and TypeScript front end on a FastAPI or Django API, containerised and running on AWS. Show the product, a simple architecture diagram, and your part in it.',
      ],
      slotFlutterProduct: [
        'A Flutter product from Buuuk — authentication, push notifications, BLoC state management. Show the screens and one thing you improved, such as performance or test coverage.',
      ],
      mmorpg: [
        'A Unity 3D mobile MMORPG for Android and iOS, in the massively multiplayer base-building strategy genre: players raise an army, upgrade a castle and its economy, and fight real-time battles against other players.',
        'The build covers the whole live-game loop — troop training and barracks upgrades, a research tree for farming, stone, timber, gold and build speed, real-time siege combat with victory rewards, power and troops-killed leaderboards, hero and leader selection, seven-day login rewards, and an in-app purchase shop of chest packs, gem packs, memberships and subscriptions. The build shown runs with a Spanish-language interface.',
      ],
      tapio: [
        'Introducing Tapio, the best tap-to-earn game available on Telegram. With every tap, users dive into a world of instant rewards, where each action brings new opportunities.',
        'As players engage in the game, they not only earn rewards but also gather exclusive perks, unlocking more benefits as they rise up the rankings. Tapio makes earning fun, interactive, and rewarding, providing a dynamic experience that keeps users coming back for more.',
      ],
      rabbitRoyale: [
        'Rabbit Royale is an innovative Telegram mini-app that offers users an exciting tap-to-earn game experience. Designed to keep players engaged, Rabbit Royale combines fun and rewards in a seamless, interactive platform.',
        'As users tap their way through the game, they have the opportunity to earn rewards and watch their profits grow daily. With its easy-to-use interface and engaging gameplay, Rabbit Royale provides a thrilling way to earn while enjoying a dynamic, rewarding experience.',
      ],
      wooBulkDiscount: [
        'A custom WordPress plugin that shows discounted prices dynamically. Built with PHP, HTML and CSS against WordPress and WooCommerce\u2019s own functions.',
      ],
      garnetMarketplace: [
        'The product site for Garnet, a Shopify app that turns a single-vendor store into a multi-vendor B2B or B2C marketplace.',
        'The site sells a platform rather than a product, so it is built as an argument: a scaling roadmap, integrations with Stripe, WooCommerce, Klaviyo and Google Analytics, onboarding times stated in minutes, and a booked consultation as the call to action.',
      ],
      tools4trade: [
        'A Shopify store for Tools4Trade, a UK retailer of power tools, hand tools, workwear and site equipment.',
        'This one is a catalogue problem. Thousands of lines across a dozen categories and every trade brand stocked side by side, with search by category, brand or part number, and merchandising that has to carry clearance, warehouse deals, new arrivals, brand redemptions and a rewards scheme without burying the products underneath them.',
      ],
      richmond: [
        'Richmond offers rolling solutions, including wheels and castors, across Australia and New Zealand, supplying reliable, high-quality material handling and custom-engineered rolling products for a wide range of industries.',
        'The site is a WordPress and WooCommerce store, with the range organised into product categories from castors, wheels and tyres through to pallet jacks, conveyors, roll cages and gate hardware, alongside site-wide product search and a store finder.',
      ],
    },
      links: { demo: 'Watch the demo', store: 'View on Google Play', site: 'Visit the site', appStore: 'View on the App Store', admin: 'Open the admin dashboard', app: 'Open the web app' },
    mediaAlt: (name) => `Preview of ${name}`,
  },

  experience: {
    eyebrow: 'Experience',
    heading: 'Work history',
    present: 'Present',
    // Shown as "1 yr 10 mos", the way a job's length is usually written.
    year: 'yr',
    years: 'yrs',
    month: 'mo',
    months: 'mos',
    // The role title and what the job involved, keyed by the ids in
    // src/data/profile.js. Written in the present tense for the job I am in
    // and the past for the ones I have left.
    items: {
      originallyUs: {
        role: 'Senior Mobile & AI Software Engineer',
        type: 'Full-time · Hybrid',
        points: [
          'Lead cross-platform mobile development using Flutter and React Native.',
          'Integrate Python-based AI services, LLM APIs and intelligent chat features.',
          'Design scalable backend architecture using FastAPI, Node.js and PostgreSQL.',
          'Mentor junior developers and improve CI/CD workflows.',
        ],
      },
      techJdi: {
        role: 'Full-Stack & AI Software Engineer',
        type: 'Full-time · Hybrid',
        points: [
          'Developed web applications with React, TypeScript and Python.',
          'Built REST APIs using FastAPI and Django.',
          'Implemented AI-powered document processing and workflow automation.',
          'Deployed containerised applications using Docker and AWS.',
        ],
      },
      buuuk: {
        role: 'Mobile Software Engineer',
        type: 'Full-time · Hybrid',
        points: [
          'Built mobile applications using Flutter and React Native.',
          'Integrated authentication, push notifications and third-party APIs.',
          'Implemented state management using BLoC and Redux.',
          'Improved application performance and maintained automated tests.',
        ],
      },
      codigo: {
        role: 'Mobile Application Developer',
        type: 'Full-time · On-site',
        points: [
          'Developed cross-platform mobile apps using React Native and Flutter.',
          'Converted UI/UX designs into reusable application components.',
          'Integrated REST APIs and Firebase services.',
          'Debugged application issues and prepared Android and iOS releases.',
        ],
      },
      vinova: {
        role: 'Junior Software Engineer',
        type: 'Full-time · On-site',
        points: [
          'Developed web and mobile application features.',
          'Built simple backend services using Python and Flask.',
          'Integrated REST APIs and maintained MySQL databases.',
          'Resolved bugs, wrote unit tests and took part in code reviews.',
        ],
      },
    },
  },

  contact: {
    eyebrow: 'Contact',
    channels: {
      email: 'Email',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
    },
    // Shown in the hero rail's label once the address is on the clipboard.
    copied: 'Address copied',
    heading: 'Get in touch',
    body: 'Questions about my work, a role or a project? Send a message and I will get back to you.',
    work: {
      eyebrow: 'Work with me',
      heading: 'Let’s build something together',
      body: 'Whether you are hiring for a team or have a product to ship, there are three ways we can work together.',
      available: 'Open to new opportunities',
      where: 'Based in Singapore · hybrid or remote',
      cta: 'Start a conversation',
      stepsTitle: 'How a project runs',
      engagements: {
        fulltime: {
          title: 'Full-time role',
          body: 'A senior mobile or AI engineering seat on a product team.',
          points: ['Lead Flutter and React Native work', 'Ship AI features to production', 'Mentor developers, improve CI/CD'],
          message: 'Hi Joney, I would like to talk to you about a full-time role: ',
        },
        contract: {
          title: 'Contract & freelance',
          body: 'A defined build with a clear scope and timeline.',
          points: ['New apps and MVPs', 'Features on an existing codebase', 'Through to App Store and Play Store release'],
          message: 'Hi Joney, I have a project I would like your help with: ',
        },
        ai: {
          title: 'AI integration',
          body: 'LLMs, chat and automation added to a product you already have.',
          points: ['LLM APIs and chat assistants', 'Document processing', 'Workflow automation'],
          message: 'Hi Joney, I would like to add AI to our product: ',
        },
      },
      steps: {
        talk: { title: 'Talk', body: 'You tell me what you need, and I ask what it is for.' },
        plan: { title: 'Plan', body: 'Scope, stack and milestones, agreed before any code.' },
        build: { title: 'Build', body: 'Working builds along the way, not one reveal at the end.' },
        launch: { title: 'Launch', body: 'Release, handover and support after go-live.' },
      },
    },
    form: {
      name: 'Your name',
      email: 'Your email',
      message: 'Your message',
      send: 'Send email',
      subject: 'Message from your portfolio',
      directTitle: 'Or reach me directly',
      note: 'This opens your own mail app with the message ready to send.',
    },
  },

  footer: {
    role: 'Full Stack & Mobile & AI automation Developer · Singapore',
  },
}
