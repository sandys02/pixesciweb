import { Button } from "@/components/ui/button";
import logoImage from "@assets/ChatGPT Image Nov 28, 2025, 09_38_22 PM_1764384089669.png";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <img src={logoImage} alt="PixeSci" className="h-10 w-10 rounded-lg" />
            <span className="text-xl font-bold tracking-tight">PixeSci</span>
          </div>
          
          <div>
            <Button
              size="sm"
              asChild
              data-testid="button-get-started"
            >
              <a href="https://web.pixesci.com">Get Started</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
