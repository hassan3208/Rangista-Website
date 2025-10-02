import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLLECTIONS, SIZES } from "@/data/products";

export interface Filters {
  collection?: (typeof COLLECTIONS)[number] | "all";
  size?: (typeof SIZES)[number] | "all";
  maxPrice?: number;
}

export default function FilterBar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 bg-secondary rounded-xl p-4">
      <div>
        <label className="text-xs text-muted-foreground">Collection</label>
        <Select value={filters.collection ?? "all"} onValueChange={(v) => onChange({ ...filters, collection: v as any })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {COLLECTIONS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Size</label>
        <Select value={filters.size ?? "all"} onValueChange={(v) => onChange({ ...filters, size: v as any })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {SIZES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Max Price</label>
        <div className="mt-3">
          <Slider defaultValue={[filters.maxPrice ?? 10000]} max={20000} step={500} onValueChange={(v) => onChange({ ...filters, maxPrice: v[0] })} />
        </div>
      </div>
    </div>
  );
}
