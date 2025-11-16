import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        const hasSignedUp = sessionStorage.getItem("waitlist_signup");
        if (!hasSignedUp) {
          setIsOpen(true);
          setHasShown(true);
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  const handleJoinWaitlist = () => {
    setIsOpen(false);
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-exit-intent">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Before You Go...
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p className="text-base">
              Join <strong>thousands of researchers</strong> who are tired of fighting with software.
            </p>
            <p className="text-muted-foreground">
              Get early access to PixeSci™ and be among the first to experience AI-powered scientific workflows.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
            data-testid="button-exit-close"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleJoinWaitlist}
            className="flex-1 bg-success hover:bg-success/90"
            data-testid="button-exit-join"
          >
            Join Waitlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
