import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartSheet } from "@/components/cart/CartSheet";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";

  const onSearch = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("q", value);
    else next.delete("q");
    setParams(next);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-accent" />
          <div className="leading-tight">
            <div className="font-hand text-xl text-accent">Rangista</div>
            <div className="-mt-1 text-xs text-muted-foreground">Hand-Painted Fashion</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About" />
          <NavItem to="/contact" label="Contact" />
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Input placeholder="Search products" className="w-48" value={q} onChange={(e) => onSearch(e.target.value)} />
          </div>
          <CartSheet />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm">Hi, {user.name.split(" ")[0]}</span>
              <Button onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/signup")}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "text-sm text-muted-foreground hover:text-foreground transition-colors",
          isActive && "text-foreground font-medium border-b-2 border-accent",
        )
      }
    >
      {label}
    </NavLink>
  );
}
