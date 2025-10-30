import { Waves, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeismicIcon } from "@/components/icons/SeismicIcon";

type Risk = {
  name: string;
  level: "Basso" | "Medio" | "Alto" | "Nessuno";
  description: string;
  icon: React.ReactNode;
};

const risks: Risk[] = [
  {
    name: "Rischio Alluvione",
    level: "Basso",
    description: "L'area non si trova in una piana alluvionale designata. Monitorare i corsi d'acqua vicini durante le forti piogge.",
    icon: <Waves className="h-6 w-6" />,
  },
  {
    name: "Attività Sismica",
    level: "Nessuno",
    description: "La regione non ha una storia recente o significativa di eventi sismici.",
    icon: <SeismicIcon className="h-6 w-6" />,
  },
  {
    name: "Pericolo Vento",
    level: "Medio",
    description: "I campi aperti possono subire forti raffiche. Assicurarsi che le tende siano adeguatamente fissate.",
    icon: <Wind className="h-6 w-6" />,
  },
];

const levelVariant: Record<Risk["level"], "default" | "secondary" | "destructive"> = {
    Nessuno: "default",
    Basso: "default",
    Medio: "secondary",
    Alto: "destructive",
};

const levelClasses: Record<Risk["level"], string> = {
    Nessuno: "bg-green-100 text-green-800 border-green-200",
    Basso: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Medio: "bg-orange-100 text-orange-800 border-orange-200",
    Alto: "bg-red-100 text-red-800 border-red-200",
}

export default function EnvironmentalRisks() {
  return (
    <Card className="print-section">
      <CardHeader>
        <CardTitle>Analisi dei Rischi Ambientali</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {risks.map((risk) => (
          <Card key={risk.name} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">{risk.name}</CardTitle>
              {risk.icon}
            </CardHeader>
            <CardContent className="flex-grow">
              <Badge variant={levelVariant[risk.level]} className={levelClasses[risk.level]}>{risk.level}</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {risk.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
