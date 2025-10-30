import { Tent, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <div className="flex items-center justify-center mr-2">
            <Tent className="h-6 w-6 text-primary" />
            <Shield className="h-4 w-4 text-accent -ml-3 mt-2" />
          </div>
          <span className="font-bold font-headline text-lg">ScoutSafe</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost">Accedi</Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Registrati</Button>
        </div>
      </div>
    </header>
  );
}
