import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandProps = {
  variant?: "nav" | "footer";
  className?: string;
};

export function Brand({ variant = "nav", className }: BrandProps) {
  const isFooter = variant === "footer";

  return (
    <span
      className={cn(
        "relative block overflow-hidden",
        isFooter ? "h-[112px] w-[250px]" : "h-12 w-[150px] sm:h-14 sm:w-[200px]",
        className,
      )}
    >
      <Image
        src="/assets/images/brand.png"
        alt="হাদিকাতুল উলুম"
        width={3264}
        height={3264}
        priority={!isFooter}
        sizes={isFooter ? "250px" : "(min-width: 498px) 200px, 150px"}
        className={cn(
          "absolute inset-0 m-auto h-auto max-w-none",
          isFooter ? "w-[250px]" : "w-[150px] sm:w-[200px]",
        )}
      />
    </span>
  );
}
