import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RiskService, RiskSettings } from '../../../shared/services/risk.service';
import { LucideAngularModule, ShieldAlert, Save, RefreshCw } from 'lucide-angular';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-risk-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './risk-settings.component.html'
})
export class RiskSettingsComponent implements OnInit {
  riskForm: FormGroup;
  showSuccess = false;
  readonly icons = { ShieldAlert, Save, RefreshCw };

  constructor(
    private fb: FormBuilder, 
    private riskService: RiskService,
    public i18n: I18nService
  ) {
    this.riskForm = this.fb.group({
      initialBalance: [100000, [Validators.required, Validators.min(0)]],
      dailyLossLimitPercent: [5, [Validators.required, Validators.min(0), Validators.max(100)]],
      maxDrawdownLimitPercent: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
      riskPerTradePercent: [1, [Validators.required, Validators.min(0), Validators.max(100)]],
      pointValue: [10, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const settings = this.riskService.getSettings();
    this.riskForm.patchValue(settings);
  }

  t(key: string): string { return this.i18n.t(key); }

  saveSettings(): void {
    if (this.riskForm.valid) {
      this.riskService.updateSettings(this.riskForm.value as RiskSettings).subscribe(() => {
        this.showSuccess = true;
        setTimeout(() => this.showSuccess = false, 3000);
      });
    }
  }
}
