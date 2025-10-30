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

const formLabels: { [key: string]: string } = {
  tentMaterial: 'Materiale della Tenda',
  tentSize: 'Dimensioni della Tenda',
  weightDistribution: 'Distribuzione del Peso',
  knotType: 'Tipo di Nodo',
  windResistance: 'Resistenza al Vento',
  environmentalConditions: 'Condizioni Ambientali',
};

const formOptions = {
  tentMaterial: ['Nylon', 'Poliestere', 'Tela', 'Fibra di Cuben'],
  tentSize: ['1 persona', '2 persone', '4 persone', '6+ persone'],
  weightDistribution: ['Uniforme', 'Non uniforme - pesante davanti', 'Non uniforme - pesante dietro'],
  knotType: ['Nodo piano', 'Gassa d\'amante', 'Nodo autobloccante', 'Due mezzi colli'],
  windResistance: ['Bassa (fino a 32 km/h)', 'Media (fino a 48 km/h)', 'Alta (fino a 64+ km/h)'],
  environmentalConditions: ['Cielo sereno, calmo', 'Pioggia leggera, brezza mite', 'Pioggia intensa, venti forti', 'Neve, freddo'],
};

export default function TentStabilitySimulator() {
  const [loading, setLoading] = useState(false);
  const { setTentSimResult } = useScoutSafe();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tentMaterial: 'Nylon',
      tentSize: '2 persone',
      weightDistribution: 'Uniforme',
      knotType: 'Nodo autobloccante',
      windResistance: 'Media (fino a 48 km/h)',
      environmentalConditions: 'Pioggia leggera, brezza mite',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setTentSimResult(null);
    try {
      const result = await tentStabilitySimulation(values as TentStabilityInput);
      setTentSimResult(result);
      toast({
        title: "Simulazione Completata",
        description: "L'analisi della stabilità della tenda è pronta.",
      });
    } catch (error) {
      console.error("Errore durante l'esecuzione della simulazione:", error);
      toast({
        variant: "destructive",
        title: "Errore di Simulazione",
        description: "Impossibile completare la simulazione della stabilità della tenda.",
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
          Simulatore di Stabilità della Tenda
        </CardTitle>
        <CardDescription>
          Valuta la stabilità della tenda in base a vari parametri.
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
                      <FormLabel>{formLabels[key]}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Seleziona ${formLabels[key].toLowerCase()}`} />
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
                  Simulazione in corso...
                </>
              ) : (
                "Esegui Simulazione"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
