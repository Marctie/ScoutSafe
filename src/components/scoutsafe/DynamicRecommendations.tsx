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
  historicalIncidentData: z.string().min(10, "Fornisci alcuni dati storici."),
});

export default function DynamicRecommendations() {
  const [loading, setLoading] = useState(false);
  const { tentSimResult, setDynamicRecResult } = useScoutSafe();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      historicalIncidentData: "L'anno scorso, una tenda è crollata durante una tempesta con venti a 35 mph. Segnalati feriti lievi. Inoltre, problemi con la sicurezza dei falò in condizioni di siccità.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!tentSimResult) {
      toast({
        variant: "destructive",
        title: "Simulazione Richiesta",
        description: "Esegui prima la Simulazione della Stabilità della Tenda.",
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
        title: "Raccomandazioni Generate",
        description: "I consigli di sicurezza basati sull'IA sono ora disponibili.",
      });
    } catch (error) {
      console.error("Errore nella generazione delle raccomandazioni:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile generare le raccomandazioni dinamiche.",
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
              Strumento di Raccomandazione Dinamica
            </CardTitle>
            <CardDescription>
              Consigli basati sull'IA in base ai risultati della simulazione e ai dati storici.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="historicalIncidentData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dati Storici degli Incidenti</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrivi incidenti passati, eventi meteorologici o problemi di sicurezza..."
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
                  Generazione...
                </>
              ) : (
                "Ottieni Raccomandazioni IA"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
