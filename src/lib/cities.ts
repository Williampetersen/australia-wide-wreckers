import type { Faq } from "./faqs";

export type City = {
  slug: string;
  name: string;
  area: string; // wider region used in copy
  metaTitle: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  suburbs: string[];
  localNote: { heading: string; text: string };
  pickup: string;
  depot: string;
  faqs: Faq[];
  nearby: string[]; // other city slugs
  locationHref: string; // existing /locations page
  geo?: { lat: number; lng: number };
};

export const cities: City[] = [
  {
    slug: "newcastle",
    name: "Newcastle",
    area: "Newcastle and the Hunter",
    metaTitle: "Cash for Cars Newcastle | Free Car Removal, Top Cash Paid",
    description:
      "Sell your car for cash in Newcastle NSW. We buy damaged, old, unwanted and unregistered cars, utes, vans and bikes. Free car removal and a fast cash offer.",
    keywords: [
      "cash for cars Newcastle",
      "car removal Newcastle",
      "sell my car Newcastle",
      "car wreckers Newcastle",
      "scrap car removal Newcastle NSW",
      "we buy cars Newcastle",
      "damaged car buyers Newcastle",
    ],
    h1: "Cash for Cars in Newcastle: Free Removal, Fast Cash Offer",
    intro:
      "Selling a car in Newcastle should not take weeks. Whether your car is running, damaged, unregistered or just taking up space, Australia Wide Wreckers will give you a cash offer, collect the vehicle for free and pay you on pick-up. We buy cars, utes, vans, 4x4s, light trucks and motorbikes in any condition.",
    suburbs: [
      "Mayfield",
      "Hamilton",
      "Wallsend",
      "Waratah",
      "Islington",
      "Stockton",
      "Merewether",
      "Kotara",
      "Lambton",
      "Georgetown",
      "Sandgate",
      "Elermore Vale",
      "Adamstown Heights",
      "Fletcher",
    ],
    localNote: {
      heading: "Tow trucks that fit Newcastle streets",
      text: "From narrow inner-city streets in Hamilton and Merewether to apartment car parks and industrial yards in Mayfield and Sandgate, our crews collect vehicles from tight spots without fuss. We also pick up from roadsides and workplaces.",
    },
    pickup:
      "Most Newcastle pick-ups can be arranged the same day or the next day. Call or request a quote and tell us the suburb and the best time.",
    depot:
      "Newcastle jobs are covered from our Morisset and Muswellbrook depots, so your vehicle is moved quickly.",
    faqs: [
      {
        question: "How much cash can I get for my car in Newcastle?",
        answer:
          "The offer depends on the make, model, year, condition and the value of the parts and metal. We give a free no-obligation quote and confirm the final price when we inspect the vehicle.",
      },
      {
        question: "Do you buy damaged or non-running cars in Newcastle?",
        answer:
          "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles across Newcastle.",
      },
      {
        question: "Is car removal in Newcastle free?",
        answer:
          "Yes. Towing is free in our service area, including Newcastle and its suburbs, with no callout fee.",
      },
      {
        question: "Which Newcastle suburbs do you service?",
        answer:
          "Including Mayfield, Hamilton, Wallsend, Waratah, Islington, Stockton, Merewether, Kotara and Lambton. If your suburb is not listed, call us and we will confirm.",
      },
    ],
    nearby: ["lake-macquarie", "maitland", "central-coast"],
    locationHref: "/locations#newcastle",
    geo: { lat: -32.9283, lng: 151.7817 },
  },
  {
    slug: "lake-macquarie",
    name: "Lake Macquarie",
    area: "Lake Macquarie",
    metaTitle: "Cash for Cars Lake Macquarie | Car Removal Charlestown, Belmont, Morisset",
    description:
      "Cash for cars in Lake Macquarie NSW. We buy and remove cars, utes, vans and bikes in Charlestown, Belmont, Swansea, Cardiff, Warners Bay, Morisset and more. Free towing.",
    keywords: [
      "cash for cars Lake Macquarie",
      "car removal Lake Macquarie",
      "cash for cars Charlestown",
      "cash for cars Belmont",
      "car wreckers Morisset",
      "scrap car removal Lake Macquarie",
      "sell my car Swansea NSW",
    ],
    h1: "Cash for Cars in Lake Macquarie: Free Pick-Up, Cash on the Spot",
    intro:
      "Lake Macquarie owners have a local option for selling an unwanted car. We buy vehicles in any condition around the lake, collect them for free and pay on pick-up. Our M1 Car Removal depot is in Morisset, so Lake Macquarie jobs are close to base.",
    suburbs: [
      "Charlestown",
      "Belmont",
      "Belmont North",
      "Swansea",
      "Cardiff",
      "Glendale",
      "Cameron Park",
      "Edgeworth",
      "Warners Bay",
      "Morisset",
    ],
    localNote: {
      heading: "A depot on your doorstep in Morisset",
      text: "Our Morisset depot at 139 Moira Park Rd means short tow distances for suburbs around the lake. That is quicker pick-ups for you and less time with an old car in the driveway.",
    },
    pickup:
      "We aim for same-day or next-day pick-up across Lake Macquarie. Tell us your suburb when you get a quote.",
    depot: "M1 Car Removal, 139 Moira Park Rd, Morisset NSW 2264.",
    faqs: [
      {
        question: "Do you buy cars in Charlestown, Belmont and Swansea?",
        answer:
          "Yes. We service Charlestown, Belmont, Swansea, Cardiff, Warners Bay, Cameron Park, Edgeworth, Glendale and Morisset.",
      },
      {
        question: "Where is your Lake Macquarie depot?",
        answer:
          "Our Morisset depot is at 139 Moira Park Rd, Morisset NSW 2264.",
      },
      {
        question: "Can you collect an unregistered car in Lake Macquarie?",
        answer:
          "Yes. We tow unregistered and non-running vehicles. Have your ID and ownership papers ready.",
      },
      {
        question: "Do you charge for removal around Lake Macquarie?",
        answer:
          "No. Removal is free within our service area.",
      },
    ],
    nearby: ["newcastle", "central-coast", "maitland"],
    locationHref: "/locations#lake-macquarie",
    geo: { lat: -33.0, lng: 151.6 },
  },
  {
    slug: "maitland",
    name: "Maitland",
    area: "Maitland and the Lower Hunter",
    metaTitle: "Cash for Cars Maitland NSW | Free Removal, Top Cash Offers",
    description:
      "Sell your car for cash in Maitland NSW. We buy cars, utes, vans, trucks and motorbikes in any condition and tow them away for free. Get a fast cash offer.",
    keywords: [
      "cash for cars Maitland",
      "car removal Maitland NSW",
      "sell my car Maitland",
      "car wreckers Maitland",
      "cash for cars Thornton",
      "cash for cars Branxton",
      "scrap car removal Maitland",
    ],
    h1: "Cash for Cars in Maitland: We Buy and Remove Any Vehicle",
    intro:
      "If you have an old, damaged or unwanted vehicle in Maitland, we will buy it. Australia Wide Wreckers gives free quotes, collects for free and pays cash. We cover Maitland, Thornton, Maitland Vale, Branxton, Greta and the surrounding Lower Hunter.",
    suburbs: ["Maitland", "Maitland Vale", "Thornton", "Branxton", "Greta", "Kurri Kurri"],
    localNote: {
      heading: "Utes, work vehicles and farm cars welcome",
      text: "The Lower Hunter has plenty of work utes, farm vehicles and family cars that have reached the end of the road. We collect from homes, farms, yards and roadsides and deal with all types, running or not.",
    },
    pickup:
      "Maitland pick-ups are usually same-day or next-day. Tell us the location and access details when you request a quote.",
    depot:
      "Maitland jobs are covered from our Muswellbrook and Morisset depots.",
    faqs: [
      {
        question: "Do you buy cars in Maitland and Thornton?",
        answer:
          "Yes. We service Maitland, Thornton, Maitland Vale, Branxton, Greta and nearby suburbs.",
      },
      {
        question: "Can I sell a ute or work vehicle in Maitland?",
        answer:
          "Yes. We buy utes, vans, 4x4s and light trucks in any condition.",
      },
      {
        question: "How fast can you collect my car in Maitland?",
        answer:
          "Often the same day or the next day. We confirm the time when you request a quote.",
      },
      {
        question: "Is there a fee for removal?",
        answer: "No. Towing is free in our service area.",
      },
    ],
    nearby: ["newcastle", "muswellbrook", "lake-macquarie"],
    locationHref: "/locations/maitland",
    geo: { lat: -32.7333, lng: 151.55 },
  },
  {
    slug: "muswellbrook",
    name: "Muswellbrook",
    area: "Muswellbrook and the Upper Hunter",
    metaTitle: "Cash for Cars Muswellbrook | Upper Hunter Car Removal & Wreckers",
    description:
      "Cash for cars in Muswellbrook and the Upper Hunter. Visit our depot at 9 Common Rd or get free pick-up. We buy cars, utes, vans, trucks and bikes in any condition.",
    keywords: [
      "cash for cars Muswellbrook",
      "car wreckers Muswellbrook",
      "car removal Upper Hunter",
      "sell my car Muswellbrook",
      "cash for cars Singleton",
      "scrap car removal Muswellbrook",
      "9 Common Rd Muswellbrook",
    ],
    h1: "Cash for Cars in Muswellbrook and the Upper Hunter",
    intro:
      "Our main depot is in Muswellbrook, so we are a genuinely local buyer for the Upper Hunter. Sell your car, ute, van or truck for cash, with free pick-up or drop it at our depot. We buy vehicles in any condition.",
    suburbs: ["Muswellbrook", "Singleton", "Denman", "Scone", "Aberdeen", "Branxton", "Greta"],
    localNote: {
      heading: "Visit the depot or we come to you",
      text: "You can bring your vehicle to our depot at 9 Common Rd, Muswellbrook NSW 2333, or we can collect from your property, farm or workplace. Call ahead so we can confirm the time and the details.",
    },
    pickup:
      "Upper Hunter pick-ups are arranged by phone. Call us with the location and vehicle details and we will confirm timing.",
    depot: "Australia Wide Wreckers, 9 Common Rd, Muswellbrook NSW 2333.",
    faqs: [
      {
        question: "Where is your Muswellbrook depot?",
        answer:
          "9 Common Rd, Muswellbrook NSW 2333. Please call before visiting.",
      },
      {
        question: "Do you buy cars in Singleton and the Upper Hunter?",
        answer:
          "Yes. We service Singleton, Muswellbrook and surrounding Upper Hunter areas. Call us to confirm your location.",
      },
      {
        question: "Can I drop my car at the depot?",
        answer:
          "Yes, you can bring it to the depot, or we can collect it for free in our service area.",
      },
      {
        question: "Do you take farm vehicles and work utes?",
        answer:
          "Yes. We buy utes, 4x4s, vans and light trucks in any condition.",
      },
    ],
    nearby: ["maitland", "newcastle", "lake-macquarie"],
    locationHref: "/locations/muswellbrook",
    geo: { lat: -32.2667, lng: 150.8833 },
  },
  {
    slug: "central-coast",
    name: "Central Coast",
    area: "the Central Coast",
    metaTitle: "Cash for Cars Central Coast NSW | Free Car Removal Gosford, Wyong",
    description:
      "Cash for cars on the Central Coast NSW. We buy and remove cars, utes, vans and bikes in Gosford, Wyong, Woy Woy, The Entrance and more. Free towing, fast cash offer.",
    keywords: [
      "cash for cars Central Coast",
      "car removal Central Coast NSW",
      "cash for cars Gosford",
      "cash for cars Wyong",
      "scrap car removal Central Coast",
      "sell my car Central Coast",
      "car wreckers Central Coast",
    ],
    h1: "Cash for Cars on the Central Coast: Free Removal, Fast Offers",
    intro:
      "Got an unwanted car on the Central Coast? We buy vehicles in any condition, running or not, and arrange free pick-up. Request a quote online or call us, and we will confirm a cash offer and a pick-up time for your suburb.",
    suburbs: ["Gosford", "Wyong", "Woy Woy", "Umina Beach", "The Entrance", "Terrigal", "Erina", "Tuggerah"],
    localNote: {
      heading: "Confirm pick-up for your suburb",
      text: "The Central Coast is at the southern edge of our service area. Call or use the quote form and we will confirm pick-up timing for your suburb before you commit to anything.",
    },
    pickup:
      "Timing depends on your suburb. Call us and we will confirm.",
    depot: "Central Coast jobs are coordinated from our Morisset depot.",
    faqs: [
      {
        question: "Do you buy cars on the Central Coast?",
        answer:
          "Yes. We offer free removal and cash offers on the Central Coast. Call us to confirm pick-up for your suburb.",
      },
      {
        question: "Can you collect from Gosford, Wyong or Woy Woy?",
        answer:
          "Yes, we service the Central Coast. Tell us your suburb and we will confirm timing.",
      },
      {
        question: "Do you buy damaged cars on the Central Coast?",
        answer:
          "Yes. We buy damaged, non-running and unregistered cars, utes, vans and motorbikes.",
      },
      {
        question: "Is towing free on the Central Coast?",
        answer:
          "Yes, towing is free in our service area. We will confirm for your address when you request a quote.",
      },
    ],
    nearby: ["lake-macquarie", "newcastle", "maitland"],
    locationHref: "/locations#central-coast",
    geo: { lat: -33.3, lng: 151.35 },
  },
  {
    "slug": "gosford",
    "name": "Gosford",
    "area": "Gosford and the Central Coast",
    "metaTitle": "Cash for Cars Gosford NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Gosford NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Gosford",
      "car removal Gosford",
      "sell my car Gosford",
      "car wreckers Gosford",
      "scrap car removal Gosford",
      "we buy cars Gosford NSW",
      "damaged car buyers Gosford"
    ],
    "h1": "Cash for Cars in Gosford: Free Removal, Fast Cash Offer",
    "intro": "Gosford is the Central Coast's regional hub, and plenty of cars, utes and work vehicles reach the end of the road here. We make a free cash offer on vehicles in any condition around Gosford, collect them at no cost and pay on pick-up.",
    "suburbs": [
      "Gosford",
      "East Gosford",
      "West Gosford",
      "Point Clare",
      "Narara",
      "Niagara Park",
      "Springfield",
      "Erina",
      "Kariong"
    ],
    "localNote": {
      "heading": "Pick-up from Gosford homes, units and work sites",
      "text": "Whether your car is in a driveway in Narara, a unit car park near the Gosford CBD or a yard in West Gosford, tell us the access details and we will send the right truck. We also collect from the roadside."
    },
    "pickup": "Tell us your Gosford address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Gosford jobs are coordinated from our Morisset depot. Call to confirm timing for your address.",
    "faqs": [
      {
        "question": "Do you pay cash for cars in Gosford even if they are unregistered?",
        "answer": "Yes. We buy unregistered and non-running cars in Gosford. Have your photo ID and ownership papers ready and we will tell you what else we need."
      },
      {
        "question": "How much can I get for my car in Gosford?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Gosford free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Gosford?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "terrigal",
      "woy-woy",
      "wyong"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -33.4269,
      "lng": 151.3428
    }
  },
  {
    "slug": "wyong",
    "name": "Wyong",
    "area": "Wyong and the northern Central Coast",
    "metaTitle": "Cash for Cars Wyong NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Wyong NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Wyong",
      "car removal Wyong",
      "sell my car Wyong",
      "car wreckers Wyong",
      "scrap car removal Wyong",
      "we buy cars Wyong NSW",
      "damaged car buyers Wyong"
    ],
    "h1": "Cash for Cars in Wyong: Free Removal, Fast Cash Offer",
    "intro": "Selling a car in Wyong and the northern Central Coast is simple with us. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow them away for free and pay on pick-up.",
    "suburbs": [
      "Wyong",
      "Tuggerah",
      "Warnervale",
      "Wadalba",
      "Hamlyn Terrace",
      "Lake Haven",
      "Kanwal",
      "Charmhaven",
      "Gorokan"
    ],
    "localNote": {
      "heading": "Covering the northern Central Coast",
      "text": "From Tuggerah and Warnervale to Lake Haven and Gorokan, we collect vehicles from homes, workplaces and roadsides. Give us your suburb and we will confirm pick-up timing."
    },
    "pickup": "Tell us your Wyong address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Wyong jobs are coordinated from our Morisset depot, which is the closest to the northern Central Coast.",
    "faqs": [
      {
        "question": "Can you collect a car from Tuggerah or Warnervale?",
        "answer": "Yes. We service Tuggerah, Warnervale, Wadalba, Hamlyn Terrace, Lake Haven and surrounding suburbs. Call us to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Wyong?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Wyong free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Wyong?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "the-entrance",
      "gosford",
      "lake-macquarie"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -33.2833,
      "lng": 151.4167
    }
  },
  {
    "slug": "woy-woy",
    "name": "Woy Woy",
    "area": "Woy Woy and the Peninsula",
    "metaTitle": "Cash for Cars Woy Woy NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Woy Woy NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Woy Woy",
      "car removal Woy Woy",
      "sell my car Woy Woy",
      "car wreckers Woy Woy",
      "scrap car removal Woy Woy",
      "we buy cars Woy Woy NSW",
      "damaged car buyers Woy Woy"
    ],
    "h1": "Cash for Cars in Woy Woy: Free Removal, Fast Cash Offer",
    "intro": "Woy Woy and the Peninsula have a lot of older cars, boat-tow vehicles and daily drivers that outlast their usefulness. We will buy your vehicle for cash, whatever its condition, and tow it away free.",
    "suburbs": [
      "Woy Woy",
      "Umina Beach",
      "Ettalong Beach",
      "Booker Bay",
      "Blackwall",
      "Empire Bay",
      "Kincumber",
      "Pretty Beach",
      "Patonga"
    ],
    "localNote": {
      "heading": "Peninsula pick-ups",
      "text": "Salt air and coastal living are hard on cars. We regularly buy vehicles with rust, worn paint and high kilometres from Woy Woy, Umina Beach and Ettalong Beach, and we know how to handle tight coastal streets."
    },
    "pickup": "Tell us your Woy Woy address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Peninsula jobs are coordinated from our Morisset depot. Call for timing.",
    "faqs": [
      {
        "question": "Do you buy rusty or sun-damaged cars in Woy Woy?",
        "answer": "Yes. Rust, faded paint and age all affect the offer but do not stop us buying. We give a free no-obligation quote and confirm the price on inspection."
      },
      {
        "question": "How much can I get for my car in Woy Woy?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Woy Woy free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Woy Woy?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "gosford",
      "terrigal",
      "the-entrance"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -33.49,
      "lng": 151.32
    }
  },
  {
    "slug": "the-entrance",
    "name": "The Entrance",
    "area": "The Entrance and the Tuggerah Lakes area",
    "metaTitle": "Cash for Cars The Entrance NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in The Entrance NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars The Entrance",
      "car removal The Entrance",
      "sell my car The Entrance",
      "car wreckers The Entrance",
      "scrap car removal The Entrance",
      "we buy cars The Entrance NSW",
      "damaged car buyers The Entrance"
    ],
    "h1": "Cash for Cars in The Entrance: Free Removal, Fast Cash Offer",
    "intro": "Got an unwanted car near The Entrance or around Tuggerah Lake? We buy vehicles in any condition, collect them for free and pay on pick-up. Running or not, we will make you an offer.",
    "suburbs": [
      "The Entrance",
      "The Entrance North",
      "Long Jetty",
      "Toukley",
      "Bateau Bay",
      "Killarney Vale",
      "Shelly Beach",
      "Wamberal",
      "Magenta"
    ],
    "localNote": {
      "heading": "Lakeside and coastal suburbs",
      "text": "Between the lake and the ocean, the area has many older cars and holiday vehicles. We collect from homes, units, caravan parks and roadsides. Tell us where it is parked and we will plan the pick-up."
    },
    "pickup": "Tell us your The Entrance address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "The Entrance jobs are coordinated from our Morisset depot. Call for timing.",
    "faqs": [
      {
        "question": "Do you collect from Long Jetty, Toukley and Bateau Bay?",
        "answer": "Yes. We service The Entrance, Long Jetty, Toukley, Bateau Bay, Killarney Vale and nearby suburbs. Call us to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in The Entrance?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in The Entrance free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in The Entrance?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "wyong",
      "terrigal",
      "gosford"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -33.3439,
      "lng": 151.4958
    }
  },
  {
    "slug": "terrigal",
    "name": "Terrigal",
    "area": "Terrigal and the Central Coast beaches",
    "metaTitle": "Cash for Cars Terrigal NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Terrigal NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Terrigal",
      "car removal Terrigal",
      "sell my car Terrigal",
      "car wreckers Terrigal",
      "scrap car removal Terrigal",
      "we buy cars Terrigal NSW",
      "damaged car buyers Terrigal"
    ],
    "h1": "Cash for Cars in Terrigal: Free Removal, Fast Cash Offer",
    "intro": "Terrigal, Avoca Beach and the surrounding coastal suburbs are covered by our free car removal service. We buy cars, utes, vans and motorbikes in any condition and pay on pick-up.",
    "suburbs": [
      "Terrigal",
      "Avoca Beach",
      "Wamberal",
      "Erina",
      "Kincumber",
      "Green Point",
      "Copacabana",
      "MacMasters Beach",
      "Saratoga"
    ],
    "localNote": {
      "heading": "Coastal suburbs, simple pick-up",
      "text": "Many coastal streets are steep or narrow. Tell us about access when you request a quote and we will arrange the right tow truck so your car is collected without any fuss."
    },
    "pickup": "Tell us your Terrigal address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Terrigal jobs are coordinated from our Morisset depot. Call for timing.",
    "faqs": [
      {
        "question": "Can you collect from Avoca Beach and Wamberal?",
        "answer": "Yes. We service Avoca Beach, Wamberal, Erina, Kincumber, Green Point and nearby suburbs. Call us to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Terrigal?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Terrigal free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Terrigal?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "gosford",
      "the-entrance",
      "woy-woy"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -33.4486,
      "lng": 151.4439
    }
  },
  {
    "slug": "toronto",
    "name": "Toronto",
    "area": "Toronto and western Lake Macquarie",
    "metaTitle": "Cash for Cars Toronto NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Toronto NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Toronto",
      "car removal Toronto",
      "sell my car Toronto",
      "car wreckers Toronto",
      "scrap car removal Toronto",
      "we buy cars Toronto NSW",
      "damaged car buyers Toronto"
    ],
    "h1": "Cash for Cars in Toronto: Free Removal, Fast Cash Offer",
    "intro": "Toronto and the western shore of Lake Macquarie are close to our Morisset depot, so we can usually collect quickly. We buy cars, utes, vans and bikes in any condition and pay cash on pick-up.",
    "suburbs": [
      "Toronto",
      "Fassifern",
      "Blackalls Park",
      "Awaba",
      "Teralba",
      "Booragul",
      "Rathmines",
      "Fennell Bay",
      "Coal Point"
    ],
    "localNote": {
      "heading": "Close to our Morisset depot",
      "text": "Because Toronto, Fassifern and Awaba are near Morisset, tow distances are short. That often means faster pick-up and less time with an unwanted car in your driveway."
    },
    "pickup": "Tell us your Toronto address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Western Lake Macquarie jobs are handled from our Morisset depot at 139 Moira Park Rd.",
    "faqs": [
      {
        "question": "Is Toronto close to your depot?",
        "answer": "Yes. Our Morisset depot is nearby, which usually means quick pick-ups across Toronto, Fassifern, Blackalls Park, Awaba and Teralba."
      },
      {
        "question": "How much can I get for my car in Toronto?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Toronto free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Toronto?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "lake-macquarie",
      "newcastle",
      "wyong"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -33.0167,
      "lng": 151.5833
    }
  },
  {
    "slug": "dungog",
    "name": "Dungog",
    "area": "Dungog and the Dungog Shire",
    "metaTitle": "Cash for Cars Dungog NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Dungog NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Dungog",
      "car removal Dungog",
      "sell my car Dungog",
      "car wreckers Dungog",
      "scrap car removal Dungog",
      "we buy cars Dungog NSW",
      "damaged car buyers Dungog"
    ],
    "h1": "Cash for Cars in Dungog: Free Removal, Fast Cash Offer",
    "intro": "Rural vehicles pile up on properties around Dungog. We buy cars, utes, 4x4s, vans and light trucks in any condition from Dungog and the surrounding shire, with free pick-up and cash on collection.",
    "suburbs": [
      "Dungog",
      "Clarence Town",
      "Paterson",
      "Gresford",
      "Vacy",
      "Martins Creek",
      "Dungog Shire"
    ],
    "localNote": {
      "heading": "Farm and rural pick-ups",
      "text": "We collect from farms, paddocks, sheds and driveways, not just suburban streets. Tell us where the vehicle is, how to reach it and whether it is bogged or blocked in, and we will plan the right equipment."
    },
    "pickup": "Tell us your Dungog address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Dungog jobs are coordinated from our Muswellbrook and Morisset depots. Call to confirm timing.",
    "faqs": [
      {
        "question": "Will you collect a car from a paddock near Dungog?",
        "answer": "Yes. We collect from paddocks, farms and sheds across our service area. Describe the access and condition when you call and we will confirm."
      },
      {
        "question": "How much can I get for my car in Dungog?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Dungog free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Dungog?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "maitland",
      "muswellbrook",
      "newcastle"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -32.4,
      "lng": 151.75
    }
  },
  {
    "slug": "scone",
    "name": "Scone",
    "area": "Scone and the Upper Hunter",
    "metaTitle": "Cash for Cars Scone NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Scone NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Scone",
      "car removal Scone",
      "sell my car Scone",
      "car wreckers Scone",
      "scrap car removal Scone",
      "we buy cars Scone NSW",
      "damaged car buyers Scone"
    ],
    "h1": "Cash for Cars in Scone: Free Removal, Fast Cash Offer",
    "intro": "Scone and the Upper Hunter are close to our Muswellbrook depot. Sell a car, ute, 4x4, van or truck for cash, with free collection from town, farm or property.",
    "suburbs": [
      "Scone",
      "Aberdeen",
      "Murrurundi",
      "Wingen",
      "Parkville",
      "Gundy",
      "Moonan Flat"
    ],
    "localNote": {
      "heading": "Upper Hunter, close to our Muswellbrook depot",
      "text": "Scone is a short drive up the New England Highway from our Muswellbrook depot. We collect from town houses, rural properties and work yards, and you can also drop a vehicle at the depot if that suits."
    },
    "pickup": "Tell us your Scone address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Scone jobs are handled from our Muswellbrook depot at 9 Common Rd.",
    "faqs": [
      {
        "question": "Do you buy farm utes and work vehicles around Scone?",
        "answer": "Yes. We buy utes, 4x4s, vans and light trucks in any condition. Call us with the vehicle details and the location."
      },
      {
        "question": "How much can I get for my car in Scone?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Scone free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Scone?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "muswellbrook",
      "singleton",
      "maitland"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -32.05,
      "lng": 150.8667
    }
  },
  {
    "slug": "cessnock",
    "name": "Cessnock",
    "area": "Cessnock and the Hunter Vineyards district",
    "metaTitle": "Cash for Cars Cessnock NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Cessnock NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Cessnock",
      "car removal Cessnock",
      "sell my car Cessnock",
      "car wreckers Cessnock",
      "scrap car removal Cessnock",
      "we buy cars Cessnock NSW",
      "damaged car buyers Cessnock"
    ],
    "h1": "Cash for Cars in Cessnock: Free Removal, Fast Cash Offer",
    "intro": "In Cessnock and the Hunter Vineyards district we buy cars, utes, vans, 4x4s and motorbikes in any condition. Get a free cash offer, free towing and payment on pick-up.",
    "suburbs": [
      "Cessnock",
      "Kurri Kurri",
      "Weston",
      "Abermain",
      "Bellbird",
      "Pokolbin",
      "Branxton",
      "Greta",
      "Rothbury"
    ],
    "localNote": {
      "heading": "Cessnock, Kurri Kurri and the vineyards",
      "text": "From Kurri Kurri and Abermain to Pokolbin and Branxton, we collect from homes, farms, wineries and roadsides. Let us know about access and we will plan the pick-up."
    },
    "pickup": "Tell us your Cessnock address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Cessnock jobs are coordinated from our Muswellbrook and Morisset depots. Call to confirm timing.",
    "faqs": [
      {
        "question": "Do you service Kurri Kurri and Pokolbin?",
        "answer": "Yes. We service Cessnock, Kurri Kurri, Abermain, Weston, Pokolbin, Branxton and nearby areas. Call to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Cessnock?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Cessnock free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Cessnock?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "maitland",
      "newcastle",
      "lake-macquarie"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -32.8333,
      "lng": 151.35
    }
  },
  {
    "slug": "singleton",
    "name": "Singleton",
    "area": "Singleton and the Upper Hunter",
    "metaTitle": "Cash for Cars Singleton NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Singleton NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Singleton",
      "car removal Singleton",
      "sell my car Singleton",
      "car wreckers Singleton",
      "scrap car removal Singleton",
      "we buy cars Singleton NSW",
      "damaged car buyers Singleton"
    ],
    "h1": "Cash for Cars in Singleton: Free Removal, Fast Cash Offer",
    "intro": "Singleton sits between the Lower and Upper Hunter, a short drive from our Muswellbrook depot. We buy cars, utes, vans, trucks and 4x4s in any condition, collect for free and pay on pick-up.",
    "suburbs": [
      "Singleton",
      "Singleton Heights",
      "Branxton",
      "Broke",
      "Jerrys Plains",
      "Mount Thorley",
      "Muswellbrook"
    ],
    "localNote": {
      "heading": "Singleton, with depot support at Muswellbrook",
      "text": "Many work utes, mining-region vehicles and family cars pass through the area. We collect from homes, work sites and rural properties, and we can arrange pick-up around shift work if you tell us the best time."
    },
    "pickup": "Tell us your Singleton address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Singleton jobs are handled from our Muswellbrook depot at 9 Common Rd.",
    "faqs": [
      {
        "question": "Can you work around shift hours for pick-up in Singleton?",
        "answer": "We will do our best. Tell us your preferred time when you call and we will confirm what is possible."
      },
      {
        "question": "How much can I get for my car in Singleton?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Singleton free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Singleton?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "muswellbrook",
      "scone",
      "maitland"
    ],
    "locationHref": "/locations",
    "geo": {
      "lat": -32.5667,
      "lng": 151.1667
    }
  }
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
