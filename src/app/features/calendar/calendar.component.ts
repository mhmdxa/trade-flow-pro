import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradeService, Trade } from '../../shared/services/trade.service';
import { LucideAngularModule, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Target, ListFilter } from 'lucide-angular';
import { I18nService } from '../../core/services/i18n.service';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  trades: Trade[];
  totalPnl: number;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [DatePipe],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  days: CalendarDay[] = [];
  selectedDay: CalendarDay | null = null;
  
  weekStats = {
    totalPnl: 0,
    bestDay: { name: '', pnl: 0 },
    worstDay: { name: '', pnl: 0 }
  };

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  readonly icons = { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Target, ListFilter };

  constructor(
    private tradeService: TradeService, 
    private datePipe: DatePipe,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
  }

  t(key: string): string { return this.i18n.t(key); }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const grid: CalendarDay[] = [];
    
    this.tradeService.getTrades().subscribe(allTrades => {
      let tempDate = new Date(startDate);
      
      for(let i=0; i<42; i++) {
        const d = new Date(tempDate);
        
        const dayTrades = allTrades.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getFullYear() === d.getFullYear() && 
                 tDate.getMonth() === d.getMonth() && 
                 tDate.getDate() === d.getDate();
        });

        const totalPnl = dayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

        grid.push({
          date: d,
          isCurrentMonth: d.getMonth() === month,
          trades: dayTrades,
          totalPnl
        });
        
        tempDate.setDate(tempDate.getDate() + 1);
      }
      
      this.days = grid;
      
      const today = new Date();
      if(today.getMonth() === month && today.getFullYear() === year) {
        this.selectedDay = this.days.find(day => day.date.getDate() === today.getDate() && day.isCurrentMonth) || null;
      } else {
        this.selectedDay = this.days.find(d => d.date.getDate() === 1 && d.isCurrentMonth) || null;
      }
      
      this.calculateWeekStats(allTrades);
    }).unsubscribe();
  }

  selectDay(day: CalendarDay): void {
    this.selectedDay = day;
  }

  getCurrenciesTraded(trades: Trade[]): string {
    const symbols = Array.from(new Set(trades.map(t => t.symbol)));
    return symbols.join(', ') || 'N/A';
  }

  getWinRate(trades: Trade[]): number {
    if(trades.length === 0) return 0;
    const wins = trades.filter(t => (t.pnl || 0) > 0).length;
    return (wins / trades.length) * 100;
  }

  private calculateWeekStats(allTrades: Trade[]): void {
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    sunday.setHours(0,0,0,0);
    
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23,59,59,999);

    const weekTrades = allTrades.filter(t => {
      const d = new Date(t.date);
      return d >= sunday && d <= saturday;
    });

    let bestPnl = -Infinity;
    let worstPnl = Infinity;
    let bDay = '';
    let wDay = '';
    let wTotal = 0;

    const dayAggregation: Record<string, number> = {};
    weekTrades.forEach(t => {
      const dayName = new Date(t.date).toLocaleDateString('en-US', {weekday: 'long'});
      dayAggregation[dayName] = (dayAggregation[dayName] || 0) + (t.pnl || 0);
      wTotal += (t.pnl || 0);
    });

    for(let day in dayAggregation) {
      if(dayAggregation[day] > bestPnl) {
        bestPnl = dayAggregation[day];
        bDay = day;
      }
      if(dayAggregation[day] < worstPnl) {
        worstPnl = dayAggregation[day];
        wDay = day;
      }
    }

    this.weekStats = {
      totalPnl: wTotal,
      bestDay: { name: bDay || '-', pnl: bestPnl === -Infinity ? 0 : bestPnl },
      worstDay: { name: wDay || '-', pnl: worstPnl === Infinity ? 0 : worstPnl }
    };
  }
}
