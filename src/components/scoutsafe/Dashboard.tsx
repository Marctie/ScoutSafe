import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import CampSetup from '@/components/scoutsafe/CampSetup';
import MapView from '@/components/scoutsafe/MapView';
import EnvironmentalRisks from '@/components/scoutsafe/EnvironmentalRisks';
import TentStabilitySimulator from '@/components/scoutsafe/TentStabilitySimulator';
import DynamicRecommendations from '@/components/scoutsafe/DynamicRecommendations';
import SafetyReport from '@/components/scoutsafe/SafetyReport';

export default function Dashboard() {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:grid grid-cols-1 gap-6 lg:grid-cols-3 print-container">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <CampSetup />
          <TentStabilitySimulator />
          <DynamicRecommendations />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="h-96 no-print">
            <CardContent className="p-0 h-full rounded-lg overflow-hidden">
              <MapView />
            </CardContent>
          </Card>
          <EnvironmentalRisks />
          <SafetyReport />
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
         <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3 no-print">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>
          <TabsContent value="setup" className="space-y-6 mt-6">
            <CampSetup />
            <Card className="h-96">
                <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                <MapView />
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analysis" className="space-y-6 mt-6">
            <TentStabilitySimulator />
            <EnvironmentalRisks />
            <DynamicRecommendations />
          </TabsContent>
          <TabsContent value="report" className="mt-6">
            <SafetyReport />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
