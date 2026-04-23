import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Trade } from '../../../shared/services/trade.service';
import { LucideAngularModule, Edit2, Plus } from 'lucide-angular';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-trade-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './trade-modal.component.html'
})
export class TradeModalComponent implements OnInit {
  @Input() editTrade: Trade | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Trade>();

  readonly icons = { Edit2, Plus };

  tradeForm: FormGroup;
  
  // Autocomplete suggestions
  suggestions = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'US30', 'BTCUSD', 'ETHUSD', 'NAS100', 'USOIL', 'AUDUSD'];

  constructor(private fb: FormBuilder, public i18n: I18nService) {
    this.tradeForm = this.fb.group({
      date: [new Date().toISOString().substring(0, 16), Validators.required],
      symbol: ['EURUSD', Validators.required],
      type: ['Buy', Validators.required],
      lots: [0.1, [Validators.required, Validators.min(0.01)]],
      // No negative values allowed via Validators.min(0)
      entryPrice: [null, [Validators.required, Validators.min(0)]],
      exitPrice: [null, Validators.min(0)],
      stopLoss: [null, Validators.min(0)],
      takeProfit: [null, Validators.min(0)],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.editTrade) {
      this.tradeForm.patchValue({
        ...this.editTrade,
        date: new Date(this.editTrade.date).toISOString().substring(0, 16)
      });
    }
  }

  t(key: string): string { return this.i18n.t(key); }

  onSubmit(): void {
    if (this.tradeForm.valid) {
      this.save.emit({
        ...this.tradeForm.value,
        symbol: this.tradeForm.value.symbol.toUpperCase(), // coerce uppercase on save
        id: this.editTrade?.id,
        date: new Date().toISOString()
      } as Trade);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
