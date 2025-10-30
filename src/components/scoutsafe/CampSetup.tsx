"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { useScoutSafe } from "@/contexts/ScoutSafeContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  campName: z.string().min(3, "Il nome del campo deve contenere almeno 3 caratteri."),
  lat: z.coerce.number().min(-90, "La latitudine deve essere compresa tra -90 e 90.").max(90, "La latitudine deve essere compresa tra -90 e 90."),
  lng: z.coerce.number().min(-180, "La longitudine deve essere compresa tra -180 e 180.").max(180, "La longitudine deve essere compresa tra -180 e 180."),
});

export default function CampSetup() {
  const { setCampDetails } = useScoutSafe();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campName: "Campo di Poggio dei Pini",
      lat: 40.7128,
      lng: -74.006,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setCampDetails(values);
    toast({
      title: "Campo Aggiornato",
      description: `La posizione del campo ${values.campName} è stata impostata sulla mappa.`,
    });
  }

  return (
    <Card className="no-print">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="text-primary" />
          Impostazione Campo
        </CardTitle>
        <CardDescription>
          Inserisci i dettagli del tuo campo per iniziare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="campName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome del Campo</FormLabel>
                  <FormControl>
                    <Input placeholder="Es., Pineta Silenziosa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitudine</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitudine</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Aggiorna Posizione Campo
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
