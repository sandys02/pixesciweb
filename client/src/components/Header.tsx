import logoImage from "@assets/ChatGPT Image Nov 28, 2025, 06_57_34 PM_1764375519241.png";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="PixeSci" className="h-8 w-8 rounded-lg" />
            <span className="text-xl font-bold tracking-tight">PixeSci</span>
          </div>
        </div>
      </div>
    </header>
  );
}
