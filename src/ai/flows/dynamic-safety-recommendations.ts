'use server';

/**
 * @fileOverview An AI agent that provides dynamic safety recommendations based on simulation parameters and historical incident data.
 *
 * - generateSafetyRecommendations - A function that generates safety recommendations.
 * - SafetyRecommendationsInput - The input type for the generateSafetyRecommendations function.
 * - SafetyRecommendationsOutput - The return type for the generateSafetyRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SafetyRecommendationsInputSchema = z.object({
  simulationParameters: z
    .string()
    .describe('The parameters from the tent stability simulation.'),
  historicalIncidentData: z
    .string()
    .describe('The historical incident data for the campsite.'),
});
export type SafetyRecommendationsInput = z.infer<typeof SafetyRecommendationsInputSchema>;

const SafetyRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('The safety recommendations based on the simulation parameters and historical incident data.'),
});
export type SafetyRecommendationsOutput = z.infer<typeof SafetyRecommendationsOutputSchema>;

export async function generateSafetyRecommendations(
  input: SafetyRecommendationsInput
): Promise<SafetyRecommendationsOutput> {
  return generateSafetyRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'safetyRecommendationsPrompt',
  input: {schema: SafetyRecommendationsInputSchema},
  output: {schema: SafetyRecommendationsOutputSchema},
  prompt: `You are a safety expert specializing in providing safety recommendations for campsites.

You will use the simulation parameters and historical incident data to generate safety recommendations tailored to the specific conditions.

Simulation Parameters: {{{simulationParameters}}}
Historical Incident Data: {{{historicalIncidentData}}}

Generate safety recommendations based on the provided information. Focus on practical advice that can improve overall camp safety.
`,
});

const generateSafetyRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateSafetyRecommendationsFlow',
    inputSchema: SafetyRecommendationsInputSchema,
    outputSchema: SafetyRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
