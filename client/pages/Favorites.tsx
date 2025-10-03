import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/context/FavoritesContext";
import { PRODUCTS } from "@/data/products";

export default function Favorites() {
  const { favorites } = useFavorites();
  const favProducts = PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <main className="container py-10">
      <h1 className="font-serif text-3xl">Your Favorites</h1>
      {favProducts.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No favorites yet. Tap the ♥ on a product to save it here.</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favProducts.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </main>
  );
}
