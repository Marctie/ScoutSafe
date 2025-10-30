"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Loader2 } from "lucide-react";
import { generateSafetyRecommendations } from "@/ai/flows/dynamic-safety-recommendations";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useScoutSafe } from "@/contexts/ScoutSafeContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  historicalIncidentData: z.string().min(10, "Please provide some historical data."),
});

export default function DynamicRecommendations() {
  const [loading, setLoading] = useState(false);
  const { tentSimResult, setDynamicRecResult } = useScoutSafe();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      historicalIncidentData: "Last year, a tent collapsed during a storm with 35 mph winds. Minor injuries reported. Also, had issues with campfire safety in dry conditions.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!tentSimResult) {
      toast({
        variant: "destructive",
        title: "Simulation Required",
        description: "Please run the Tent Stability Simulation first.",
      });
      return;
    }

    setLoading(true);
    setDynamicRecResult(null);

    try {
      const simulationParameters = JSON.stringify(tentSimResult, null, 2);
      const result = await generateSafetyRecommendations({
        simulationParameters,
        historicalIncidentData: values.historicalIncidentData,
      });
      setDynamicRecResult(result);
      toast({
        title: "Recommendations Generated",
        description: "AI-powered safety advice is now available.",
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate dynamic recommendations.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="no-print">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              Dynamic Recommendation Tool
            </CardTitle>
            <CardDescription>
              AI-powered advice based on simulation results and historical data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="historicalIncidentData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Incident Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe past incidents, weather events, or safety concerns..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading || !tentSimResult}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Get AI Recommendations"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
