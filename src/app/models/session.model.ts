import { CampDetails } from './camp.model';
import { KnotQuery, KnotResult } from './knot.model';
import { RiskAssessment } from '../services/environmental-risk.service';

export interface ScoutSession {
  id?: string;
  userId: string;
  createdAt: Date;
  camp: CampDetails;
  knotQuery?: KnotQuery;
  knotResults?: KnotResult[];
  risks?: RiskAssessment;
  notes?: string;
}
