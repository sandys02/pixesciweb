import { Button } from "@/components/ui/button";
import logoImage from "@assets/ChatGPT Image Nov 25, 2025, 08_20_36 PM_1764120067070.png";

export function Header() {
  const handleGetStarted = () => {
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="PixeSci" className="h-8 w-8 rounded-full" />
            <span className="text-xl font-bold tracking-tight">PixeSci</span>
          </div>
          
          <div>
            <Button
              size="sm"
              onClick={handleGetStarted}
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
