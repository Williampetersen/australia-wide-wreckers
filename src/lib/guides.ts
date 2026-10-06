import type { Faq } from "./faqs";

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  audience: string;
  summary: string;
  updated: string; // ISO date
  readMinutes: number;
  sections: GuideSection[];
  faqs: Faq[];
  related: string[]; // other guide slugs
};

export const guides: Guide[] = [
  {
    slug: "sell-a-damaged-car-nsw",
    title: "How to Sell a Damaged Car in NSW (Accident, Hail, Flood or Mechanical)",
    metaTitle: "Sell a Damaged Car in NSW: Accident, Hail, Flood & Mechanical",
    description:
      "Own an accident-damaged, hail-damaged, flooded or non-running car? Learn your options in NSW, what affects the price and how to get a fast cash offer with free towing.",
    keywords: [
      "sell damaged car NSW",
      "sell accident damaged car",
      "cash for damaged cars Newcastle",
      "sell non running car",
      "sell written off car NSW",
      "hail damaged car buyer",
    ],
    audience: "Anyone with an accident-damaged, broken-down, flooded or written-off vehicle",
    summary:
      "You can sell a damaged car in NSW even if it does not start, is not registered or has been written off. A wrecker or cash car buyer will price it on its condition, make, model and the value of its parts and metal, and can usually tow it for free. Get at least two offers, have your paperwork ready and lodge a notice of disposal after the sale.",
    updated: "2026-10-06",
    readMinutes: 7,
    sections: [
      {
        heading: "Can you sell a damaged car at all?",
        paragraphs: [
          "Yes. A damaged car still has value. Even when a vehicle is not worth repairing, its engine, transmission, panels, wheels, electronics and metal can be reused or recycled. That is why wreckers and cash car buyers are happy to buy cars that a dealer or a private buyer would turn away.",
          "The condition of the car changes the price, not whether it can be sold. A tidy car with a dented panel will usually be offered much more than a burnt-out shell, but both can be sold.",
        ],
      },
      {
        heading: "Types of damage buyers deal with every day",
        paragraphs: [
          "Different kinds of damage are priced differently. Knowing which one describes your car helps you describe it accurately and get a realistic offer.",
        ],
        bullets: [
          "Accident damage: front, rear or side impact, including cars with airbag deployment or bent chassis.",
          "Hail damage: the car drives well but has dents across the roof, bonnet and boot. Common after Hunter and Central Coast storm seasons.",
          "Flood damage: water has reached the interior or engine bay. These cars often have electrical faults and are usually sold for parts.",
          "Mechanical failure: blown engine, failed gearbox, seized motor or a repair bill that is higher than the car is worth.",
          "Fire damage: partial or complete. Valued mainly on salvageable parts and scrap metal.",
          "Insurance write-off: the insurer has declared the car not economical to repair. You may be able to keep and sell the vehicle, depending on your settlement.",
          "Neglect and age: faded paint, rust, a long list of faults or an expired registration.",
        ],
      },
      {
        heading: "Your options for selling a damaged car",
        paragraphs: [
          "There are four realistic routes. Each trades off price, effort and speed.",
        ],
        bullets: [
          "Repair it, then sell it. Only sensible if the repair costs clearly less than the value you add. Get a written quote first.",
          "Sell privately as is. Can work for a lightly damaged car, but expect many time wasters, inspections and haggling.",
          "Trade it in. Convenient if you are buying another car, but dealers rarely pay well for damaged stock.",
          "Sell to a cash car buyer or wrecker. This is the fastest option. You get a quote, they tow the car, you are paid and the paperwork is handled.",
        ],
      },
      {
        heading: "What affects the price of a damaged car?",
        paragraphs: [
          "Offers are based on what the vehicle is worth to the buyer once it has been dismantled, repaired or recycled. No honest buyer can give you a fixed number without knowing the details, so be prepared to share them.",
        ],
        bullets: [
          "Make, model and year: popular models have parts that are always in demand, such as common utes and Japanese hatchbacks.",
          "Which parts are still good: engine, transmission, catalytic converter, wheels, seats and electronics.",
          "Whether it is complete: missing parts reduce the offer.",
          "Registration and plates: a registered car is usually easier to value and move.",
          "Current scrap metal prices, which move over time.",
          "Where the car is and how easy it is to tow.",
        ],
      },
      {
        heading: "Step by step: how to sell a damaged car and get a fair price",
        paragraphs: [
          "Follow these steps and you will avoid the usual problems.",
        ],
        bullets: [
          "Take clear photos from every angle, including the damage, odometer and interior.",
          "Write down the make, model, year, rego, odometer reading and what does and does not work.",
          "Find your registration papers, photo ID and, if there is finance, a payout letter.",
          "Request quotes from at least two buyers and compare them. Ask whether towing is really free and whether the price changes at pick-up.",
          "Remove your personal items, toll tags and number plates if the buyer asks you to keep them.",
          "Get a written receipt, take payment as agreed and keep a record of the buyer's details.",
          "Lodge a notice of disposal so the vehicle is no longer linked to you.",
        ],
      },
      {
        heading: "Selling an insurance write-off in NSW",
        paragraphs: [
          "If your insurer has declared the car a total loss, the vehicle may be recorded on the written-off vehicles register. Rules about re-registering and selling written-off vehicles apply, so check the current requirements with Service NSW before you sell or buy one.",
          "Many owners choose to take the insurance payout and let the insurer deal with the car. If you keep it, a wrecker can still buy it for parts. Always tell the buyer that the car is a write-off.",
        ],
      },
      {
        heading: "Selling a damaged car in the Hunter, Newcastle and Central Coast",
        paragraphs: [
          "Australia Wide Wreckers buys damaged and non-running vehicles across Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens and the Central Coast, with depots in Muswellbrook and Morisset. Free towing is included in our service area, so you do not need to arrange a flatbed or a mechanic.",
          "Tell us the vehicle details, send a few photos and we will call you with a cash offer. The final price is confirmed when we inspect the vehicle.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I sell a car that does not start?",
        answer:
          "Yes. Non-running cars are bought every day by wreckers and cash car buyers. The offer reflects the condition and the value of the parts and metal, and towing is usually free.",
      },
      {
        question: "Can I sell an accident-damaged car without repairing it?",
        answer:
          "Yes. Repairs are often not worth the cost. You can sell the car as it is to a cash buyer or wrecker and avoid repair bills and delays.",
      },
      {
        question: "Do I need to tell the buyer the car is damaged?",
        answer:
          "Yes, always be honest about damage, floods, fire and write-off history. It protects you legally and avoids price changes at pick-up.",
      },
      {
        question: "What do I do after selling a damaged car in NSW?",
        answer:
          "Lodge a notice of disposal with Service NSW, keep your receipt and cancel or transfer insurance and tolls. Check the Service NSW website for current steps.",
      },
    ],
    related: ["where-to-sell-your-car-for-the-best-price", "sell-unwanted-or-unregistered-car-nsw"],
  },
  {
    slug: "where-to-sell-your-car-for-the-best-price",
    title: "Where to Sell Your Car for the Best Price: Dealer, Private, Online or Cash Buyer?",
    metaTitle: "Where to Sell Your Car for the Best Price in Australia",
    description:
      "Compare selling your car privately, trading it in, using online marketplaces or a cash car buyer. Find out which option suits your car and how to get the best price.",
    keywords: [
      "where to sell my car",
      "best place to sell a car",
      "sell car for best price",
      "sell my car fast for cash",
      "private sale vs trade in",
      "cash for cars Newcastle",
    ],
    audience: "Anyone deciding how and where to sell a used car, ute, van or motorbike",
    summary:
      "There is no single best place to sell a car. A private sale usually brings the highest price for a good, clean car but takes the most time. A trade-in is easiest when buying another car. A cash car buyer is fastest and best for older, damaged or unwanted cars. Compare at least two offers before you decide.",
    updated: "2026-10-06",
    readMinutes: 8,
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "The best place to sell depends on three things: the condition of your car, how quickly you need the money and how much effort you want to put in. A late-model, well-kept car is worth advertising privately. An older car with problems, or one you want gone this week, is better sold to a cash buyer.",
        ],
      },
      {
        heading: "Option 1: Sell privately",
        paragraphs: [
          "Advertising your car on a marketplace or classified site usually gets the highest price because you are selling directly to the person who will drive it.",
        ],
        bullets: [
          "Pros: highest potential price, you control the asking price.",
          "Cons: time, repeated enquiries, test drives, negotiating and a risk of scams or payment problems.",
          "Best for: well-kept, popular cars in good condition and with a full service history.",
        ],
      },
      {
        heading: "Option 2: Trade it in at a dealership",
        paragraphs: [
          "A dealer will take your old car as part of buying another one. It is simple and removes the paperwork.",
        ],
        bullets: [
          "Pros: convenient, one transaction, they handle the paperwork.",
          "Cons: the trade-in price is usually lower than a private sale because the dealer needs a margin.",
          "Best for: people who want an easy swap and are buying from the same dealer.",
        ],
      },
      {
        heading: "Option 3: Sell to a cash car buyer or wrecker",
        paragraphs: [
          "Cash car buyers and wreckers make you a quote based on the car's condition and value, collect it and pay you on pick-up. You do not need to repair, clean or advertise it.",
        ],
        bullets: [
          "Pros: very fast, free towing is common, accepts damaged, old and unregistered cars, no test drives or time wasters.",
          "Cons: offers can be lower than a private sale for a car in excellent condition.",
          "Best for: damaged, non-running, old, high-kilometre, unregistered or unwanted vehicles, and anyone who needs a quick sale.",
        ],
      },
      {
        heading: "Option 4: Online car-buying services",
        paragraphs: [
          "Some national services give an online valuation and arrange an inspection. They can be a good middle ground for late-model cars. Check how the final price is set, whether it changes after inspection and when you are paid.",
        ],
      },
      {
        heading: "How to get the best price whichever route you choose",
        paragraphs: ["These habits make a measurable difference."],
        bullets: [
          "Get more than one offer. Even two or three quotes show you the real market.",
          "Clean the car inside and out. A tidy car is easier to value well.",
          "Gather your service records, logbook and spare keys.",
          "Fix cheap problems such as a warning light caused by a loose gas cap, but do not spend on big repairs without a quote.",
          "Be honest. Hidden faults get found at inspection and the offer is cut.",
          "Ask what is included: free towing, same-day payment, paperwork handled.",
          "Avoid paying any fee to sell your car. A genuine buyer pays you.",
        ],
      },
      {
        heading: "Comparison at a glance",
        paragraphs: [
          "Private sale: highest price, slowest. Dealer trade-in: easiest when buying, middle to low price. Cash car buyer or wrecker: fastest, best for damaged or old cars. Online service: quick valuation, good for newer cars.",
        ],
      },
      {
        heading: "Selling in Newcastle, Lake Macquarie, the Hunter and the Central Coast",
        paragraphs: [
          "Local buyers can usually collect on the same day, which cuts the time your car sits in the driveway. Australia Wide Wreckers offers cash offers and free removal across Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens and the Central Coast. Use the quote form to get an offer in minutes. We cannot promise it is the highest price in the market, but we do promise a clear offer with no obligation.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best way to sell my car quickly?",
        answer:
          "Selling to a cash car buyer is usually the fastest, often within a day. A dealer trade-in is also quick if you are buying another car.",
      },
      {
        question: "Will I get more by selling privately?",
        answer:
          "Often, yes, for a clean late-model car in good condition. It takes more time and effort, and the benefit is smaller for old or damaged cars.",
      },
      {
        question: "Should I fix my car before selling?",
        answer:
          "Only if the repair clearly costs less than the value it adds. For major damage, selling as is to a wrecker is usually better.",
      },
      {
        question: "Is it safe to sell to a cash car buyer?",
        answer:
          "Yes if you check they are an established local business, get a written quote, confirm what the price includes and keep a receipt.",
      },
    ],
    related: ["sell-a-damaged-car-nsw", "sell-4x4-ute-van-truck-or-motorbike-for-cash"],
  },
  {
    slug: "cash-for-cars-newcastle-hunter-central-coast",
    title: "Cash for Cars in Newcastle, the Hunter Valley and the Central Coast: Area Guide",
    metaTitle: "Cash for Cars Newcastle, Hunter Valley & Central Coast",
    description:
      "Area guide to selling your car for cash in Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens, Muswellbrook and the Central Coast. Free removal and fast cash offers.",
    keywords: [
      "cash for cars Newcastle",
      "cash for cars Hunter Valley",
      "cash for cars Central Coast",
      "car removal Lake Macquarie",
      "sell my car Maitland",
      "car buyer Muswellbrook",
      "cash for cars Port Stephens",
    ],
    audience: "Car owners in Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens, Muswellbrook, Morisset and the Central Coast",
    summary:
      "Australia Wide Wreckers buys cars, utes, vans, trucks and motorbikes in any condition across Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens and the Central Coast. We operate from depots in Muswellbrook and Morisset, tow for free within our service area and confirm the final price on inspection.",
    updated: "2026-10-06",
    readMinutes: 6,
    sections: [
      {
        heading: "Where we buy cars",
        paragraphs: [
          "We cover a large part of the Hunter and Central Coast. Local pick-up means less waiting, lower risk of storage fees and a quicker payment. Below is how it works in each area.",
        ],
      },
      {
        heading: "Newcastle and inner suburbs",
        paragraphs: [
          "From Mayfield, Hamilton and Wallsend to Kotara, Merewether and Lambton, we collect from driveways, work yards, units and roadsides. Tight streets and apartment car parks are not a problem for our tow crews.",
        ],
      },
      {
        heading: "Lake Macquarie",
        paragraphs: [
          "Charlestown, Belmont, Swansea, Cardiff, Warners Bay, Cameron Park, Edgeworth and Morisset are all in our service area. Our Morisset depot is close to the Lake Macquarie communities.",
        ],
      },
      {
        heading: "Maitland and the Hunter Valley",
        paragraphs: [
          "We buy and remove vehicles in Maitland, Thornton, Branxton, Greta and Cessnock, and our Muswellbrook depot covers the Upper Hunter. Farm utes, work vans and older vehicles are all welcome.",
        ],
      },
      {
        heading: "Port Stephens",
        paragraphs: [
          "Raymond Terrace, Medowie, Karuah, Nelson Bay, Anna Bay, Tanilba Bay and Tea Gardens are covered. If your vehicle has been sitting for a while, we can still collect it.",
        ],
      },
      {
        heading: "Central Coast",
        paragraphs: [
          "We service Central Coast suburbs with free removal and cash offers. Call or use the quote form and we will confirm pick-up timing for your suburb.",
        ],
      },
      {
        heading: "What vehicles we buy",
        paragraphs: ["All of these, running or not:"],
        bullets: [
          "Cars, sedans, hatchbacks and SUVs",
          "Utes, including dual-cab and work utes",
          "Vans and minibuses",
          "Pickup trucks and light trucks",
          "Motorbikes",
          "Damaged, written-off, flooded, hail-damaged and unregistered vehicles",
          "Old, high-kilometre and unwanted vehicles",
        ],
      },
      {
        heading: "How it works",
        paragraphs: ["Four steps, usually the same day."],
        bullets: [
          "Get a quote: use the online form or call us with your vehicle details.",
          "Receive your cash offer: we call you with an offer based on condition, make, model and year.",
          "Free pick-up: we collect the vehicle at a time that suits you.",
          "Get paid: the final price is confirmed on inspection and you are paid on pick-up as agreed.",
        ],
      },
      {
        heading: "Why sell locally?",
        paragraphs: [
          "A local buyer knows local demand, can inspect and tow quickly and is easy to reach after the sale. You also avoid the risks of dealing with an interstate buyer or an unknown marketplace contact.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which areas do you buy cars in?",
        answer:
          "Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens and the Central Coast, with depots in Muswellbrook and Morisset. Call us if you are unsure about your suburb.",
      },
      {
        question: "Is car removal really free?",
        answer:
          "Yes, towing is free within our service area. There are no callout charges.",
      },
      {
        question: "Can you pick up the same day?",
        answer:
          "In most cases we can collect the same day or the next day. Tell us your preferred time when you request a quote.",
      },
      {
        question: "Do you buy cars in the Upper Hunter?",
        answer:
          "Yes. Our Muswellbrook depot services the Upper Hunter and surrounding towns.",
      },
    ],
    related: ["where-to-sell-your-car-for-the-best-price", "sell-a-damaged-car-nsw"],
  },
  {
    slug: "sell-unwanted-or-unregistered-car-nsw",
    title: "Selling an Unwanted, Old or Unregistered Car in NSW: Paperwork and Checklist",
    metaTitle: "Sell an Unwanted or Unregistered Car in NSW: Paperwork Guide",
    description:
      "Step-by-step checklist for selling an old, unwanted or unregistered car in NSW. What paperwork you need, how to handle finance and how to protect yourself after the sale.",
    keywords: [
      "sell unregistered car NSW",
      "sell old car NSW",
      "car removal paperwork NSW",
      "notice of disposal NSW",
      "sell car with no rego",
      "scrap car NSW",
    ],
    audience: "Owners of old, unregistered, abandoned-in-the-driveway or unwanted vehicles",
    summary:
      "You can sell an old or unregistered car in NSW. Gather proof of ID and ownership, check for finance owing, remove personal items and plates if required, take a receipt and lodge a notice of disposal with Service NSW. Always check the current rules on the Service NSW website because requirements can change.",
    updated: "2026-10-06",
    readMinutes: 6,
    sections: [
      {
        heading: "Can I sell a car that is not registered?",
        paragraphs: [
          "Yes. Unregistered cars can be sold to wreckers and cash car buyers, who will usually tow it away. Because the car cannot be driven on the road without registration, towing is the normal way to move it.",
          "Rules about selling unregistered vehicles, plates and registration refunds are set by Service NSW and can change, so check the current guidance before you sell.",
        ],
      },
      {
        heading: "What you will need",
        paragraphs: ["Have these ready before the buyer arrives."],
        bullets: [
          "Photo ID such as a driver licence.",
          "Proof of ownership: registration papers or other documents.",
          "Vehicle details: make, model, year, VIN or rego and odometer reading.",
          "Spare keys and any service records.",
          "A finance payout letter if money is still owing.",
        ],
      },
      {
        heading: "What if there is finance on the car?",
        paragraphs: [
          "If a lender holds a security interest, the car generally cannot be sold clear until the debt is paid. Contact your lender for a payout figure and tell the buyer. Never hide finance from a buyer.",
        ],
      },
      {
        heading: "Before the car is collected",
        paragraphs: ["A short checklist."],
        bullets: [
          "Remove personal belongings, documents, toll tags and child seats.",
          "Clear any data from the infotainment system and unpair your phone.",
          "Take photos of the car as it is handed over.",
          "Check whether you need to keep the number plates and ask the buyer.",
        ],
      },
      {
        heading: "At hand-over",
        paragraphs: ["Protect yourself with a clear record."],
        bullets: [
          "Get the buyer's name, contact details and business details.",
          "Agree the final price in writing.",
          "Take payment as agreed and keep a receipt that shows the date, the vehicle and both parties.",
        ],
      },
      {
        heading: "After the sale",
        paragraphs: [
          "Tell Service NSW the vehicle has been sold by lodging a notice of disposal. This helps protect you from tolls, fines and fees that happen after you hand over the car. Cancel the insurance and any tolling accounts linked to the car.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: ["Avoid these."],
        bullets: [
          "Handing over the car without a receipt.",
          "Forgetting to lodge the notice of disposal.",
          "Not mentioning finance, damage or missing parts.",
          "Paying an upfront fee to a buyer. A genuine buyer pays you.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I sell my car without registration papers?",
        answer:
          "It is possible in some cases, but proof of ownership makes the process much easier. Contact us and we will tell you what we need for your vehicle.",
      },
      {
        question: "How do I tell Service NSW I sold my car?",
        answer:
          "Lodge a notice of disposal with Service NSW. Check the Service NSW website for the current process.",
      },
      {
        question: "Do I get my rego back when I sell?",
        answer:
          "Registration refund rules are set by Service NSW. Check the current rules for your situation.",
      },
      {
        question: "Can you collect a car from a paddock or storage yard?",
        answer:
          "Yes. We tow from homes, yards, paddocks and roadsides within our service area.",
      },
    ],
    related: ["sell-a-damaged-car-nsw", "cash-for-cars-newcastle-hunter-central-coast"],
  },
  {
    slug: "sell-4x4-ute-van-truck-or-motorbike-for-cash",
    title: "Selling a 4x4, Ute, Van, Light Truck or Motorbike for Cash: What Buyers Look For",
    metaTitle: "Sell a Ute, 4x4, Van, Truck or Motorbike for Cash",
    description:
      "How to sell a ute, 4x4, van, light truck or motorbike for cash. What affects value, how to prepare the vehicle and how to get the best price from local buyers.",
    keywords: [
      "sell ute for cash",
      "cash for 4x4",
      "sell van for cash",
      "sell motorbike for cash",
      "cash for trucks Newcastle",
      "sell work ute",
    ],
    audience: "Owners of utes, 4x4s, vans, light trucks and motorbikes who want a quick cash sale",
    summary:
      "Utes, 4x4s, vans, light trucks and motorbikes hold value well, even when damaged or high-kilometre. Buyers look at make, model, year, kilometres, condition, tow rating, tray or body type and available parts. Clean it, collect service records and compare offers to get the best price.",
    updated: "2026-10-06",
    readMinutes: 6,
    sections: [
      {
        heading: "Why these vehicles are in demand",
        paragraphs: [
          "Work utes, dual cabs, 4x4s, delivery vans and motorbikes are always wanted in the Hunter and on the Central Coast. Even when they are damaged or worn, their drivetrains, tray bodies, wheels and electronics are valuable, so wreckers and cash buyers pay well for many of them.",
        ],
      },
      {
        heading: "Selling a ute or 4x4",
        paragraphs: ["Buyers look at:"],
        bullets: [
          "Model and engine: popular diesel utes and common 4x4 models are in constant demand.",
          "Kilometres and service history.",
          "Rust, especially on the chassis and tray.",
          "Modifications: lift kits, bull bars and canopies can add value when well fitted, but can also reduce it if poorly done.",
          "Damage from work or off-road use.",
        ],
      },
      {
        heading: "Selling a van or minibus",
        paragraphs: [
          "Delivery vans and minibuses are often sold when a business upgrades its fleet. Gather service records and let the buyer know about shelving, racks and signwriting, which may or may not be removable.",
        ],
      },
      {
        heading: "Selling a light truck or pickup",
        paragraphs: [
          "Tray trucks and light commercial trucks are priced on make, model, year, hours or kilometres, body type and condition. Give the buyer the GVM, body details and any equipment fitted.",
        ],
      },
      {
        heading: "Selling a motorbike",
        paragraphs: [
          "Used, damaged, unregistered or unwanted motorbikes can be sold for cash. Have your ID, proof of ownership, spare keys and any riding gear or accessories that are included in the sale.",
        ],
      },
      {
        heading: "How to prepare your vehicle",
        paragraphs: ["Small steps that help."],
        bullets: [
          "Wash and clean the vehicle.",
          "Empty the tray, cab, glovebox and storage areas.",
          "Take photos from all angles, including the odometer and any damage.",
          "Write down modifications and fitted accessories.",
          "Get a finance payout letter if there is money owing.",
        ],
      },
      {
        heading: "How to get the best price",
        paragraphs: ["The same rules apply to every vehicle."],
        bullets: [
          "Compare at least two offers.",
          "Be honest about faults and damage.",
          "Ask whether towing is free and whether the price changes at pick-up.",
          "Choose a buyer who pays on pick-up and gives a receipt.",
        ],
      },
      {
        heading: "We buy them across the Hunter and Central Coast",
        paragraphs: [
          "Australia Wide Wreckers buys utes, 4x4s, vans, light trucks and motorbikes in any condition in Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens and the Central Coast. Use our quote form and choose your vehicle type to get started.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you buy damaged utes and 4x4s?",
        answer:
          "Yes. We buy running and non-running utes and 4x4s, including accident-damaged and high-kilometre vehicles.",
      },
      {
        question: "Can I sell a motorbike that is unregistered?",
        answer:
          "Yes. We buy unregistered, damaged and unwanted motorbikes. Have your ID and proof of ownership ready.",
      },
      {
        question: "Do you buy work vans with shelving fitted?",
        answer:
          "Yes. Let us know what is fitted when you request a quote, since racks and shelving can affect the offer.",
      },
      {
        question: "Is towing free for trucks?",
        answer:
          "Towing is free within our service area for the vehicles we buy. Tell us the size and type when you get a quote so we send the right truck.",
      },
    ],
    related: ["where-to-sell-your-car-for-the-best-price", "sell-unwanted-or-unregistered-car-nsw"],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
