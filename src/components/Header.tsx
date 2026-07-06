"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { ShoppingCart, User, LogOut, Settings, X, MapPin, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const defaultNavLinks = [
  { key: "home", label: "Home", href: "/" },
  { key: "store", label: "Store", href: "/store" },
  { key: "portfolio", label: "Portfolio", href: "/portfolio" },
  { key: "custom_services", label: "Custom Services", href: "/services" },
  { key: "training_academy", label: "Training Academy", href: "/trainings" },
  { key: "accessories", label: "Accessories", href: "/accessories" },
  { key: "blogs", label: "Blogs", href: "/blogs" },
  { key: "about_us", label: "About Us", href: "/about" },
  { key: "contact_us", label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems);
  const { user, setUser, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuSettings, setMenuSettings] = useState<{key: string, visible: boolean}[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    
    fetch("/api/menu-settings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMenuSettings(data);
      })
      .catch(console.error);
      
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
        else setUser(null);
      })
      .catch(() => {});
  }, [setUser]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    setUserMenuOpen(false);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const count = totalItems();

  const visibleNavLinks = defaultNavLinks.filter(link => {
    const setting = menuSettings.find(s => s.key === link.key);
    return setting ? setting.visible : true; // Default to visible if not found
  });

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100",
          scrolled ? "shadow-sm py-2" : "py-3"
        )}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Menu Button */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => setMenuOpen(true)}
                className="flex items-center gap-2 group text-black hover:text-gray-600 transition-colors px-2 py-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 stroke-[1.5]" />
                <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.1em]">Menu</span>
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-[2] flex justify-center items-center">
              <Link href="/" className="flex items-center group relative">
                {/* Gold shine glow */}
                <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="/logo.jpeg" 
                  alt="Sri Krishna Crafting Logo" 
                  className="h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105 relative z-10" 
                  style={{ filter: "drop-shadow(0px 0px 15px rgba(212, 175, 55, 0.4))" }}
                />
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex-1 flex items-center justify-end gap-5">
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-1 text-black hover:text-gray-600 transition-colors"
                  >
                    <User className="w-5 h-5 stroke-[1.5]" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-4 w-48 bg-white border border-gray-100 shadow-xl rounded-none overflow-hidden z-50">
                      <div className="px-5 py-4 border-b border-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-black">{user.name}</p>
                        <p className="text-[10px] text-gray-500 mt-1 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" /> Account
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-amber-600 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5" /> Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-1 text-black hover:text-gray-600 transition-colors"
                >
                  <User className="w-5 h-5 stroke-[1.5]" />
                </Link>
              )}

              <Link
                href="/contact"
                className="p-1 text-black hover:text-gray-600 transition-colors hidden sm:block"
              >
                <MapPin className="w-5 h-5 stroke-[1.5]" />
              </Link>

              <Link
                href="/cart"
                className="relative p-1 text-black hover:text-gray-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
                {isMounted && count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <div className={cn("fixed inset-0 z-[100] transition-opacity duration-300", menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}>
        {/* Backdrop overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)}></div>
        
        {/* Drawer panel */}
        <div className={cn("absolute top-0 left-0 bottom-0 w-64 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 flex flex-col", menuOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="p-6 border-b border-gray-100 flex items-center justify-start">
            <button onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors group">
              <X className="w-5 h-5 stroke-[1.5]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">Close</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-medium tracking-wide text-black hover:text-amber-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-6">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-medium tracking-wide text-black hover:text-amber-600 transition-colors"
              >
                <MapPin className="w-4 h-4 stroke-[1.5]" /> Find Store
              </Link>
              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-medium tracking-wide text-black hover:text-amber-600 transition-colors"
              >
                <User className="w-4 h-4 stroke-[1.5]" /> Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
