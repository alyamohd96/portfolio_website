/*
  Everything on the site comes from this file.
  Edit text, add books or episodes here; you never need to touch app.js.

  Leave a field as "" to hide it.
*/
window.SITE = {
  owner: {
    name: "Alya",
    role: "COO & Co-founder, UniLah",
    location: "Kuala Lumpur, Malaysia",
    tagline:
      "Engineer by training, consultant by trade, operator by choice. Building toward technical founder.",
    resumePdf: "",            // e.g. "assets/resume.pdf" (adds a Download button to the resume)
    photo: "assets/profile_photo.jpg", // shows as me.jpg in About Me
    email: "",                // shown as selectable text in the terminal `contact` command
    wallpaper: "assets/wallpaper.jpg",
    wallpaperCredit: "Claude Monet, Irises in Monet's Garden (1900)",
  },

  links: [
    { label: "GitHub", url: "https://github.com/alyamohd96" },
    { label: "LinkedIn", url: "" },
    { label: "Pretty Clever on YouTube", url: "https://www.youtube.com/channel/UCPKYQ1J8h4ezimZwKlxSbDQ" },
    { label: "Pretty Clever on Instagram", url: "https://www.instagram.com/prettycleverpod/" },
    { label: "Pretty Clever on TikTok", url: "https://www.tiktok.com/@prettycleverpod" },
  ],

  about: {
    bio: [
      "Hi, I'm Alya. I'm the COO and co-founder of UniLah, a Gen Z media and marketing agency in Bangsar that runs KOL campaigns, campus activations and content.",
      "Before that I spent three years at Bain & Company in London as a Specialist Associate Consultant, mostly on tech due diligence. Before that, I wrote code: front-end and back-end at Moovby, and internal tools and dashboards at Micron.",
      "I studied Computer Science & Engineering and Business Analytics at the University of Iowa, then did a Master's in Financial Technology at Imperial College Business School.",
      "On the side I co-host Pretty Clever, a bilingual podcast that backs personal stories with actual research papers.",
      "Long term, I want to be the person who sits between engineering and strategy: a technical founder.",
    ],
    now: [
      "Running operations and monetization at UniLah.",
      "Shipping a new Pretty Clever episode every week.",
      "Starting a 30-minutes-a-day cybersecurity habit (see ~/learning in the terminal).",
      "Rebuilding this website, obviously.",
    ],
  },

  resume: {
    experience: [
      {
        org: "UniLah",
        role: "COO & Co-founder",
        when: "Oct 2024 – present",
        where: "Bangsar, Kuala Lumpur",
        points: [
          "Co-founded a Gen Z-focused media and marketing agency.",
          "Lead operations across KOL marketing, campus activation and content production.",
        ],
      },
      {
        org: "Pretty Clever Pod",
        role: "Co-host & Producer",
        when: "Apr 2026 – present",
        where: "YouTube, Instagram, TikTok",
        points: ["Weekly bilingual podcast pairing personal stories with research."],
      },
      {
        org: "Bain & Company",
        role: "Specialist Associate Consultant",
        when: "2021 – 2024",
        where: "London",
        points: ["Tech due diligence."],
      },
      {
        org: "Moovby",
        role: "Software Engineer Trainee",
        when: "",
        where: "Cyberjaya",
        points: [
          "Front-end and back-end development, taking Figma designs to Ruby on Rails builds.",
          "Worked on the Moovby Enterprise launch in Indonesia.",
        ],
      },
      {
        org: "Micron Technology",
        role: "Operations Improvement Engineer",
        when: "",
        where: "Johor",
        points: ["Built a C# console app and Tableau dashboards for data extraction and reporting."],
      },
    ],
    education: [
      { org: "Imperial College Business School", detail: "Master's, Financial Technology" },
      {
        org: "University of Iowa",
        detail: "BSE Computer Science & Engineering · BBA Business Analytics",
      },
    ],
  },

  // Each post is a Markdown file in the blog/ folder. Add a line here to publish it.
  // Newest first or not, the site sorts by date. Start from blog/_template.md.
  blog: [
    // { title: "Hello, world", date: "2026-11-09", file: "2026-11-09-hello-world.md" },
  ],

  // status: "reading" | "read" | "next"
  books: [
    { title: "Islam dan Sosialisme", author: "Syed Hussein Alatas", status: "reading", note: "My first step into Islamic philosophy." },
    { title: "Outliers", author: "Malcolm Gladwell", status: "read", note: "The one that really stuck with me." },
    { title: "Subliminal", author: "Leonard Mlodinow", status: "read", note: "Loved the science of the unconscious mind." },
    { title: "Dune", author: "Frank Herbert", status: "read", note: "" },
    { title: "Psycho-Cybernetics", author: "Maxwell Maltz", status: "read", note: "" },
  ],

  podcast: {
    name: "Pretty Clever",
    blurb:
      "A bilingual (BM/English) podcast with my co-host Liz. We share real experiences, then check them against the research.",
    channelUrl: "https://www.youtube.com/channel/UCPKYQ1J8h4ezimZwKlxSbDQ",
    // Add a youtubeId (the part after watch?v=) to make an episode play right on the site.
    episodes: [
      { no: 21, title: "Why do people love or hate themselves?", youtubeId: "" },
      { no: 20, title: "Curly hair, with Deha Hauge", youtubeId: "" },
      { no: 19, title: "Why \"maybe\" is ruining your life", youtubeId: "" },
      { no: 18, title: "Feng shui", youtubeId: "jn_nV-7SR1A" },
      { no: 17, title: "Why we ignore red flags", youtubeId: "" },
      { no: 16, title: "Running a business vs working a 9-to-5", youtubeId: "" },
      { no: 15, title: "Why we should stop chasing an artificial beauty standard", youtubeId: "" },
      { no: 14, title: "Do you need to be rich to glow up?", youtubeId: "" },
      { no: 13, title: "Why hitting your goals can feel empty", youtubeId: "" },
      { no: 12, title: "Social capital in Malaysia", youtubeId: "" },
      { no: 11, title: "Betrayal and repairing trust", youtubeId: "" },
      { no: 10, title: "The neuroscience of heartbreak", youtubeId: "" },
      { no: 9, title: "Office politics", youtubeId: "" },
      { no: 8, title: "Islam, science and the anti-science stereotype", youtubeId: "" },
      { no: 7, title: "Female rivalry", youtubeId: "" },
      { no: 6, title: "Doom spending and the Malaysian M50", youtubeId: "" },
      { no: 5, title: "Can you really manifest success?", youtubeId: "" },
      { no: 4, title: "What doom scrolling does to your attention span", youtubeId: "" },
      { no: 3, title: "Hustle culture and how stress really works", youtubeId: "" },
      { no: 2, title: "Why your 20s were a trial run", youtubeId: "4HGKdY_4iAg" },
      { no: 1, title: "Science confirms pretty people win more", youtubeId: "" },
    ],
  },

  // Add projects here as { name, stack, summary, url }. The folder stays on the desktop when this is empty.
  projects: [],

  // Shown by `cat ~/learning/cybersec.log` in the terminal. Newest last.
  learningLog: [
    { date: "2026-11-09", entry: "Day 0. Picking resources for a 30-minutes-a-day cybersecurity habit." },
  ],
};
