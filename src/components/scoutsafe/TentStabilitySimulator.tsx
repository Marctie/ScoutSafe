"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tent, Loader2 } from "lucide-react";
import { tentStabilitySimulation } from "@/ai/flows/tent-stability-simulation";
import type { TentStabilityInput } from "@/ai/flows/tent-stability-simulation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScoutSafe } from "@/contexts/ScoutSafeContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  tentMaterial: z.string(),
  tentSize: z.string(),
  weightDistribution: z.string(),
  knotType: z.string(),
  windResistance: z.string(),
  environmentalConditions: z.string(),
});

const formOptions = {
  tentMaterial: ['Nylon', 'Polyester', 'Canvas', 'Cuben Fiber'],
  tentSize: ['1-person', '2-person', '4-person', '6+ person'],
  weightDistribution: ['Even', 'Uneven - front heavy', 'Uneven - back heavy'],
  knotType: ['Square Knot', 'Bowline', 'Taut-line Hitch', 'Two Half Hitches'],
  windResistance: ['Low (up to 20 mph)', 'Medium (up to 30 mph)', 'High (up to 40+ mph)'],
  environmentalConditions: ['Clear skies, calm', 'Light rain, mild breeze', 'Heavy rain, strong winds', 'Snow, cold'],
};

export default function TentStabilitySimulator() {
  const [loading, setLoading] = useState(false);
  const { setTentSimResult } = useScoutSafe();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tentMaterial: 'Nylon',
      tentSize: '2-person',
      weightDistribution: 'Even',
      knotType: 'Taut-line Hitch',
      windResistance: 'Medium (up to 30 mph)',
      environmentalConditions: 'Light rain, mild breeze',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setTentSimResult(null);
    try {
      const result = await tentStabilitySimulation(values as TentStabilityInput);
      setTentSimResult(result);
      toast({
        title: "Simulation Complete",
        description: "Tent stability analysis is ready.",
      });
    } catch (error) {
      console.error("Error running simulation:", error);
      toast({
        variant: "destructive",
        title: "Simulation Error",
        description: "Could not complete the tent stability simulation.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="no-print">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tent className="text-primary" />
          Tent Stability Simulator
        </CardTitle>
        <CardDescription>
          Assess tent stability based on various parameters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(formOptions).map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${key}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formOptions[key as keyof typeof formOptions].map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simulating...
                </>
              ) : (
                "Run Simulation"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
