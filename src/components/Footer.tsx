import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t relative z-10"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#e5e5e5",
        color: "#1f1f1f",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4 group relative w-max">
              {/* Gold shine glow */}
              <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="h-16 w-auto relative flex items-center justify-center z-10">
                <img 
                  src="/logo.jpeg" 
                  alt="Sri Krishna Crafting Logo" 
                  className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500" 
                  style={{ filter: "drop-shadow(0px 0px 15px rgba(212, 175, 55, 0.4))" }}
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#4b4b4b" }}>
              Handcrafted epoxy resin art and decor — river tables, jewelry,
              coasters and bespoke pieces made with love.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#1f1f1f" }}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Store", href: "/store" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "About Us", href: "/about" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-amber-600 transition-colors"
                    style={{ color: "#4b4b4b" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#1f1f1f" }}>Services</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Custom Orders", href: "/customservices?tab=custom_orders" },
                { label: "Corporate Gifts", href: "/customservices?tab=corporate_gifts" },
                { label: "Flooring", href: "/customservices?tab=flooring" },
                { label: "Installations", href: "/customservices?tab=installations" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-amber-600 transition-colors"
                    style={{ color: "#4b4b4b" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#1f1f1f" }}>Contact</h4>
            <ul className="space-y-3 text-sm" style={{ color: "#4b4b4b" }}>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#0f52ba]" /> hello@srikrishnacrafting.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#0f52ba]" /> +91 831 966 8016</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#0f52ba]" /> Indore, Bengalore</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t text-center text-sm"
          style={{ borderColor: "#e5e5e5", color: "#4b4b4b" }}
        >
          <p>
            © {new Date().getFullYear()} Sri Krishna Crafting. All rights reserved. | Developed by{" "}
            <a
              href="https://www.cypherswift.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "var(--peacock-blue)" }}
            >
              CypherSwift InfoTech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}


