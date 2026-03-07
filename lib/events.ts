export interface Event {
  name: string
  slug: string
  images: string[]
  thumbnail: string
  description: string
}

export interface EventCategory {
  category: string
  categorySlug: string
  description: string
  events: Event[]
}

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    "category": "Corporate Events",
    "categorySlug": "corporate-event",
    "description": "High-impact corporate gatherings, foundation days, and brand summits designed to foster connection and communicate corporate excellence.",
    "events": [
      {
        "name": "Viacom",
        "slug": "viacom",
        "images": [
          "/images/events/corporate event/Viacom/IMG_20171117_132246.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_132304.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_132311.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_132315.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_132322.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_132330.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_132341.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_132350.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_132358.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_194341.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_194346.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_194354.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_194400.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_194406.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_194410.webp",
          "/images/events/corporate event/Viacom/IMG_20171117_194716.webp",
          "/images/events/corporate event/Viacom/Screenshot_20171118-104317.webp",
          "/images/events/corporate event/Viacom/Screenshot_20171118-104324.webp",
          "/images/events/corporate event/Viacom/Screenshot_20171118-104328.webp",
          "/images/events/corporate event/Viacom/Screenshot_20171118-104333.webp",
          "/images/events/corporate event/Viacom/Screenshot_20171118-104341.webp",
          "/images/events/corporate event/Viacom/Screenshot_20171118-104344.webp"
        ],
        "thumbnail": "/images/events/corporate event/Viacom/IMG_20171117_132246.webp",
        "description": "A sophisticated corporate assembly for Viacom, featuring custom-branded environments and seamless event flow."
      },
      {
        "name": "HP 44th Foundation Day",
        "slug": "hp-44th-foundation-day",
        "images": [
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_050036.webp",
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_050057.webp",
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_050111.webp",
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_050124.webp",
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_050135.webp",
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_051406.webp",
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_051530.webp",
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_144234.webp",
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_144334.webp",
          "/images/events/corporate event/HP 44th foundation day/IMG_20180713_144356.webp"
        ],
        "thumbnail": "/images/events/corporate event/HP 44th foundation day/IMG_20180713_050036.webp",
        "description": "Celebrating four decades of innovation with HP. EventBrite managed the end-to-end production for this landmark foundation day."
      },
      {
        "name": "NDTV Swach Diwas",
        "slug": "ndtv--swach-diwas",
        "images": [
          "/images/events/corporate event/NDTV -Swach diwas/IMG_20181001_183102.webp",
          "/images/events/corporate event/NDTV -Swach diwas/IMG_20181001_183204.webp"
        ],
        "thumbnail": "/images/events/corporate event/NDTV -Swach diwas/IMG_20181001_183102.webp",
        "description": "Production support for the NDTV Swach Diwas initiative, focusing on impactful branding and live broadcast logistics."
      }
    ]
  },
  {
    "category": "Brand Launches",
    "categorySlug": "brand-launch",
    "description": "Cinematic product reveals and brand activations that create lasting impressions for global leaders in automotive and lifestyle sectors.",
    "events": [
      {
        "name": "Audi Q8 Launch",
        "slug": "audi-q8-launch",
        "images": [
          "/images/events/Brand launch/audi q8 launch/IMG_20200115_041545.webp",
          "/images/events/Brand launch/audi q8 launch/IMG_20200115_041548.webp",
          "/images/events/Brand launch/audi q8 launch/IMG_20200115_041556.webp",
          "/images/events/Brand launch/audi q8 launch/IMG_20200115_041608.webp",
          "/images/events/Brand launch/audi q8 launch/IMG_20200115_041712.webp",
          "/images/events/Brand launch/audi q8 launch/IMG_20200115_041726.webp"
        ],
        "thumbnail": "/images/events/Brand launch/audi q8 launch/IMG_20200115_041545.webp",
        "description": "The grand reveal of the Audi Q8. A high-octane launch event featuring precision lighting and premium stage design."
      },
      {
        "name": "Ford Endeavour",
        "slug": "ford-endevour",
        "images": [
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0002.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0004.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0006.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0010.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0011.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0012.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0013.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0014.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0018.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0052.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0053.webp",
          "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0054.webp"
        ],
        "thumbnail": "/images/events/Brand launch/Ford Endevour/IMG-20160120-WA0002.webp",
        "description": "Launching the Ford Endeavour with a focus on its rugged capability and refined luxury, showcased through an immersive experience."
      },
      {
        "name": "Johnson",
        "slug": "johnson",
        "images": [
          "/images/events/Brand launch/Johnson/FB_IMG_1524774609791.webp",
          "/images/events/Brand launch/Johnson/FB_IMG_1554751947500.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0006.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0007.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0008.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0009.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0010.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0012.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0013.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0014.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0015.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0016.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0017.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0018.webp",
          "/images/events/Brand launch/Johnson/IMG-20180503-WA0022.webp",
          "/images/events/Brand launch/Johnson/IMG_20180510_032607_309.webp",
          "/images/events/Brand launch/Johnson/IMG_20180510_032607_313.webp",
          "/images/events/Brand launch/Johnson/IMG_20180510_032607_317.webp",
          "/images/events/Brand launch/Johnson/IMG_20180510_032607_320.webp"
        ],
        "thumbnail": "/images/events/Brand launch/Johnson/FB_IMG_1524774609791.webp",
        "description": "Branding and exhibition design for Johnson, delivering a clean and professional showcase of their latest product lines."
      }
    ]
  },
  {
    "category": "Medical Conferences",
    "categorySlug": "doctors-conference",
    "description": "Professional medical symposiums and healthcare summits requiring meticulous organization and technical precision.",
    "events": [
      {
        "name": "Pedicon BKC",
        "slug": "pedicon-bkc",
        "images": [
          "/images/events/doctors conference/Pedicon-bkc/DISPLAY.webp",
          "/images/events/doctors conference/Pedicon-bkc/FB_IMG_1557001981241.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190107-WA0005.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190107-WA0007.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190221-WA0008.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190221-WA0010.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0001.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0002.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0003.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0004.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0005.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0008.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0009.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0010.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0011.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0014.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0015.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0017.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0018.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0019.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0020.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0021.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0022.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0023.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0024.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0025.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0026.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0027.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0028.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0029.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0030.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0031.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0032.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0033.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0035.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0037.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0038.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0039.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190224-WA0040.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190226-WA0022.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-20190226-WA0036.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-8541.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-8542.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-8543.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-8595.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-8660.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-8661.webp",
          "/images/events/doctors conference/Pedicon-bkc/IMG-8662.webp"
        ],
        "thumbnail": "/images/events/doctors conference/Pedicon-bkc/DISPLAY.webp",
        "description": "Pedicon at BKC Mumbai, a massive gathering of pediatricians. EventBrite managed complex exhibition stalls and conference logistics."
      },
      {
        "name": "International Doctors Conference - The Leela Goa",
        "slug": "international-doctors-conference-the-leela-goa",
        "images": [
          "/images/events/doctors conference/International Doctor_s Conference-the leela hotel-goa/PHOTO-2022-09-09-06-29-30.webp",
          "/images/events/doctors conference/International Doctor_s Conference-the leela hotel-goa/PHOTO-2022-09-09-12-46-14.webp",
          "/images/events/doctors conference/International Doctor_s Conference-the leela hotel-goa/PHOTO-2022-09-09-12-46-16.webp",
          "/images/events/doctors conference/International Doctor_s Conference-the leela hotel-goa/PHOTO-2022-09-09-12-47-09.webp",
          "/images/events/doctors conference/International Doctor_s Conference-the leela hotel-goa/PHOTO-2022-09-09-12-47-36.webp",
          "/images/events/doctors conference/International Doctor_s Conference-the leela hotel-goa/PHOTO-2022-09-09-12-47-36_1.webp",
          "/images/events/doctors conference/International Doctor_s Conference-the leela hotel-goa/PHOTO-2022-09-09-12-47-37.webp",
          "/images/events/doctors conference/International Doctor_s Conference-the leela hotel-goa/PHOTO-2022-09-09-12-47-38.webp"
        ],
        "thumbnail": "/images/events/doctors conference/International Doctor_s Conference-the leela hotel-goa/PHOTO-2022-09-09-06-29-30.webp",
        "description": "An elite international conference held at The Leela, Goa, blending professional content with luxury hospitality management."
      }
    ]
  },
  {
    "category": "Special Events",
    "categorySlug": "specail-events",
    "description": "Bespoke celebrations, religious gatherings, and community festivals that demand unique creative vision and sensitive execution.",
    "events": [
      {
        "name": "Global Citizen Festival India - BKC",
        "slug": "global-citizen-festival-india-bkc",
        "images": [
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0000.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0001.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0002.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0003.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0004.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0005.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0006.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0007.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0008.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0009.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0010.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0011.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0012.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0013.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0016.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0018.webp",
          "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0019.webp"
        ],
        "thumbnail": "/images/events/specail events/Global citizen festival India-bkc/IMG-20161122-WA0000.webp",
        "description": "Production support for the iconic Global Citizen Festival at BKC, managing large-scale infrastructure and branding."
      },
      {
        "name": "Reliance Family Day 40 - Jio Airoli",
        "slug": "reliancefamilyday40-jio-airoli",
        "images": [
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1138.webp",
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1223.webp",
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1224.webp",
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1298.webp",
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1299.webp",
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1305.webp",
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1334.webp",
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1367.webp",
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1382.webp",
          "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1387.webp"
        ],
        "thumbnail": "/images/events/specail events/reliancefamilyday40-jio-airoli/IMG-1138.webp",
        "description": "Celebrating 40 years of Reliance with a massive family day event at Jio Airoli, featuring curated experiences for thousands of employees."
      }
    ]
  },
  {
    "category": "Sports Events",
    "categorySlug": "sports-event",
    "description": "Dynamic sports activations, after-parties, and national games where energy and precision are paramount.",
    "events": [
      {
        "name": "Delhi Capitals After Party",
        "slug": "delhi-capitals-after-party",
        "images": [
          "/images/events/sports event/DELHI CAPITALS AFTER PARTY/IMG-2436.webp",
          "/images/events/sports event/DELHI CAPITALS AFTER PARTY/IMG-2437.webp",
          "/images/events/sports event/DELHI CAPITALS AFTER PARTY/IMG-2438.webp",
          "/images/events/sports event/DELHI CAPITALS AFTER PARTY/IMG-2439.webp",
          "/images/events/sports event/DELHI CAPITALS AFTER PARTY/IMG-2441.webp",
          "/images/events/sports event/DELHI CAPITALS AFTER PARTY/IMG-2442.webp"
        ],
        "thumbnail": "/images/events/sports event/DELHI CAPITALS AFTER PARTY/IMG-2436.webp",
        "description": "An exclusive high-energy after-party for the Delhi Capitals, featuring vibrant lighting and immersive branding."
      },
      {
        "name": "National Games - Bhavnagar",
        "slug": "national-game-sport-complex-bhavnagar-gujrat",
        "images": [
          "/images/events/sports event/National game-sport complex bhavnagar-gujrat/PHOTO-2022-09-24-19-18-09.webp",
          "/images/events/sports event/National game-sport complex bhavnagar-gujrat/PHOTO-2022-09-24-19-18-09_1.webp",
          "/images/events/sports event/National game-sport complex bhavnagar-gujrat/PHOTO-2022-09-24-19-18-09_2.webp",
          "/images/events/sports event/National game-sport complex bhavnagar-gujrat/unnamed.webp"
        ],
        "thumbnail": "/images/events/sports event/National game-sport complex bhavnagar-gujrat/PHOTO-2022-09-24-19-18-09.webp",
        "description": "Infrastructure and event management for the National Games in Bhavnagar, Gujarat, showcasing sports excellence."
      }
    ]
  },
  {
    "category": "Political Events",
    "categorySlug": "political-events",
    "description": "High-stakes political gatherings and institutional events requiring absolute security, dignity, and logistical perfection.",
    "events": [
      {
        "name": "Mazgaon Dock Shipbuilders",
        "slug": "mazgaon-dock-shipbuilders",
        "images": [
          "/images/events/political events/Mazgaon Dock Shipbuilders/IMG_20190507_115558.webp",
          "/images/events/political events/Mazgaon Dock Shipbuilders/IMG_20190507_115625.webp",
          "/images/events/political events/Mazgaon Dock Shipbuilders/IMG_20190507_115654.webp"
        ],
        "thumbnail": "/images/events/political events/Mazgaon Dock Shipbuilders/IMG_20190507_115558.webp",
        "description": "A prestigious institutional event for Mazgaon Dock Shipbuilders, reflecting the industrial might and heritage of the organization."
      },
      {
        "name": "IIP Mumbai",
        "slug": "iip-mumbai",
        "images": [
          "/images/events/political events/IIP MUMBAI/IMG-20180917-WA0012.webp",
          "/images/events/political events/IIP MUMBAI/IMG-20180917-WA0013.webp",
          "/images/events/political events/IIP MUMBAI/IMG-20180917-WA0014.webp",
          "/images/events/political events/IIP MUMBAI/IMG-20180917-WA0015.webp",
          "/images/events/political events/IIP MUMBAI/IMG-20180917-WA0016.webp",
          "/images/events/political events/IIP MUMBAI/IMG-20180917-WA0017.webp",
          "/images/events/political events/IIP MUMBAI/IMG-20180917-WA0018.webp",
          "/images/events/political events/IIP MUMBAI/IMG-20180917-WA0019.webp"
        ],
        "thumbnail": "/images/events/political events/IIP MUMBAI/IMG-20180917-WA0012.webp",
        "description": "Institutional branding and event flow management for IIP Mumbai, ensuring a professional and dignified environment."
      }
    ]
  },
  {
    "category": "Exhibitions",
    "categorySlug": "exhibition",
    "description": "Award-winning exhibition stalls and pavilion designs that stand out in crowded arenas, driving engagement and brand recall.",
    "events": [
      {
        "name": "MCHI CREDAI",
        "slug": "mchi-credai",
        "images": [
          "/images/events/exhibition/MCHI CREDAI/IMG-20160115-WA0022.webp",
          "/images/events/exhibition/MCHI CREDAI/IMG-20160115-WA0023.webp",
          "/images/events/exhibition/MCHI CREDAI/IMG-20160115-WA0024.webp",
          "/images/events/exhibition/MCHI CREDAI/IMG-20160115-WA0025.webp",
          "/images/events/exhibition/MCHI CREDAI/IMG-20160115-WA0026.webp",
          "/images/events/exhibition/MCHI CREDAI/IMG-20160115-WA0027.webp",
          "/images/events/exhibition/MCHI CREDAI/IMG-20160115-WA0028.webp"
        ],
        "thumbnail": "/images/events/exhibition/MCHI CREDAI/IMG-20160115-WA0022.webp",
        "description": "High-impact exhibition pavilion for MCHI CREDAI, featuring bespoke lighting and interactive visitor zones."
      },
      {
        "name": "Oracle Exhibition",
        "slug": "oracle-exhibition",
        "images": [
          "/images/events/exhibition/ORACLE EXHIBITION/IMG-20151007-WA0006.webp",
          "/images/events/exhibition/ORACLE EXHIBITION/IMG-20151007-WA0007.webp",
          "/images/events/exhibition/ORACLE EXHIBITION/IMG-20160112-WA0037.webp",
          "/images/events/exhibition/ORACLE EXHIBITION/IMG-20160112-WA0045.webp",
          "/images/events/exhibition/ORACLE EXHIBITION/IMG-20160112-WA0055.webp"
        ],
        "thumbnail": "/images/events/exhibition/ORACLE EXHIBITION/IMG-20151007-WA0006.webp",
        "description": "Modern and professional booth design for Oracle, emphasizing technology and corporate clarity."
      }
    ]
  }
]

export function getCategoryBySlug(slug: string): EventCategory | undefined {
  return EVENT_CATEGORIES.find(c => c.categorySlug === slug)
}

export function getEventBySlug(categorySlug: string, eventSlug: string): Event | undefined {
  const category = getCategoryBySlug(categorySlug)
  return category?.events.find(e => e.slug === eventSlug)
}
