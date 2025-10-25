import { Button } from "@/components/ui/button";
import { Microscope } from "lucide-react";

export function Footer() {
  const handleJoinWaitlist = () => {
    console.log("Footer Join Waitlist clicked - scrolling to form");
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-background py-12" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Microscope className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">PixeSci</span>
          </div>
          
          <p className="text-lg text-background/80">
            Making science software simple
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <a
              href="mailto:hello@pixesci.com"
              className="hover:text-accent transition-colors"
              data-testid="link-email"
            >
              hello@pixesci.com
            </a>
            <span className="hidden sm:inline text-background/40">|</span>
            <a
              href="#"
              className="hover:text-accent transition-colors"
              data-testid="link-privacy"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline text-background/40">|</span>
            <a
              href="#"
              className="hover:text-accent transition-colors"
              data-testid="link-terms"
            >
              Terms of Service
            </a>
          </div>

          <Button
            variant="outline"
            className="border-background/20 hover:bg-background/10"
            onClick={handleJoinWaitlist}
            data-testid="button-footer-join-waitlist"
          >
            Join Waitlist
          </Button>

          <p className="text-xs text-background/60 pt-6">
            © 2024 PixeSci. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
