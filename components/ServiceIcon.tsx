import {
  Building2,
  DraftingCompass,
  HardHat,
  House,
  Landmark,
  Mountain,
  Ruler,
  ShieldCheck,
} from "lucide-react";

const icons = {
  Building2,
  DraftingCompass,
  HardHat,
  House,
  Landmark,
  Mountain,
  Ruler,
  ShieldCheck,
} as const;

export function ServiceIcon({
  name,
  size = 27,
}: {
  name?: string;
  size?: number;
}) {
  const Icon = name && name in icons ? icons[name as keyof typeof icons] : Building2;
  return <Icon size={size} strokeWidth={1.4} aria-hidden="true" />;
}
