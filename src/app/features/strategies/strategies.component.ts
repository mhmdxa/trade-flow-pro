import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Edit2, Trash2, Crosshair, Clock, Search, TrendingUp, BarChart2, Target, BookOpen } from 'lucide-angular';
import { StrategyService, Strategy } from '../../shared/services/strategy.service';
import { StrategyModalComponent } from './strategy-modal/strategy-modal.component';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { Observable, map, combineLatest, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-strategies',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, StrategyModalComponent],
  templateUrl: './strategies.component.html'
})
export class StrategiesComponent implements OnInit {
  strategies$: Observable<Strategy[]>;
  filteredStrategies$: Observable<Strategy[]>;

  showModal = false;
  strategyToEdit: Strategy | null = null;
  searchText = '';
  typeFilter = 'All';

  private searchSubject = new BehaviorSubject<string>('');
  private typeSubject = new BehaviorSubject<string>('All');

  readonly icons = { Plus, Edit2, Trash2, Crosshair, Clock, Search, TrendingUp, BarChart2, Target, BookOpen };
  readonly types = ['All', 'Scalping', 'Daytrading', 'Swing'];

  constructor(
    private strategyService: StrategyService,
    public i18n: I18nService,
    private toast: ToastService
  ) {
    this.strategies$ = this.strategyService.getStrategies();
    this.filteredStrategies$ = combineLatest([
      this.strategies$,
      this.searchSubject,
      this.typeSubject
    ]).pipe(
      map(([strategies, search, type]) =>
        strategies.filter(s => {
          const q = search.toLowerCase();
          const matchesSearch = !q ||
            s.name.toLowerCase().includes(q) ||
            s.indicators?.toLowerCase().includes(q) ||
            s.entryRules?.toLowerCase().includes(q);
          const matchesType = type === 'All' || s.type === type;
          return matchesSearch && matchesType;
        })
      )
    );
  }

  ngOnInit(): void {}

  t(key: string): string { return this.i18n.t(key); }

  onSearch(): void { this.searchSubject.next(this.searchText); }
  onTypeFilter(type: string): void {
    this.typeFilter = type;
    this.typeSubject.next(type);
  }

  openModal(strategy: Strategy | null = null): void {
    this.strategyToEdit = strategy;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.strategyToEdit = null;
  }

  saveStrategy(strategy: Strategy): void {
    if (this.strategyToEdit) {
      this.strategyService.updateStrategy(this.strategyToEdit.id, strategy);
      this.toast.show(this.t('alert.trade.updated'), 'info');
    } else {
      this.strategyService.addStrategy(strategy);
      this.toast.show(this.t('alert.trade.added'), 'success');
    }
    this.closeModal();
  }

  deleteStrategy(id: string): void {
    if (confirm(this.t('common.confirm'))) {
      this.strategyService.deleteStrategy(id);
      this.toast.show(this.t('alert.trade.deleted'), 'warning');
    }
  }

  getTypeColor(type: string): string {
    switch(type) {
      case 'Scalping': return '#22d3ee';
      case 'Daytrading': return '#ffd700';
      case 'Swing': return '#00ff88';
      default: return '#ffffff';
    }
  }
}
