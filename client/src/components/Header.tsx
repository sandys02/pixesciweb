import { Button } from "@/components/ui/button";

const AUTH_URL = "https://monkfish-app-woosd.ondigitalocean.app/";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">PixeSci</span>
            <span className="text-xs text-muted-foreground">™</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              data-testid="button-sign-in"
            >
              <a href={AUTH_URL}>Sign in</a>
            </Button>
            <Button
              size="sm"
              asChild
              data-testid="button-sign-up"
            >
              <a href={AUTH_URL}>Sign up</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
