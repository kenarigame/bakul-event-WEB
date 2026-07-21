import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CountdownTimerProps {
  deadline: string;
  onExpire?: () => void;
}

export function CountdownTimer({ deadline, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));

  function getTimeLeft(deadline: string) {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const left = getTimeLeft(deadline);
      setTimeLeft(left);
      if (!left) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  if (!timeLeft) {
    return <Badge variant="destructive">Payment Deadline Expired</Badge>;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Clock className="size-4 text-amber-500" />
      <span className="font-mono font-semibold text-amber-600">
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
      <span className="text-muted-foreground text-xs">remaining</span>
    </div>
  );
}
