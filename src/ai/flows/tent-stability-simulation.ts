'use server';

/**
 * @fileOverview This file defines a Genkit flow for simulating tent stability based on various parameters.
 *
 * It includes functions and types for simulating tent stability, taking into account factors like weight distribution,
 * knot types, and wind resistance to proactively identify potential risks.
 *
 * @exports tentStabilitySimulation - A function to initiate the tent stability simulation.
 * @exports TentStabilityInput - The input type for the tentStabilitySimulation function.
 * @exports TentStabilityOutput - The output type for the tentStabilitySimulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TentStabilityInputSchema = z.object({
  weightDistribution: z
    .string()
    .describe('The distribution of weight inside the tent (e.g., even, uneven).'),
  knotType: z
    .string()
    .describe('The type of knot used to secure the tent (e.g., square knot, bowline).'),
  windResistance: z
    .string()
    .describe('The level of wind resistance the tent is designed to withstand (e.g., low, medium, high).'),
  tentMaterial: z.string().describe('The material of the tent (e.g., nylon, polyester).'),
  tentSize: z.string().describe('The size of the tent (e.g., 2-person, 4-person).'),
  environmentalConditions: z
    .string()
    .describe('Description of the environmental conditions (e.g., sunny, rainy, windy).'),
});
export type TentStabilityInput = z.infer<typeof TentStabilityInputSchema>;

const TentStabilityOutputSchema = z.object({
  stabilityAssessment: z
    .string()
    .describe('An assessment of the tent stability based on the provided parameters.'),
  potentialRisks: z
    .string()
    .describe('Any potential risks identified based on the simulation.'),
  recommendations: z
    .string()
    .describe('Recommendations for improving tent stability and safety.'),
});
export type TentStabilityOutput = z.infer<typeof TentStabilityOutputSchema>;

export async function tentStabilitySimulation(input: TentStabilityInput): Promise<TentStabilityOutput> {
  return tentStabilitySimulationFlow(input);
}

const tentStabilityPrompt = ai.definePrompt({
  name: 'tentStabilityPrompt',
  input: {schema: TentStabilityInputSchema},
  output: {schema: TentStabilityOutputSchema},
  prompt: `You are an expert in tent safety and stability. Based on the provided parameters, assess the tent stability, identify potential risks, and provide recommendations for improvement.

Tent Material: {{{tentMaterial}}}
Tent Size: {{{tentSize}}}
Weight Distribution: {{{weightDistribution}}}
Knot Type: {{{knotType}}}
Wind Resistance: {{{windResistance}}}
Environmental Conditions: {{{environmentalConditions}}}

Stability Assessment: 
Potential Risks:
Recommendations: `,
});

const tentStabilitySimulationFlow = ai.defineFlow(
  {
    name: 'tentStabilitySimulationFlow',
    inputSchema: TentStabilityInputSchema,
    outputSchema: TentStabilityOutputSchema,
  },
  async input => {
    const {output} = await tentStabilityPrompt(input);
    return output!;
  }
);
