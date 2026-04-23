import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User, Palette, Globe, Bell, Database, Check, Shield, Zap, Download, Trash2, Upload, Monitor, Plus, CreditCard } from 'lucide-angular';
import { I18nService, Lang } from '../../core/services/i18n.service';
import { SettingsStoreService, AppSettings, ThemeName } from '../../core/services/settings-store.service';
import { TradeService } from '../../shared/services/trade.service';
import { AccountService, TradingAccount } from '../../core/services/account.service';
import { ToastService } from '../../core/services/toast.service';
import { Observable } from 'rxjs';

type SettingsTab = 'profile' | 'appearance' | 'language' | 'accounts' | 'security' | 'data';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  activeTab: SettingsTab = 'profile';
  settings!: AppSettings;
  saveSuccess = false;
  
  accounts$: Observable<TradingAccount[]>;
  activeAccountId$: Observable<string>;
  
  showAccountModal = false;
  newAccount: Omit<TradingAccount, 'id' | 'isDefault'> = {
    name: '',
    balance: 100000,
    type: 'demo',
    currency: 'USD'
  };

  settingsTabs: { id: SettingsTab, icon: any, label: string }[] = [];

  readonly icons = { User, Palette, Globe, Bell, Database, Check, Shield, Zap, Download, Trash2, Upload, Monitor, Plus, CreditCard };

  themes: { id: ThemeName; label: string; bg: string; accent: string; preview: string }[] = [
    { id: 'dark-gold',  label: 'Institutional Gold',   bg: '#0a0a2a', accent: '#ffd700', preview: 'linear-gradient(135deg,#0a0a2a 60%,#ffd700 100%)' },
    { id: 'dark-blue',  label: 'Deep Marine',         bg: '#050d1a', accent: '#4f87ff', preview: 'linear-gradient(135deg,#050d1a 60%,#4f87ff 100%)' },
    { id: 'midnight',   label: 'Midnight OLED',       bg: '#000000', accent: '#a855f7', preview: 'linear-gradient(135deg,#000 60%,#a855f7 100%)' },
    { id: 'emerald',    label: 'Emerald Wealth',      bg: '#061a14', accent: '#10b981', preview: 'linear-gradient(135deg,#061a14 60%,#10b981 100%)' },
    { id: 'royal-purple', label: 'Royal Majesty',     bg: '#120a2a', accent: '#c084fc', preview: 'linear-gradient(135deg,#120a2a 60%,#c084fc 100%)' },
    { id: 'light-pro',  label: 'Light Professional',  bg: '#f0f4f8', accent: '#2563eb', preview: 'linear-gradient(135deg,#f0f4f8 60%,#2563eb 100%)' },
  ];

  languages: { code: Lang; label: string; native: string; flag: string }[] = [
    { code: 'en', label: 'English',  native: 'English',  flag: '🇺🇸' },
    { code: 'ar', label: 'Arabic',   native: 'العربية',  flag: '🇸🇦' },
    { code: 'fr', label: 'French',   native: 'Français', flag: '🇫🇷' },
  ];

  constructor(
    public i18n: I18nService,
    public settingsStore: SettingsStoreService,
    private tradeService: TradeService,
    private accountService: AccountService,
    public toast: ToastService
  ) {
    this.accounts$ = this.accountService.accounts$;
    this.activeAccountId$ = this.accountService.activeAccountId$;
  }

  ngOnInit(): void {
    this.settings = { ...this.settingsStore.current };
    this.initTabs();
  }

  initTabs(): void {
    this.settingsTabs = [
      { id: 'profile', icon: this.icons.User, label: this.t('settings.tab.profile') },
      { id: 'appearance', icon: this.icons.Palette, label: this.t('settings.tab.appearance') },
      { id: 'language', icon: this.icons.Globe, label: this.t('settings.tab.language') },
      { id: 'accounts', icon: this.icons.CreditCard, label: this.t('settings.tab.accounts') },
      { id: 'security', icon: this.icons.Shield, label: this.t('settings.tab.security') },
      { id: 'data', icon: this.icons.Database, label: this.t('settings.tab.data') }
    ];
  }

  t(key: string): string { return this.i18n.t(key); }

  setTab(tab: SettingsTab): void { this.activeTab = tab; }

  setTheme(theme: ThemeName): void {
    this.settings.theme = theme;
    this.settingsStore.update({ theme });
    this.showSaved();
  }

  setLanguage(lang: Lang): void {
    this.i18n.setLanguage(lang);
    this.showSaved();
  }

  saveProfile(): void {
    this.settingsStore.update({
      firstName: this.settings.firstName,
      lastName: this.settings.lastName,
      email: this.settings.email,
    });
    this.showSaved();
  }

  // Account Management
  openAddAccount(): void { this.showAccountModal = true; }
  closeAddAccount(): void { this.showAccountModal = false; }
  
  saveNewAccount(): void {
    if (!this.newAccount.name) return;
    this.accountService.addAccount({ ...this.newAccount, isDefault: false }).subscribe(() => {
      this.closeAddAccount();
      this.showSaved();
    });
  }

  switchAccount(id: string): void {
    this.accountService.setActiveAccount(id);
    this.showSaved();
  }

  deleteAccount(id: string): void {
    if (confirm(this.i18n.currentLang === 'ar' ? 'هل أنت متأكد من حذف الحساب؟' : 'Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(id).subscribe(success => {
        if (!success) {
          this.toast.show(this.i18n.currentLang === 'ar' ? 'لا يمكن حذف الحساب الأخير' : 'Cannot delete the final account', 'error');
        } else {
          this.toast.show(this.i18n.currentLang === 'ar' ? 'تم مسح الحساب' : 'Account permanently deleted', 'warning');
        }
      });
    }
  }

  // Security Management
  changePassword(): void {
    this.toast.show(this.i18n.currentLang === 'ar' ? 'نموذج تغيير المرور (قيد الانشاء)' : 'Password Change interface opened', 'info');
  }
  
  toggle2FA(): void {
    this.toast.show(this.i18n.currentLang === 'ar' ? 'المصادقة الثنائية اختيارية وسيتم توفيرها قريباً' : '2FA Hardware Sync (Coming Soon)', 'info');
  }

  exportAllData(): void {
    this.tradeService.getTrades().subscribe(trades => {
      const data = {
        exportedAt: new Date().toISOString(),
        settings: this.settingsStore.current,
        trades,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `TradeFlow_Archive_${new Date().toISOString().split('T')[0]}.json`;
      a.click(); URL.revokeObjectURL(url);
    }).unsubscribe();
  }

  deleteAllData(): void {
    const msg = "PERMANENT ACTION: Erase everything?\nType 'CLEAR' to proceed:";
    if (window.prompt(msg) === 'CLEAR') {
      localStorage.clear();
      window.location.reload();
    }
  }

  private showSaved(): void {
    this.saveSuccess = true;
    this.toast.show(this.i18n.currentLang === 'ar' ? 'تم الحفظ والمزامنة بنجاح' : 'Settings synchronized', 'success');
    setTimeout(() => this.saveSuccess = false, 2000);
  }
}
