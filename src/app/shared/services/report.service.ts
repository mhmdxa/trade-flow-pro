import { Injectable } from '@angular/core';
import { Trade } from './trade.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() { }

  async generateReport(trades: Trade[], periodLabel: string): Promise<Blob> {
    const doc = new jsPDF() as any;

    doc.setFontSize(20);
    doc.text('TradeFlow Performance Report', 14, 22);
    
    doc.setFontSize(14);
    doc.text(`Period: ${periodLabel}`, 14, 32);
    
    // Header summary facts
    const wins = trades.filter(t => (t.pnl || 0) > 0);
    const losses = trades.filter(t => (t.pnl || 0) < 0);
    const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winRate = trades.length > 0 ? (wins.length / trades.length * 100).toFixed(2) : '0.00';
    
    doc.setFontSize(12);
    doc.text(`Total Trades: ${trades.length}`, 14, 45);
    doc.text(`Win Rate: ${winRate}%`, 14, 52);
    doc.text(`Net Profit: $${totalPnl.toFixed(2)}`, 14, 59);

    const tableData = trades.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.symbol,
      t.type,
      t.lots.toString(),
      t.entryPrice.toString(),
      t.exitPrice ? t.exitPrice.toString() : '-',
      t.pnl ? `$${t.pnl.toFixed(2)}` : '-'
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Date', 'Symbol', 'Type', 'Lots', 'Entry', 'Exit', 'P/L']],
      body: tableData,
    });

    return doc.output('blob');
  }

  async generateWeeklyReport(startDate: Date, trades: Trade[]): Promise<Blob> {
    const end = new Date(startDate);
    end.setDate(end.getDate() + 6);
    
    const weekTrades = trades.filter(t => {
      const d = new Date(t.date);
      return d >= startDate && d <= end;
    });

    const label = `${startDate.toLocaleDateString()} to ${end.toLocaleDateString()}`;
    return this.generateReport(weekTrades, label);
  }

  async generateMonthlyReport(month: number, year: number, trades: Trade[]): Promise<Blob> {
    const monthTrades = trades.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const label = `${monthNames[month]} ${year}`;
    
    return this.generateReport(monthTrades, label);
  }

  exportToExcel(trades: Trade[]): void {
    const exportData = trades.map(t => ({
      Date: new Date(t.date).toLocaleString(),
      Symbol: t.symbol,
      Type: t.type,
      Lots: t.lots,
      Entry: t.entryPrice,
      Exit: t.exitPrice || '',
      PnL: t.pnl || '',
      Notes: t.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trades');
    
    XLSX.writeFile(workbook, 'TradeFlow_All_Trades.xlsx');
  }
}
