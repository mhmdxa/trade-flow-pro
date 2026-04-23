import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './core/layout/toast/toast.component';
import { I18nService } from './core/services/i18n.service';
import { SettingsStoreService } from './core/services/settings-store.service';
import { TradeService } from './shared/services/trade.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'TradeFlow Pro';

  constructor(
    public i18n: I18nService,
    private settings: SettingsStoreService,
    private tradeService: TradeService
  ) {}

  ngOnInit(): void {
    // Services initialize themselves from localStorage on construction.
    // Force re-apply theme in case CSS vars weren't set before DOM ready.
    const s = this.settings.current;
    this.settings.update({ theme: s.theme, fontSize: s.fontSize });
  }

  /** Auto-save all pending data when the user navigates away */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    // All services already persist to localStorage on each mutation.
    // This is the final safety net to flush anything pending.
    const settings = this.settings.current;
    localStorage.setItem('tradeflow_settings', JSON.stringify(settings));
    // No need to prevent default – just ensure saves happened.
  }
}
