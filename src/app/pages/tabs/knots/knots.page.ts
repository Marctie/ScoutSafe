import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnotRecommendationService } from '../../../services/knot-recommendation.service';
import { KnotResult, KnotQuery } from '../../../models/knot.model';

export let lastKnotResults: KnotResult[] = [];
export let lastKnotQuery: KnotQuery | null = null;

@Component({
  selector: 'app-knots',
  templateUrl: './knots.page.html',
  styleUrls: ['./knots.page.scss'],
  standalone: false
})
export class KnotsPage {
  private fb = inject(FormBuilder);
  private knotSvc = inject(KnotRecommendationService);

  form: FormGroup;
  results: KnotResult[] = [];
  searched = false;
  expandedKnot: string | null = null;

  constructor() {
    this.form = this.fb.group({
      useCase: ['anchor', Validators.required],
      ropeCondition: ['dry', Validators.required],
      ropeType: ['synthetic', Validators.required],
      loadType: ['static', Validators.required],
      experience: ['beginner', Validators.required],
      purpose: ['tent', Validators.required],
      windIntensity: ['none', Validators.required]
    });
  }

  search() {
    if (this.form.invalid) return;
    const query = this.form.value as KnotQuery;
    this.results = this.knotSvc.getRecommendations(query);
    lastKnotResults = this.results;
    lastKnotQuery = query;
    this.searched = true;
    this.expandedKnot = this.results[0]?.knot.id ?? null;
  }

  toggle(id: string) {
    this.expandedKnot = this.expandedKnot === id ? null : id;
  }

  scoreColor(score: number): string {
    if (score >= 70) return '#2dd36f';
    if (score >= 40) return '#ffc409';
    return '#eb445a';
  }

  difficultyColor(d: string): string {
    return d === 'facile' ? '#2dd36f' : d === 'medio' ? '#ffc409' : '#eb445a';
  }
}
