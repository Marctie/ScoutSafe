export type UseCase = 'anchor' | 'join' | 'loop' | 'hitch' | 'binding' | 'climbing';
export type RopeCondition = 'dry' | 'wet';
export type RopeType = 'natural' | 'synthetic' | 'mixed';
export type LoadType = 'static' | 'dynamic' | 'heavy';
export type Experience = 'beginner' | 'intermediate' | 'expert';
export type Purpose = 'tent' | 'flagpole' | 'bridge' | 'tool' | 'rescue' | 'general' | 'climbing';
export type WindIntensity = 'none' | 'light' | 'medium' | 'strong';

export interface KnotQuery {
  useCase: UseCase;
  ropeCondition: RopeCondition;
  ropeType: RopeType;
  loadType: LoadType;
  experience: Experience;
  purpose: Purpose;
  windIntensity: WindIntensity;
}

export interface KnotStep {
  step: number;
  instruction: string;
}

export interface Knot {
  id: string;
  name: string;
  englishName: string;
  category: UseCase[];
  description: string;
  steps: KnotStep[];
  warnings: string[];
  bestFor: string[];
  avoidWhen: string[];
  difficulty: 'facile' | 'medio' | 'avanzato';
  worksWet: boolean;
  suitableFor: Purpose[];
  loadTypes: LoadType[];
  minExperience: Experience;
}

export interface KnotResult {
  knot: Knot;
  score: number;
  reason: string;
}
