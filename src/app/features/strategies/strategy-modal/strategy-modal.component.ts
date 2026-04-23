import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Strategy } from '../../../shared/services/strategy.service';
import { I18nService } from '../../../core/services/i18n.service';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-strategy-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './strategy-modal.component.html'
})
export class StrategyModalComponent implements OnInit {
  @Input() editStrategy: Strategy | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Strategy>();

  strategyForm: FormGroup;
  types = ['Scalping', 'Daytrading', 'Swing'];
  timeframes = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1', 'W1'];
  readonly icons = { X };

  constructor(private fb: FormBuilder, public i18n: I18nService) {
    this.strategyForm = this.fb.group({
      name: ['', Validators.required],
      type: ['Daytrading', Validators.required],
      timeframe: ['H1', Validators.required],
      indicators: [''],
      entryRules: ['', Validators.required],
      exitRules: ['', Validators.required],
      riskReward: ['1:2'],
      winRate: [null, [Validators.min(0), Validators.max(100)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.editStrategy) {
      this.strategyForm.patchValue({ ...this.editStrategy });
    }
  }

  t(key: string): string { return this.i18n.t(key); }

  onSubmit(): void {
    if (this.strategyForm.valid) {
      this.save.emit(this.strategyForm.value as Strategy);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
