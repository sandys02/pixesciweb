import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import logoImage from "@assets/ChatGPT Image Nov 28, 2025, 09_38_22 PM_1764384089669.png";

const CALENDAR_URL = "https://cal.com/pixesci/30min?user=pixesci&overlayCalendar=true";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1">
            <img src={logoImage} alt="PixeSci" className="h-10 w-10 rounded-lg" />
            <span className="text-xl font-bold tracking-tight">PixeSci</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              size="sm"
              variant="outline"
              asChild
              data-testid="button-talk-to-us"
            >
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">Talk to Us</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
