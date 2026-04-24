import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendPositive?: boolean;
  loading?: boolean;
  accent?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendPositive,
  loading,
  accent,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="glass-card p-6">
        <Skeleton className="h-4 w-24 mb-4 bg-steel-grey/20" />
        <Skeleton className="h-10 w-16 mb-2 bg-steel-grey/20" />
        <Skeleton className="h-3 w-32 bg-steel-grey/20" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "glass-card p-6 hover:border-accent-blue/40 transition-all duration-200",
        accent && "border-accent-blue/40 bg-accent-blue/5"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-steel-grey text-sm">{title}</span>
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            accent
              ? "bg-accent-blue/20 border border-accent-blue/30"
              : "bg-steel-grey/10 border border-steel-grey/20"
          )}
        >
          <Icon
            className={cn("w-4 h-4", accent ? "text-accent-blue" : "text-steel-grey")}
          />
        </div>
      </div>
      <div className="font-heading text-4xl text-foreground mb-1">{value}</div>
      {description && (
        <p className="text-steel-grey text-xs">{description}</p>
      )}
      {trend && (
        <p
          className={cn(
            "text-xs mt-1",
            trendPositive ? "text-success" : "text-red-400"
          )}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
