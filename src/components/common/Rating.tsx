import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: RatingProps) {
  const sizeClasses = { sm: "size-3", md: "size-4", lg: "size-5" };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted",
            interactive &&
              "cursor-pointer hover:scale-110 transition-transform",
          )}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      ))}
    </div>
  );
}
