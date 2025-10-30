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
  campName: z.string().min(3, "Camp name must be at least 3 characters."),
  lat: z.coerce.number().min(-90).max(90, "Latitude must be between -90 and 90."),
  lng: z.coerce.number().min(-180).max(180, "Longitude must be between -180 and 180."),
});

export default function CampSetup() {
  const { setCampDetails } = useScoutSafe();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campName: "Pine Ridge Camp",
      lat: 40.7128,
      lng: -74.006,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setCampDetails(values);
    toast({
      title: "Camp Updated",
      description: `${values.campName} location has been set on the map.`,
    });
  }

  return (
    <Card className="no-print">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="text-primary" />
          Camp Setup
        </CardTitle>
        <CardDescription>
          Enter your camp's details to get started.
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
                  <FormLabel>Camp Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Whispering Pines" {...field} />
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
                    <FormLabel>Latitude</FormLabel>
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
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Update Camp Location
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
