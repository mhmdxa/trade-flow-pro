import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsStoreService } from '../../services/settings-store.service';
import { I18nService, Lang } from '../../services/i18n.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { AccountService, TradingAccount } from '../../services/account.service';
import { ToastService } from '../../services/toast.service';
import { Observable, interval, Subscription } from 'rxjs';
import { LucideAngularModule, Menu, Bell, Moon, Sun, ChevronDown, Clock, Globe } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleMobileSidebar = new EventEmitter<void>();
  
  currentUser$: Observable<User | null>;
  activeAccount$: Observable<TradingAccount | undefined>;
  
  isProfileMenuOpen = false;
  isNotificationsOpen = false;
  countdown = '00:00:00';

  private timerSub?: Subscription;
  readonly icons = { Menu, Bell, Moon, Sun, ChevronDown, Clock, Globe };

  constructor(
    public settingsStore: SettingsStoreService,
    public i18n: I18nService,
    private authService: AuthService,
    private accountService: AccountService,
    private toast: ToastService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.activeAccount$ = new Observable(obs => {
        this.accountService.activeAccountId$.subscribe(() => {
          obs.next(this.accountService.getActiveAccount());
        });
    });
  }

  ngOnInit(): void {
    this.updateCountdown();
    this.timerSub = interval(1000).subscribe(() => this.updateCountdown());
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  t(key: string): string { return this.i18n.t(key); }

  private updateCountdown(): void {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    this.countdown = `${h}:${m}:${s}`;
  }

  toggleSidebar(): void { this.toggleMobileSidebar.emit(); }

  toggleTheme(): void {
    const current = this.settingsStore.current.theme;
    const next = current === 'light-pro' ? 'dark-gold' : 'light-pro';
    this.settingsStore.update({ theme: next });
    if (next === 'light-pro') {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light-theme');
    } else {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light-theme');
    }
    this.toast.show(this.i18n.currentLang === 'ar' ? 'تم تغيير المظهر بنجاح' : 'Theme updated successfully', 'success');
  }

  toggleLanguage(): void {
    const next: Lang = this.i18n.currentLang === 'ar' ? 'en' : 'ar';
    this.i18n.setLanguage(next);
    this.toast.show(next === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language switched to English', 'success');
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) this.isProfileMenuOpen = false;
    this.toast.show(this.i18n.currentLang === 'ar' ? 'لا توجد إشعارات جديدة' : 'No new notifications', 'info');
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) this.isNotificationsOpen = false;
  }

  logout(): void { 
      localStorage.removeItem('token');
      this.authService.logout(); 
      window.location.href = '/login';
  }
}
