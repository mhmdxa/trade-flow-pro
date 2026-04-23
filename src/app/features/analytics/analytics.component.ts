import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { Trade } from '../../shared/services/trade.service';
import { Observable } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { LucideAngularModule, PieChart, Activity, Briefcase, TrendingUp, Info } from 'lucide-angular';
import { I18nService } from '../../core/services/i18n.service';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dayOfWeekChart') dayOfWeekChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('sessionChart') sessionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('symbolChart') symbolChartRef!: ElementRef<HTMLCanvasElement>;

  winRate$: Observable<number>;
  profitFactor$: Observable<number>;
  avgWinLoss$: Observable<{avgWin: number, avgLoss: number}>;
  maxDrawdown$: Observable<number>;
  maxConsLosses$: Observable<number>;
  sharpeRatio$: Observable<number>;
  expectancy$: Observable<number>;
  avgRMultiple$: Observable<number>;
  bestWorstTrades$: Observable<{best: Trade[], worst: Trade[]}>;

  private charts: Chart[] = [];
  readonly icons = { PieChart, Activity, Briefcase, TrendingUp, Info };

  constructor(
    private analyticsService: AnalyticsService,
    public i18n: I18nService
  ) {
    this.winRate$ = this.analyticsService.getWinRate();
    this.profitFactor$ = this.analyticsService.getProfitFactor();
    this.avgWinLoss$ = this.analyticsService.getAverageWinLoss();
    this.maxConsLosses$ = this.analyticsService.getMaxConsecutiveLosses();
    this.sharpeRatio$ = this.analyticsService.getSharpeRatio();
    this.expectancy$ = this.analyticsService.getExpectancy();
    this.avgRMultiple$ = this.analyticsService.getAverageRMultiple();
    this.bestWorstTrades$ = this.analyticsService.getBestWorstTrades();
    
    this.maxDrawdown$ = new Observable(sub => sub.next(8.5));
  }

  ngOnInit(): void {}

  t(key: string): string { return this.i18n.t(key); }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 500);
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  private initCharts(): void {
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || '#ffd700';

    this.analyticsService.getPerformanceByDayOfWeek().subscribe(data => {
      if (this.dayOfWeekChartRef) {
        this.charts.push(new Chart(this.dayOfWeekChartRef.nativeElement, {
          type: 'bar',
          data: {
            labels: data.map(d => d.day),
            datasets: [{
              label: 'Profit ($)',
              data: data.map(d => d.profit),
              backgroundColor: data.map(d => d.profit >= 0 ? '#00ff88' : '#ff4444'),
              borderRadius: 8
            }]
          },
          options: this.getChartOptions()
        }));
      }
    });

    this.analyticsService.getPerformanceBySession().subscribe(data => {
      if (this.sessionChartRef) {
        this.charts.push(new Chart(this.sessionChartRef.nativeElement, {
          type: 'doughnut',
          data: {
            labels: data.map(d => d.session),
            datasets: [{
              data: data.map(d => Math.abs(d.profit)),
              backgroundColor: [accentColor, '#00ff88', '#ff4444'],
              borderWidth: 0,
              hoverOffset: 15
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: { 
              legend: { 
                position: 'bottom', 
                labels: { 
                  color: 'rgba(255,255,255,0.6)', 
                  padding: 20, 
                  font: { size: 10, weight: 'bold' },
                  usePointStyle: true
                } 
              } 
            }
          }
        }));
      }
    });

    this.analyticsService.getPerformanceBySymbol().subscribe(data => {
      if (this.symbolChartRef) {
        this.charts.push(new Chart(this.symbolChartRef.nativeElement, {
          type: 'bar',
          data: {
            labels: data.map(d => d.symbol),
            datasets: [{
              label: 'P/L ($)',
              data: data.map(d => d.profit),
              backgroundColor: accentColor,
              borderRadius: 8
            }]
          },
          options: this.getChartOptions()
        }));
      }
    });
  }

  private getChartOptions(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } } }
      }
    };
  }
}
