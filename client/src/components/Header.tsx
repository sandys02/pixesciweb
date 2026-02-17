import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/ChatGPT Image Nov 28, 2025, 09_38_22 PM_1764384089669.png";

const CALENDAR_URL = "https://cal.com/pixesci/30min?user=pixesci&overlayCalendar=true";

const navItems = [
  { label: "Features", href: "#section-features" },
  { label: "Demo", href: "#section-demo" },
  { label: "Tools", href: "#section-tools" },
  { label: "FAQ", href: "#section-faq" },
];

function smoothScrollTo(elementId: string) {
  const id = elementId.replace('#', '');
  const element = document.querySelector(`[data-testid="${id}"]`) || document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    smoothScrollTo(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" 
            : "bg-background/60 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.img 
                src={logoImage} 
                alt="PixeSci" 
                className="h-9 w-9 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                PixeSci
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => smoothScrollTo('#signup-section')}
                data-testid="button-header-signup"
              >
                Get early access
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="hidden sm:inline-flex"
                data-testid="button-talk-to-us"
              >
                <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                  Talk to Us
                </a>
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-background border-b border-border shadow-lg md:hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-2 pt-2 border-t border-border mt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    handleNavClick('#signup-section');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Get early access
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="flex-1"
                >
                  <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                    Talk to Us
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
