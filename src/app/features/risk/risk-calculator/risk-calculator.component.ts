import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RiskService } from '../../../shared/services/risk.service';
import { TradeService } from '../../../shared/services/trade.service';
import { LucideAngularModule, Calculator } from 'lucide-angular';

@Component({
  selector: 'app-risk-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './risk-calculator.component.html'
})
export class RiskCalculatorComponent {
  @Output() close = new EventEmitter<void>();

  readonly icons = { Calculator };

  balance = 0;
  riskPercent = 0;
  riskAmount = 0;
  pointValue = 100000;
  
  entryPrice: number | null = null;
  stopLossPrice: number | null = null;
  
  calculatedLotSize: number | null = null;
  errorMessage = '';

  constructor(private riskService: RiskService, private tradeService: TradeService) {
    this.tradeService.currentBalance$.subscribe(b => {
      this.balance = b;
      this.updateRiskAmount();
    });
    const settings = this.riskService.getSettings();
    this.riskPercent = settings.riskPerTradePercent;
    this.pointValue = settings.pointValue || 100000;
    this.updateRiskAmount();
  }

  updateRiskAmount(): void {
    this.riskAmount = (this.balance * this.riskPercent) / 100;
    if (this.entryPrice !== null && this.stopLossPrice !== null) {
      this.calculateLotSize();
    }
  }

  calculateLotSize(): void {
    if (this.entryPrice === null || this.stopLossPrice === null || this.entryPrice <= 0 || this.stopLossPrice <= 0) {
      this.calculatedLotSize = null;
      this.errorMessage = '';
      return;
    }

    const priceDifference = Math.abs(this.entryPrice - this.stopLossPrice);
    if (priceDifference === 0) {
      this.errorMessage = 'Entry and Stop Loss cannot be the same.';
      this.calculatedLotSize = null;
      return;
    }

    this.errorMessage = '';
    // riskAmount = lotSize * priceDifference * pointValue
    // lotSize = riskAmount / (priceDifference * pointValue)
    const rawLotSize = this.riskAmount / (priceDifference * this.pointValue);
    
    // Round down to 2 decimal places to ensure we don't exceed max risk
    this.calculatedLotSize = Math.floor(rawLotSize * 100) / 100;

    if (this.calculatedLotSize <= 0) {
      this.errorMessage = 'Risk is too small to cover the minimum lot size (0.01).';
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
