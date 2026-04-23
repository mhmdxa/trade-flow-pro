import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { TradeService, Trade } from '../../shared/services/trade.service';
import { RiskService, RiskSettings } from '../../shared/services/risk.service';
import { I18nService } from '../../core/services/i18n.service';
import { Observable, Subscription, map } from 'rxjs';
import { LucideAngularModule, DollarSign, Target, TrendingDown, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-angular';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { TRADEFLOW_ASSETS } from '../../shared/assets/assets-data';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('equityChartCanvas') equityChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chart: Chart | undefined;
  currentUser$: Observable<User | null>;
  recentTrades$: Observable<Trade[]>;
  allTrades$: Observable<Trade[]>;
  
  balance$: Observable<number>;
  dailyLoss$: Observable<number>;
  isDailyLossExceeded$: Observable<boolean>;
  isDrawdownExceeded$: Observable<boolean>;
  riskSettings$: Observable<RiskSettings>;

  target = 2000.00;
  countdown = '00:00:00';
  
  private timerInterval: any;
  private subs: Subscription = new Subscription();

  readonly icons = { DollarSign, Target, TrendingDown, AlertTriangle, ArrowUpRight, ArrowDownRight };
  
  // Luxury SVG Icons
  walletSvg: SafeHtml;

  constructor(
    private authService: AuthService,
    private tradeService: TradeService,
    private riskService: RiskService,
    public i18n: I18nService,
    private sanitizer: DomSanitizer
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.allTrades$ = this.tradeService.getTrades();
    this.recentTrades$ = this.allTrades$.pipe(map(trades => [...trades].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)));
    
    this.balance$ = this.tradeService.currentBalance$;
    this.dailyLoss$ = this.tradeService.dailyLoss$;
    this.isDailyLossExceeded$ = this.tradeService.isDailyLossExceeded$;
    this.isDrawdownExceeded$ = this.tradeService.isDrawdownExceeded$;
    this.riskSettings$ = this.riskService.settings$;

    this.walletSvg = this.sanitizer.bypassSecurityTrustHtml(TRADEFLOW_ASSETS.WALLET_GOLD);
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  ngAfterViewInit(): void {
    this.initChart();
    
    this.subs.add(
      this.allTrades$.subscribe(trades => {
        if(this.chart) {
          this.updateChartData(trades);
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.subs.unsubscribe();
    if (this.chart) this.chart.destroy();
  }

  t(key: string): string { return this.i18n.t(key); }

  getDailyLossPct(loss: number, settings: RiskSettings): number {
    const limit = settings.initialBalance * (settings.dailyLossLimitPercent / 100);
    return limit > 0 ? Math.min((loss / limit) * 100, 100) : 0;
  }

  getDrawdownPct(balance: number, settings: RiskSettings): number {
    const highest = this.tradeService.highestBalance;
    if (balance >= highest) return 0;
    const currentDdAmount = highest - balance;
    const maxDdAmount = settings.initialBalance * (settings.maxDrawdownLimitPercent / 100);
    return maxDdAmount > 0 ? Math.min((currentDdAmount / maxDdAmount) * 100, 100) : 0;
  }

  getTargetPct(balance: number, settings: RiskSettings): number {
    const profit = balance - settings.initialBalance;
    if (profit <= 0) return 0;
    return Math.min((profit / this.target) * 100, 100);
  }

  getDailyLossLimit(settings: RiskSettings): number {
    return settings.initialBalance * (settings.dailyLossLimitPercent / 100);
  }
  
  getMaxDrawdownLimit(settings: RiskSettings): number {
    return settings.initialBalance * (settings.maxDrawdownLimitPercent / 100);
  }

  private startCountdown(): void {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.countdown = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  private initChart(): void {
    const ctx = this.equityChartCanvas?.nativeElement.getContext('2d');
    if (!ctx) return;

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || '#ffd700';

    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, accentColor + '40'); // 25% opacity
    gradient.addColorStop(1, accentColor + '00'); // 0% opacity

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Equity',
          data: [],
          borderColor: accentColor,
          backgroundColor: gradient,
          borderWidth: 3,
          pointBackgroundColor: '#0a0a2a',
          pointBorderColor: accentColor,
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(11, 17, 33, 0.95)',
            titleColor: accentColor,
            bodyColor: '#fff',
            borderColor: accentColor + '40',
            borderWidth: 1,
            padding: 12,
            titleFont: { size: 14, weight: 'bold' }
          }
        },
        scales: {
          x: { display: false },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#6b7280', font: { size: 11 } }
          }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChartData(trades: Trade[]): void {
    if(!this.chart) return;
    
    let initialBal = 100000;
    this.riskSettings$.subscribe(settings => initialBal = settings.initialBalance).unsubscribe();
    
    let currentBalance = initialBal;
    const dates = ['Start'];
    const balances = [initialBal];
    
    const sortedTrades = [...trades].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for(const trade of sortedTrades) {
      if(trade.pnl !== undefined && trade.pnl !== null) {
        currentBalance += trade.pnl;
        const d = new Date(trade.date);
        dates.push(`${d.getMonth()+1}/${d.getDate()}`);
        balances.push(currentBalance);
      }
    }

    if(balances.length === 1 && trades.length === 0) {
        dates.push('Jan', 'Feb', 'Mar', 'Apr', 'May');
        balances.push(initialBal, initialBal+1200, initialBal+800, initialBal+2500, initialBal+3200);
    }

    this.chart.data.labels = dates;
    this.chart.data.datasets[0].data = balances;
    this.chart.update();
  }
}
