import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-angular';
import { Toast, ToastService } from '../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(1rem)' }),
        animate('0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(1rem)' }))
      ])
    ])
  ],
  template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none" [dir]="i18n.currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div *ngFor="let toast of toastService.toasts$ | async" 
           @toastAnim
           class="pointer-events-auto p-4 rounded-xl shadow-2xl flex items-start gap-4"
           [ngClass]="{
             'bg-green-500/10 border border-green-500/20 text-green-500': toast.type === 'success',
             'bg-red-500/10 border border-red-500/20 text-red-500': toast.type === 'error',
             'bg-blue-500/10 border border-blue-500/20 text-blue-500': toast.type === 'info',
             'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500': toast.type === 'warning'
           }"
           style="background-color: var(--theme-surface);">
        <lucide-angular [img]="getIcon(toast.type)" class="w-5 h-5 flex-shrink-0 mt-0.5"></lucide-angular>
        <p class="text-sm font-bold flex-1" style="color: var(--theme-text)">{{ toast.message }}</p>
        <button (click)="toastService.remove(toast.id)" class="opacity-50 hover:opacity-100 transition-opacity">
          <lucide-angular [img]="icons.X" class="w-4 h-4"></lucide-angular>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  readonly icons = { X, CheckCircle, AlertCircle, Info, AlertTriangle };

  constructor(public toastService: ToastService, public i18n: I18nService) {}

  getIcon(type: string): any {
    switch (type) {
      case 'success': return this.icons.CheckCircle;
      case 'error': return this.icons.AlertCircle;
      case 'warning': return this.icons.AlertTriangle;
      default: return this.icons.Info;
    }
  }
}
