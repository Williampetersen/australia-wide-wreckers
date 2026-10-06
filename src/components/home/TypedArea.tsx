"use client";

import { useEffect, useState } from "react";

// Ten areas, biggest first. The loop always starts again at Newcastle.
const areas = [
  "Newcastle",
  "Central Coast",
  "Lake Macquarie",
  "Maitland",
  "Port Stephens",
  "Cessnock",
  "Charlestown",
  "Kurri Kurri",
  "Singleton",
  "Muswellbrook",
] as const;

export function TypedArea() {
  const [areaIndex, setAreaIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Type the current area letter by letter, pause, delete it, then move to the next one.
  useEffect(() => {
    const word = areas[areaIndex];
    let delay = deleting ? 45 : 95;
    if (!deleting && text === word) delay = 1600;
    if (deleting && text === "") delay = 350;

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setAreaIndex((index) => (index + 1) % areas.length);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, areaIndex]);

  return (
    <>
      <span className="block">The biggest car buyers in</span>
      <span className="mt-1 block font-bold text-navy">
        {text}
        <span aria-hidden className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-navy align-middle" />
      </span>
    </>
  );
}
