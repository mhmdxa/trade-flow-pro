import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, HelpCircle, PlusCircle, BarChart2, Calendar, ShieldCheck, Download } from 'lucide-angular';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto space-y-12 animate-fade-in" style="color:#ffffff">
      <header class="text-center space-y-4">
        <div class="w-16 h-16 bg-var(--theme-accent)/10 rounded-3xl flex items-center justify-center mx-auto shadow-gold">
          <lucide-angular [img]="icons.HelpCircle" class="w-8 h-8 text-var(--theme-accent)"></lucide-angular>
        </div>
        <h1 class="text-4xl font-black tracking-tighter uppercase">{{ t('nav.guide') }}</h1>
        <p class="text-white/40 font-bold uppercase tracking-widest text-xs">Master your institutional trading environment</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Step 1 -->
        <div class="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4 hover:border-var(--theme-accent)/30 transition-all group">
          <lucide-angular [img]="icons.PlusCircle" class="w-8 h-8 text-var(--theme-accent)"></lucide-angular>
          <h3 class="text-xl font-black uppercase tracking-tight">1. Log Daily trades</h3>
          <p class="text-sm text-white/60 leading-relaxed">
            {{ i18n.currentLang === 'ar' ? 'قم بإضافة صفقاتك يدوياً عبر زر "إضافة صفقة" في سجل الصفقات. أدخل نقطة الدخول والخروج وحجم العقد.' : 'Manually log your executions via the "Add Trade" button in the Ledger. Input entry, exit, and volume metrics.' }}
          </p>
        </div>

        <!-- Step 2 -->
        <div class="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4 hover:border-var(--theme-accent)/30 transition-all group">
          <lucide-angular [img]="icons.ShieldCheck" class="w-8 h-8 text-var(--theme-accent)"></lucide-angular>
          <h3 class="text-xl font-black uppercase tracking-tight">2. Risk Guard</h3>
          <p class="text-sm text-white/60 leading-relaxed">
            {{ i18n.currentLang === 'ar' ? 'راقب رادارات المخاطرة في لوحة التحكم. سيقوم النظام بتنبيهك عند اقترابك من حد الخسارة اليومي.' : 'Monitor the Risk Radars on your dashboard. The system will alert you when approaching daily loss or drawdown limits.' }}
          </p>
        </div>

        <!-- Step 3 -->
        <div class="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4 hover:border-var(--theme-accent)/30 transition-all group">
          <lucide-angular [img]="icons.BarChart2" class="w-8 h-8 text-var(--theme-accent)"></lucide-angular>
          <h3 class="text-xl font-black uppercase tracking-tight">3. Advanced Analytics</h3>
          <p class="text-sm text-white/60 leading-relaxed">
            {{ i18n.currentLang === 'ar' ? 'استخدم صفحة التحليلات لدراسة منحنى الأداء واكتشاف الثغرات في استراتيجيتك باستخدام الرسوم البيانية.' : 'Utilize the Analytics module to study your equity curve and discover strategy leaks using institutional charts.' }}
          </p>
        </div>

        <!-- Step 4 -->
        <div class="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4 hover:border-var(--theme-accent)/30 transition-all group">
          <lucide-angular [img]="icons.Download" class="w-8 h-8 text-var(--theme-accent)"></lucide-angular>
          <h3 class="text-xl font-black uppercase tracking-tight">4. Data Archiving</h3>
          <p class="text-sm text-white/60 leading-relaxed">
            {{ i18n.currentLang === 'ar' ? 'يمكنك تصدير تقاريرك كملفات CSV أو نسخ احتياطي كامل بتنسيق JSON من قسم الإحصائيات أو الإعدادات.' : 'Export your ledgers as CSV or full JSON backups from the Settings or Reports modules for external audits.' }}
          </p>
        </div>
      </div>

      <footer class="p-8 rounded-3xl border border-dashed border-white/10 text-center">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">TradeFlow Pro — Institutional Trading OS v2.0</p>
      </footer>
    </div>

    <style>
      .shadow-gold {
        box-shadow: 0 8px 32px rgba(var(--theme-accent-rgb, 255, 215, 0), 0.15);
      }
    </style>
  `
})
export class HelpComponent {
  readonly icons = { HelpCircle, PlusCircle, BarChart2, Calendar, ShieldCheck, Download };
  constructor(public i18n: I18nService) {}
  t(key: string): string { return this.i18n.t(key); }
}
