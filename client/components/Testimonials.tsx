export default function Testimonials() {
  const items = [
    {
      name: "Aisha",
      text: "The hand-painted details are stunning. Perfect for Eid!",
    },
    {
      name: "Sara",
      text: "Beautiful designs for my daughter's birthday. Excellent quality.",
    },
    {
      name: "Noor",
      text: "Loved the Azadi collection – elegant and cultural.",
    },
  ];
  return (
    <section className="container py-16">
      <h2 className="font-serif text-3xl">What customers say</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="rounded-xl border p-5 bg-card">
            <div className="font-medium">{t.name}</div>
            <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
