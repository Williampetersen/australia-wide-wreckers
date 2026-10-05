// Options for the sell-your-car quote flow. The values here must stay in sync
// with the allow-lists in src/app/api/quote/route.ts.

export const vehicleTypes = [
  {
    id: "cars",
    label: "Cars",
    description: "Sedans, hatchbacks, SUVs and 4x4s",
    icon: "car",
    image: "/images/vehicles/car.png",
  },
  {
    id: "utes",
    label: "Utes",
    description: "Single cab, dual cab and work utes",
    icon: "truck",
    image: "/images/vehicles/ute.png",
  },
  {
    id: "motorbikes",
    label: "Motorbikes",
    description: "Used, damaged, unregistered or unwanted bikes",
    icon: "bike",
    image: "/images/vehicles/motorbike.png",
  },
  {
    id: "pickup-trucks",
    label: "Pickup Trucks",
    description: "Large pickups and heavy-duty 4x4 models",
    icon: "truck",
    image: "/images/vehicles/pickup.png",
  },
  {
    id: "vans",
    label: "Vans",
    description: "Delivery vans, minibuses and transport vans",
    icon: "bus",
    image: "/images/vehicles/van.png",
  },
  {
    id: "light-trucks",
    label: "Light Trucks",
    description: "Tray trucks and light commercial trucks",
    icon: "container",
    image: "/images/vehicles/light-truck.png",
  },
] as const;

export type VehicleTypeId = (typeof vehicleTypes)[number]["id"];

export const conditions = [
  { id: "runs", label: "Runs and drives", description: "Driveable, registered or not" },
  { id: "not-running", label: "Doesn't run", description: "Won't start or move under its own power" },
  { id: "damaged", label: "Accident damaged", description: "Crash, hail or storm damage" },
  { id: "scrap", label: "Scrap / written off", description: "Insurance write-off or end of life" },
  { id: "missing-parts", label: "Missing parts", description: "Stripped, incomplete or partly dismantled" },
] as const;

export type ConditionId = (typeof conditions)[number]["id"];

export function getVehicleType(id: string | undefined) {
  return vehicleTypes.find((type) => type.id === id);
}

export const CURRENT_YEAR = new Date().getFullYear();
export const vehicleYears = Array.from(
  { length: CURRENT_YEAR - 1980 + 1 },
  (_, index) => String(CURRENT_YEAR - index)
);
