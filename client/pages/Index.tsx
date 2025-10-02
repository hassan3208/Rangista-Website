import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import FilterBar, { Filters } from "@/components/FilterBar";
import Testimonials from "@/components/Testimonials";
import { PRODUCTS } from "@/data/products";
import { useSearchParams } from "react-router-dom";

export default function Index() {
  const [filters, setFilters] = useState<Filters>({ collection: "all", size: "all", maxPrice: 20000 });
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").toLowerCase();

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (q && !(`${p.name} ${p.collection}`.toLowerCase().includes(q))) return false;
      if (filters.collection && filters.collection !== "all" && p.collection !== filters.collection) return false;
      if (filters.size && filters.size !== "all" && !p.sizes.includes(filters.size)) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      return true;
    });
  }, [filters, q]);

  const eid = PRODUCTS.filter((p) => p.collection === "Eid Collection").slice(0, 3);
  const azadi = PRODUCTS.filter((p) => p.collection === "14 August Independence Collection").slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="container py-16 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <p className="text-accent font-hand text-xl">Rangista</p>
            <h1 className="mt-2 font-serif text-4xl md:text-5xl leading-tight">Hand-Painted Clothes for Women & Children</h1>
            <p className="mt-4 text-muted-foreground max-w-xl">Rangista brings you artsy and traditional fashion inspired by culture and crafted with love.</p>
            <div className="mt-6 flex gap-3">
              <a href="#shop" className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-5 py-3">Shop now</a>
              <a href="/about" className="inline-flex items-center rounded-md border px-5 py-3">Learn more</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20" />
          </div>
        </div>
      </section>

      <section className="container py-10">
        <FilterBar filters={filters} onChange={setFilters} />
        <div id="shop" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-3xl">Featured Eid Collection</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eid.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-3xl">14 August Specials</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {azadi.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      <Testimonials />
    </main>
  );
}
