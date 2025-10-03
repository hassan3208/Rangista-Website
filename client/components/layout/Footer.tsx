export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="font-hand text-2xl text-accent">Rangista</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Artsy, traditional fashion for women and children. Hand-painted, made with love.
          </p>
        </div>
        <div>
          <div className="font-medium mb-2">Contact</div>
          <ul className="space-y-1 text-sm">
            <li>WhatsApp: <a className="underline" href="https://wa.me/923328425042" target="_blank" rel="noreferrer">03328425042</a></li>
            <li>Email: <a className="underline" href="mailto:itsmywork1019@gmail.com">itsmywork1019@gmail.com</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2">Social</div>
          <ul className="space-y-1 text-sm">
            <li><a className="underline" href="https://www.facebook.com/profile.php?id=100065230491278" target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a className="underline" href="https://www.instagram.com/_rangista/" target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Rangista. All rights reserved.</div>
    </footer>
  );
}
