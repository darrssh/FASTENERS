export const SITE = {
  name: "ComingSoon",
  tagline: "Fine Jewellery",
  url: "https://comingsoon-jewellery.example",
  email: "hello@comingsoon.example",
  description:
    "Handcrafted jewellery shaped by precision, artistry and timeless design.",
} as const;

export const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Craftsmanship", href: "#craftsmanship" },
  { label: "Story", href: "#story" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;

export const METALS = [
  { id: "yellow", label: "Yellow Gold" },
  { id: "white", label: "White Gold" },
  { id: "rose", label: "Rose Gold" },
] as const;

export const STONES = [
  { id: "diamond", label: "Diamond" },
  { id: "ruby", label: "Ruby" },
  { id: "emerald", label: "Emerald" },
  { id: "sapphire", label: "Sapphire" },
] as const;

export type MetalId = (typeof METALS)[number]["id"];
export type StoneId = (typeof STONES)[number]["id"];

export const METAL_COLORS: Record<MetalId, string> = {
  yellow: "#E3B955",
  white: "#E8EAEF",
  rose: "#E9A88A",
};

export const STONE_COLORS: Record<StoneId, string> = {
  diamond: "#FFFFFF",
  ruby: "#E0115F",
  emerald: "#2E9A6A",
  sapphire: "#2E5FA3",
};
