import { cn } from "@/lib/utils/cn";

interface BrandMarkProps {
  size?: "2xs" | "xs" | "sm" | "md" | "lg";
  rounded?: "md" | "xl" | "2xl" | "full";
  variant?: "transparent" | "badge";
  decorative?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandMarkProps["size"]>, string> = {
  "2xs": "w-4 h-4",
  xs: "w-5 h-5",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

const ROUNDED_CLASSES: Record<NonNullable<BrandMarkProps["rounded"]>, string> = {
  md: "rounded-md",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export function BrandMark({
  size = "sm",
  rounded = "xl",
  variant = "transparent",
  decorative = false,
  className,
}: BrandMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        variant === "badge"
          ? cn(
              "overflow-hidden bg-[#060708] ring-1 ring-amber-400/25 shadow-xs",
              ROUNDED_CLASSES[rounded]
            )
          : "bg-transparent",
        SIZE_CLASSES[size],
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/invitovix-icon.png"
        alt={decorative ? "" : "Invitovix"}
        aria-hidden={decorative ? true : undefined}
        className={cn(
          "h-full w-full",
          variant === "badge"
            ? "object-cover"
            : "object-contain drop-shadow-[0_2px_6px_rgba(120,82,22,0.22)]"
        )}
      />
    </span>
  );
}
