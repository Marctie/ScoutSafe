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
  level: "Low" | "Medium" | "High" | "None";
  description: string;
  icon: React.ReactNode;
};

const risks: Risk[] = [
  {
    name: "Flood Risk",
    level: "Low",
    description: "Area is not in a designated flood plain. Monitor nearby streams during heavy rain.",
    icon: <Waves className="h-6 w-6" />,
  },
  {
    name: "Seismic Activity",
    level: "None",
    description: "Region has no recent or significant history of seismic events.",
    icon: <SeismicIcon className="h-6 w-6" />,
  },
  {
    name: "Wind Hazard",
    level: "Medium",
    description: "Open fields may experience strong gusts. Ensure tents are properly secured.",
    icon: <Wind className="h-6 w-6" />,
  },
];

const levelVariant: Record<Risk["level"], "default" | "secondary" | "destructive"> = {
    None: "default",
    Low: "default",
    Medium: "secondary",
    High: "destructive",
};

const levelClasses: Record<Risk["level"], string> = {
    None: "bg-green-100 text-green-800 border-green-200",
    Low: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Medium: "bg-orange-100 text-orange-800 border-orange-200",
    High: "bg-red-100 text-red-800 border-red-200",
}

export default function EnvironmentalRisks() {
  return (
    <Card className="print-section">
      <CardHeader>
        <CardTitle>Environmental Risk Analysis</CardTitle>
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
