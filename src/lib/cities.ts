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
,
  {
    "slug": "port-stephens",
    "name": "Port Stephens",
    "area": "Port Stephens",
    "metaTitle": "Cash for Cars Port Stephens NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Port Stephens NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Port Stephens",
      "car removal Port Stephens",
      "sell my car Port Stephens",
      "car wreckers Port Stephens",
      "scrap car removal Port Stephens",
      "we buy cars Port Stephens NSW",
      "damaged car buyers Port Stephens"
    ],
    "h1": "Cash for Cars in Port Stephens: Free Removal, Fast Cash Offer",
    "intro": "Port Stephens owners can sell an unwanted car without driving it anywhere. We buy cars, utes, vans, 4x4s, boat-tow vehicles and motorbikes in any condition across the Port Stephens coastline, tow them for free and pay on pick-up.",
    "suburbs": [
      "Raymond Terrace",
      "Medowie",
      "Karuah",
      "Nelson Bay",
      "Anna Bay",
      "Tanilba Bay",
      "Salamander Bay",
      "Corlette",
      "Fingal Bay",
      "Tea Gardens"
    ],
    "localNote": {
      "heading": "From Raymond Terrace to Tea Gardens",
      "text": "Port Stephens covers a long stretch of coast and bush. Tell us your suburb and the access details, and we will confirm the pick-up. We collect from homes, caravan parks, holiday houses and roadsides."
    },
    "pickup": "Tell us your Port Stephens address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Port Stephens jobs are coordinated from our Morisset depot. Call to confirm timing for your suburb.",
    "faqs": [
      {
        "question": "Do you service all of Port Stephens, including Tea Gardens?",
        "answer": "We service Port Stephens suburbs including Raymond Terrace, Medowie, Karuah, Nelson Bay, Anna Bay, Tanilba Bay and Tea Gardens. Call to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Port Stephens?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Port Stephens free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Port Stephens?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "raymond-terrace",
      "nelson-bay",
      "newcastle"
    ],
    "locationHref": "/locations#port-stephens",
    "geo": {
      "lat": -32.7167,
      "lng": 152.0667
    }
  },
  {
    "slug": "raymond-terrace",
    "name": "Raymond Terrace",
    "area": "Raymond Terrace and the Williams River area",
    "metaTitle": "Cash for Cars Raymond Terrace NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Raymond Terrace NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Raymond Terrace",
      "car removal Raymond Terrace",
      "sell my car Raymond Terrace",
      "car wreckers Raymond Terrace",
      "scrap car removal Raymond Terrace",
      "we buy cars Raymond Terrace NSW",
      "damaged car buyers Raymond Terrace"
    ],
    "h1": "Cash for Cars in Raymond Terrace: Free Removal, Fast Cash Offer",
    "intro": "Raymond Terrace sits at the gateway between Newcastle and Port Stephens. We buy cars, utes and work vehicles in any condition around Raymond Terrace, tow them away for free and pay on pick-up.",
    "suburbs": [
      "Raymond Terrace",
      "Medowie",
      "Heatherbrae",
      "Williamtown",
      "Seahampton",
      "Millers Forest",
      "Woodville",
      "Karuah"
    ],
    "localNote": {
      "heading": "Gateway to Port Stephens",
      "text": "From Medowie and Williamtown to Heatherbrae and Karuah, we collect from homes, rural properties, work yards and roadsides. We can usually plan a pick-up around your schedule."
    },
    "pickup": "Tell us your Raymond Terrace address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Raymond Terrace jobs are coordinated from our Morisset depot. Call to confirm timing.",
    "faqs": [
      {
        "question": "Can you collect a car from Medowie or Williamtown?",
        "answer": "Yes. We service Raymond Terrace, Medowie, Williamtown, Heatherbrae and nearby areas. Call us to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Raymond Terrace?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Raymond Terrace free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Raymond Terrace?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "port-stephens",
      "newcastle",
      "maitland"
    ],
    "locationHref": "/locations/raymond-terrace",
    "geo": {
      "lat": -32.7667,
      "lng": 151.7467
    }
  },
  {
    "slug": "nelson-bay",
    "name": "Nelson Bay",
    "area": "Nelson Bay and the Tomaree Peninsula",
    "metaTitle": "Cash for Cars Nelson Bay NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Nelson Bay NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Nelson Bay",
      "car removal Nelson Bay",
      "sell my car Nelson Bay",
      "car wreckers Nelson Bay",
      "scrap car removal Nelson Bay",
      "we buy cars Nelson Bay NSW",
      "damaged car buyers Nelson Bay"
    ],
    "h1": "Cash for Cars in Nelson Bay: Free Removal, Fast Cash Offer",
    "intro": "Nelson Bay and the Tomaree Peninsula have plenty of holiday cars, boat-tow vehicles and older daily drivers. We buy vehicles in any condition, collect them for free and pay on pick-up.",
    "suburbs": [
      "Nelson Bay",
      "Salamander Bay",
      "Soldiers Point",
      "Corlette",
      "Shoal Bay",
      "Fingal Bay",
      "Anna Bay",
      "Boat Harbour"
    ],
    "localNote": {
      "heading": "Peninsula pick-ups, any condition",
      "text": "Coastal living is hard on cars: salt, sun and rust all take their toll. We buy rusty, faded and high-kilometre vehicles in Nelson Bay, Shoal Bay, Fingal Bay and Salamander Bay, and we plan the pick-up around narrow streets and steep driveways."
    },
    "pickup": "Tell us your Nelson Bay address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Nelson Bay jobs are coordinated from our Morisset depot. Call to confirm timing.",
    "faqs": [
      {
        "question": "Do you buy rusty or sun-damaged cars in Nelson Bay?",
        "answer": "Yes. Rust, faded paint and age affect the offer but do not stop us buying. We give a free no-obligation quote and confirm the price on inspection."
      },
      {
        "question": "How much can I get for my car in Nelson Bay?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Nelson Bay free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Nelson Bay?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "port-stephens",
      "raymond-terrace",
      "newcastle"
    ],
    "locationHref": "/locations/nelson-bay",
    "geo": {
      "lat": -32.7167,
      "lng": 152.15
    }
  },
  {
    "slug": "charlestown",
    "name": "Charlestown",
    "area": "Charlestown and the Lake Macquarie northern suburbs",
    "metaTitle": "Cash for Cars Charlestown NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Charlestown NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Charlestown",
      "car removal Charlestown",
      "sell my car Charlestown",
      "car wreckers Charlestown",
      "scrap car removal Charlestown",
      "we buy cars Charlestown NSW",
      "damaged car buyers Charlestown"
    ],
    "h1": "Cash for Cars in Charlestown: Free Removal, Fast Cash Offer",
    "intro": "Charlestown is one of Lake Macquarie's busiest hubs. We buy cars, utes, vans and bikes in any condition around Charlestown and the northern suburbs, tow for free and pay cash on pick-up.",
    "suburbs": [
      "Charlestown",
      "Kotara",
      "Dudley",
      "Whitebridge",
      "Gateshead",
      "Windale",
      "Tingira Heights",
      "Jewells",
      "Redhead"
    ],
    "localNote": {
      "heading": "Close to Charlestown, Gateshead and Kotara",
      "text": "Between the shops, the highway and the suburbs, there are always cars that have reached the end of the line. We collect from houses, units and car parks in Charlestown, Gateshead, Whitebridge and Dudley."
    },
    "pickup": "Tell us your Charlestown address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Charlestown jobs are coordinated from our Morisset depot. Call to confirm timing.",
    "faqs": [
      {
        "question": "Do you pick up from units and apartment car parks in Charlestown?",
        "answer": "Yes. Tell us about access when you call or request a quote, and we will send the right tow truck."
      },
      {
        "question": "How much can I get for my car in Charlestown?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Charlestown free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Charlestown?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "warners-bay",
      "newcastle",
      "belmont"
    ],
    "locationHref": "/locations/charlestown",
    "geo": {
      "lat": -32.9667,
      "lng": 151.6928
    }
  },
  {
    "slug": "belmont",
    "name": "Belmont",
    "area": "Belmont and the Lake Macquarie lakeside",
    "metaTitle": "Cash for Cars Belmont NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Belmont NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Belmont",
      "car removal Belmont",
      "sell my car Belmont",
      "car wreckers Belmont",
      "scrap car removal Belmont",
      "we buy cars Belmont NSW",
      "damaged car buyers Belmont"
    ],
    "h1": "Cash for Cars in Belmont: Free Removal, Fast Cash Offer",
    "intro": "Belmont and the lakeside suburbs are covered by our free car removal service. We buy cars, utes, vans and motorbikes in any condition and pay cash when we collect.",
    "suburbs": [
      "Belmont",
      "Belmont North",
      "Belmont South",
      "Jewells",
      "Floraville",
      "Croudace Bay",
      "Valentine",
      "Eleebana"
    ],
    "localNote": {
      "heading": "Belmont, Croudace Bay and the lake",
      "text": "We collect from driveways, boat ramps, units and roadsides around Belmont and the southern lake. Give us the address and the best time and we will confirm."
    },
    "pickup": "Tell us your Belmont address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Belmont jobs are coordinated from our Morisset depot. Call to confirm timing.",
    "faqs": [
      {
        "question": "Can you collect a car from Belmont North or Croudace Bay?",
        "answer": "Yes. We service Belmont, Belmont North, Croudace Bay, Jewells and nearby suburbs. Call us to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Belmont?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Belmont free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Belmont?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "swansea",
      "charlestown",
      "lake-macquarie"
    ],
    "locationHref": "/locations/belmont",
    "geo": {
      "lat": -33.0333,
      "lng": 151.6667
    }
  },
  {
    "slug": "morisset",
    "name": "Morisset",
    "area": "Morisset and the southern Lake Macquarie area",
    "metaTitle": "Cash for Cars Morisset NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Morisset NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Morisset",
      "car removal Morisset",
      "sell my car Morisset",
      "car wreckers Morisset",
      "scrap car removal Morisset",
      "we buy cars Morisset NSW",
      "damaged car buyers Morisset"
    ],
    "h1": "Cash for Cars in Morisset: Free Removal, Fast Cash Offer",
    "intro": "Our M1 Car Removal depot is in Morisset, so we are a truly local buyer. Sell your car, ute, van, truck or motorbike in any condition for cash, with free pick-up or drop it at the depot.",
    "suburbs": [
      "Morisset",
      "Morisset Park",
      "Cooranbong",
      "Dora Creek",
      "Wyee",
      "Bonnells Bay",
      "Mandalong",
      "Brightwaters"
    ],
    "localNote": {
      "heading": "Visit our Morisset depot or we come to you",
      "text": "You can bring your vehicle to 139 Moira Park Rd, Morisset NSW 2264, or we can collect it from Morisset, Cooranbong, Dora Creek, Wyee and nearby areas. Please call first so we can confirm times."
    },
    "pickup": "Tell us your Morisset address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "M1 Car Removal, 139 Moira Park Rd, Morisset NSW 2264.",
    "faqs": [
      {
        "question": "Where is your Morisset depot?",
        "answer": "139 Moira Park Rd, Morisset NSW 2264. Please call before visiting."
      },
      {
        "question": "How much can I get for my car in Morisset?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Morisset free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Morisset?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "toronto",
      "lake-macquarie",
      "wyong"
    ],
    "locationHref": "/locations/morisset",
    "geo": {
      "lat": -33.1058,
      "lng": 151.4861
    }
  },
  {
    "slug": "kurri-kurri",
    "name": "Kurri Kurri",
    "area": "Kurri Kurri and the Cessnock district",
    "metaTitle": "Cash for Cars Kurri Kurri NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Kurri Kurri NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Kurri Kurri",
      "car removal Kurri Kurri",
      "sell my car Kurri Kurri",
      "car wreckers Kurri Kurri",
      "scrap car removal Kurri Kurri",
      "we buy cars Kurri Kurri NSW",
      "damaged car buyers Kurri Kurri"
    ],
    "h1": "Cash for Cars in Kurri Kurri: Free Removal, Fast Cash Offer",
    "intro": "Kurri Kurri and the surrounding district are home to work utes, family cars and older vehicles that have seen better days. We buy them in any condition, collect for free and pay on pick-up.",
    "suburbs": [
      "Kurri Kurri",
      "Weston",
      "Abermain",
      "Heddon Greta",
      "Pelaw Main",
      "Neath",
      "Bellbird",
      "Stanford Merthyr"
    ],
    "localNote": {
      "heading": "Kurri Kurri, Weston and Abermain",
      "text": "We collect from houses, sheds, farm blocks and roadsides throughout the district. Let us know about access and we will plan the pick-up."
    },
    "pickup": "Tell us your Kurri Kurri address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Kurri Kurri jobs are coordinated from our Morisset and Muswellbrook depots. Call to confirm timing.",
    "faqs": [
      {
        "question": "Do you service Weston, Abermain and Heddon Greta?",
        "answer": "Yes. We service Kurri Kurri, Weston, Abermain, Heddon Greta and nearby areas. Call us to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Kurri Kurri?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Kurri Kurri free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Kurri Kurri?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "cessnock",
      "maitland",
      "newcastle"
    ],
    "locationHref": "/locations/kurri-kurri",
    "geo": {
      "lat": -32.8167,
      "lng": 151.4833
    }
  },
  {
    "slug": "warners-bay",
    "name": "Warners Bay",
    "area": "Warners Bay and the eastern shore of Lake Macquarie",
    "metaTitle": "Cash for Cars Warners Bay NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Warners Bay NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Warners Bay",
      "car removal Warners Bay",
      "sell my car Warners Bay",
      "car wreckers Warners Bay",
      "scrap car removal Warners Bay",
      "we buy cars Warners Bay NSW",
      "damaged car buyers Warners Bay"
    ],
    "h1": "Cash for Cars in Warners Bay: Free Removal, Fast Cash Offer",
    "intro": "Warners Bay and the northern lakeside suburbs are on our service map. We buy cars, utes, vans and bikes in any condition, tow them for free and pay cash on pick-up.",
    "suburbs": [
      "Warners Bay",
      "Speers Point",
      "Boolaroo",
      "Teralba",
      "Eleebana",
      "Valentine",
      "Bolton Point",
      "Macquarie Hills"
    ],
    "localNote": {
      "heading": "The north-eastern shore of the lake",
      "text": "From Speers Point and Boolaroo to Eleebana and Valentine, we collect from homes, units and roadsides. If your vehicle is hard to reach, tell us and we will plan ahead."
    },
    "pickup": "Tell us your Warners Bay address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Warners Bay jobs are coordinated from our Morisset depot. Call to confirm timing.",
    "faqs": [
      {
        "question": "Do you pick up from Speers Point and Boolaroo?",
        "answer": "Yes. We service Warners Bay, Speers Point, Boolaroo, Teralba, Eleebana and nearby suburbs. Call us to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Warners Bay?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Warners Bay free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Warners Bay?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "charlestown",
      "toronto",
      "newcastle"
    ],
    "locationHref": "/locations/warners-bay",
    "geo": {
      "lat": -32.9667,
      "lng": 151.6333
    }
  },
  {
    "slug": "swansea",
    "name": "Swansea",
    "area": "Swansea and the southern Lake Macquarie coast",
    "metaTitle": "Cash for Cars Swansea NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Swansea NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Swansea",
      "car removal Swansea",
      "sell my car Swansea",
      "car wreckers Swansea",
      "scrap car removal Swansea",
      "we buy cars Swansea NSW",
      "damaged car buyers Swansea"
    ],
    "h1": "Cash for Cars in Swansea: Free Removal, Fast Cash Offer",
    "intro": "Swansea, Caves Beach and Blacksmiths have plenty of older cars, utes and holiday vehicles. We buy them in any condition, tow them away for free and pay on pick-up.",
    "suburbs": [
      "Swansea",
      "Swansea Heads",
      "Caves Beach",
      "Blacksmiths",
      "Pelican",
      "Dudley",
      "Catherine Hill Bay",
      "Murrays Beach"
    ],
    "localNote": {
      "heading": "Swansea, Caves Beach and Blacksmiths",
      "text": "We collect from homes, caravan parks, boat ramps and roadsides along the southern lake and coast. Tell us your street and we will confirm the pick-up."
    },
    "pickup": "Tell us your Swansea address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Swansea jobs are coordinated from our Morisset depot. Call to confirm timing.",
    "faqs": [
      {
        "question": "Can you collect from Caves Beach and Blacksmiths?",
        "answer": "Yes. We service Swansea, Caves Beach, Blacksmiths, Pelican and nearby suburbs. Call us to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Swansea?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Swansea free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Swansea?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "belmont",
      "charlestown",
      "lake-macquarie"
    ],
    "locationHref": "/locations/swansea",
    "geo": {
      "lat": -33.0833,
      "lng": 151.6333
    }
  },
  {
    "slug": "wallsend",
    "name": "Wallsend",
    "area": "Wallsend and the western Newcastle suburbs",
    "metaTitle": "Cash for Cars Wallsend NSW | Free Car Removal & Top Cash Offers",
    "description": "Sell your car for cash in Wallsend NSW. We buy cars, utes, vans, 4x4s and motorbikes in any condition, tow for free and pay on pick-up. Get a fast cash offer.",
    "keywords": [
      "cash for cars Wallsend",
      "car removal Wallsend",
      "sell my car Wallsend",
      "car wreckers Wallsend",
      "scrap car removal Wallsend",
      "we buy cars Wallsend NSW",
      "damaged car buyers Wallsend"
    ],
    "h1": "Cash for Cars in Wallsend: Free Removal, Fast Cash Offer",
    "intro": "Wallsend and the western Newcastle suburbs are well covered by our free car removal. We buy cars, utes, vans and motorbikes in any condition and pay cash on pick-up.",
    "suburbs": [
      "Wallsend",
      "Wallsend South",
      "Elermore Vale",
      "Maryland",
      "Fletcher",
      "Shortland",
      "Jesmond",
      "Minmi",
      "Birmingham Gardens"
    ],
    "localNote": {
      "heading": "Wallsend, Elermore Vale and Fletcher",
      "text": "We collect from houses, units and work yards in Wallsend, Maryland, Fletcher, Shortland and Jesmond. We can usually fit around your schedule."
    },
    "pickup": "Tell us your Wallsend address and the best time when you request a quote, and we will confirm pick-up. In many cases it can be the same day or the next day.",
    "depot": "Wallsend jobs are coordinated from our Morisset and Muswellbrook depots. Call to confirm timing.",
    "faqs": [
      {
        "question": "Do you service Maryland, Fletcher and Minmi?",
        "answer": "Yes. We service Wallsend, Maryland, Fletcher, Shortland, Jesmond, Minmi and nearby suburbs. Call us to confirm timing for your address."
      },
      {
        "question": "How much can I get for my car in Wallsend?",
        "answer": "The offer depends on the make, model, year, condition and the value of parts and metal. Request a free no-obligation quote and we will confirm the final price when we inspect the vehicle."
      },
      {
        "question": "Is car removal in Wallsend free?",
        "answer": "Yes. Towing is free within our service area. Call us to confirm pick-up for your address."
      },
      {
        "question": "Do you buy damaged or non-running cars in Wallsend?",
        "answer": "Yes. We buy accident-damaged, flooded, hail-damaged, mechanically failed and unregistered vehicles."
      }
    ],
    "nearby": [
      "newcastle",
      "charlestown",
      "maitland"
    ],
    "locationHref": "/locations/wallsend",
    "geo": {
      "lat": -32.9,
      "lng": 151.6667
    }
  }
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
