import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Edit2, Trash2, Download, Search, Calculator, AlertTriangle, RefreshCw } from 'lucide-angular';
import { TradeService, Trade } from '../../shared/services/trade.service';
import { TradeModalComponent } from './trade-modal/trade-modal.component';
import { RiskCalculatorComponent } from '../risk/risk-calculator/risk-calculator.component';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { Observable, map, BehaviorSubject, combineLatest } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-trades',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, TradeModalComponent, RiskCalculatorComponent],
  templateUrl: './trades.component.html'
})
export class TradesComponent implements OnInit {
  trades$: Observable<Trade[]>;
  filteredTrades$: Observable<Trade[]>;
  isDailyLossExceeded$: Observable<boolean>;

  private searchSubject = new BehaviorSubject<string>('');
  private typeSubject = new BehaviorSubject<string>('All');

  showModal = false;
  showCalcModal = false;
  tradeToEdit: Trade | null = null;

  searchText = '';
  typeFilter = 'All';

  readonly icons = { Plus, Edit2, Trash2, Download, Search, Calculator, AlertTriangle, RefreshCw };

  constructor(
    private tradeService: TradeService,
    public i18n: I18nService,
    private toast: ToastService
  ) {
    this.trades$ = this.tradeService.getTrades();
    this.isDailyLossExceeded$ = this.tradeService.isDailyLossExceeded$;

    // Use combineLatest to ensure UI updates whenever data or filters change
    this.filteredTrades$ = combineLatest([
      this.trades$,
      this.searchSubject,
      this.typeSubject
    ]).pipe(
      map(([trades, search, type]) => {
        return trades.filter(t => {
          const q = search.toLowerCase();
          const matchesSearch = !q || 
            t.symbol.toLowerCase().includes(q) || 
            (t.notes && t.notes.toLowerCase().includes(q));
          const matchesType = type === 'All' || t.type === type;
          return matchesSearch && matchesType;
        });
      })
    );
  }

  ngOnInit(): void {}

  t(key: string): string { return this.i18n.t(key); }

  applyFilters(): void {
    this.searchSubject.next(this.searchText);
    this.typeSubject.next(this.typeFilter);
  }

  getTotalPnl(trades: Trade[]): number {
    return trades.reduce((s, t) => s + (t.pnl ?? 0), 0);
  }

  getWinRate(trades: Trade[]): number {
    const closed = trades.filter(t => t.pnl !== undefined);
    if (!closed.length) return 0;
    return Math.round((closed.filter(t => (t.pnl ?? 0) > 0).length / closed.length) * 100);
  }

  openCalcModal(): void { this.showCalcModal = true; }
  closeCalcModal(): void { this.showCalcModal = false; }

  openModal(trade: Trade | null = null): void {
    this.tradeToEdit = trade;
    this.showModal = true;
  }

  closeModal(): void { 
    this.showModal = false; 
    this.tradeToEdit = null; 
  }

  saveTrade(trade: Trade): void {
    if (this.tradeToEdit) {
      this.tradeService.updateTrade(this.tradeToEdit.id, trade).subscribe(() => {
        this.toast.show(this.t('alert.trade.updated'), 'info');
      });
    } else {
      this.tradeService.addTrade(trade).subscribe(() => {
        this.toast.show(this.t('alert.trade.added'), 'success');
      });
    }
    this.closeModal();
  }

  deleteTrade(id: string): void {
    if (confirm(this.t('common.confirm'))) {
      this.tradeService.deleteTrade(id).subscribe(() => {
        this.toast.show(this.t('alert.trade.deleted'), 'warning');
      });
    }
  }

  refresh(): void {
    this.applyFilters();
  }

  exportToPDF(): void {
    this.filteredTrades$.subscribe(trades => {
      const doc = new jsPDF();
      const dateStr = new Date().toISOString().split('T')[0];
      
      doc.setFontSize(18);
      doc.text(`TradeFlow Pro - Performance Report (${dateStr})`, 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      const totalPnl = this.getTotalPnl(trades);
      const winRate = this.getWinRate(trades);
      doc.text(`Total Trades: ${trades.length} | Net P&L: $${totalPnl} | Win Rate: ${winRate}%`, 14, 30);
      
      const tableData = trades.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.symbol,
        t.type,
        t.lots.toString(),
        t.entryPrice.toString(),
        t.exitPrice ? t.exitPrice.toString() : '-',
        t.pnl ? `$${t.pnl}` : '-'
      ]);

      autoTable(doc, {
        startY: 36,
        head: [['Date', 'Symbol', 'Type', 'Lots', 'Entry', 'Exit', 'P&L']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`TradeFlow_Report_${dateStr}.pdf`);
    }).unsubscribe();
  }
}
