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
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
