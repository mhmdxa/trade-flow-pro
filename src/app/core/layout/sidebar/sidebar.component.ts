import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, BarChart2, BookOpen, Layers, ShieldAlert,
         Calendar, PieChart, FileText, Settings, LogOut, ChevronRight, HelpCircle } from 'lucide-angular';
import { I18nService } from '../../services/i18n.service';
import { SettingsStoreService } from '../../services/settings-store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  @Input() isMobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();

  isCompact = false;

  readonly icons = { Home, BarChart2, BookOpen, Layers, ShieldAlert, Calendar, PieChart, FileText, Settings, LogOut, ChevronRight, HelpCircle };

  navItems: any[] = [
    { key: 'nav.dashboard',  path: '/dashboard',    iconKey: 'Home',       faIcon: 'fa-house', label: '', icon: Home },
    { key: 'nav.trades',     path: '/trades',        iconKey: 'BarChart2',  faIcon: 'fa-chart-candlestick', label: '', icon: BarChart2 },
    { key: 'nav.journal',    path: '/journal',       iconKey: 'BookOpen',   faIcon: 'fa-book-open', label: '', icon: BookOpen },
    { key: 'nav.strategies', path: '/strategies',    iconKey: 'Layers',     faIcon: 'fa-layer-group', label: '', icon: Layers },
    { key: 'nav.risk',       path: '/risk-settings', iconKey: 'ShieldAlert',faIcon: 'fa-shield-halved', label: '', icon: ShieldAlert },
    { key: 'nav.calendar',   path: '/calendar',      iconKey: 'Calendar',   faIcon: 'fa-calendar-days', label: '', icon: Calendar },
    { key: 'nav.analytics',  path: '/analytics',     iconKey: 'PieChart',   faIcon: 'fa-chart-pie', label: '', icon: PieChart },
    { key: 'nav.reports',    path: '/reports',       iconKey: 'FileText',   faIcon: 'fa-file-chart-column', label: '', icon: FileText },
    { key: 'nav.guide',      path: '/help',          iconKey: 'HelpCircle', faIcon: 'fa-circle-info', label: '', icon: HelpCircle },
    { key: 'nav.settings',   path: '/settings',      iconKey: 'Settings',   faIcon: 'fa-gear', label: '', icon: Settings },
  ];

  constructor(
    public i18n: I18nService,
    public settingsStore: SettingsStoreService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.settingsStore.settings$.subscribe(s => { this.isCompact = s.compactSidebar; });
  }

  t(key: string): string { return this.i18n.t(key); }

  getIcon(iconKey: string): any {
    return (this.icons as any)[iconKey];
  }

  logout(): void { 
    localStorage.removeItem('tradeflow_auth_token');
    this.authService.logout(); 
  }

  onCloseMobile(): void { this.closeMobile.emit(); }
}
