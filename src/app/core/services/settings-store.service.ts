import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeName = 'dark-gold' | 'dark-blue' | 'midnight' | 'emerald' | 'royal-purple' | 'light-pro';

export interface AppSettings {
  theme: ThemeName;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  compactSidebar: boolean;
  animationsEnabled: boolean;
  emailNotifications: boolean;
  soundAlerts: boolean;
  riskAlerts: boolean;
  dailySummary: boolean;
  autoBackup: boolean;
  // Profile
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'funded' | 'personal' | 'demo';
}

const DEFAULTS: AppSettings = {
  theme: 'dark-gold',
  accentColor: '#ffd700',
  fontSize: 'md',
  compactSidebar: false,
  animationsEnabled: true,
  emailNotifications: true,
  soundAlerts: false,
  riskAlerts: true,
  dailySummary: false,
  autoBackup: true,
  firstName: '',
  lastName: '',
  email: '',
  accountType: 'funded',
};

const THEME_VARS: Record<ThemeName, Record<string, string>> = {
  'dark-gold': {
    '--theme-bg':        '#0a0a2a',
    '--theme-surface':   '#16213e',
    '--theme-elevated':  '#1a2744',
    '--theme-sidebar':   '#0f0f2a',
    '--theme-border':    'rgba(255,215,0,0.12)',
    '--theme-accent':    '#ffd700',
    '--theme-accent2':   '#ffaa00',
    '--theme-text':      '#ffffff',
    '--theme-muted':     'rgba(255,255,255,0.5)',
    '--theme-card':      'rgba(22,33,78,0.6)',
    '--theme-hover':     'rgba(255,215,0,0.1)',
    '--theme-input-bg':  'rgba(10,10,42,0.8)',
    '--theme-profit':    '#00ff88',
    '--theme-loss':      '#ff3b30',
  },
  'dark-blue': {
    '--theme-bg':        '#050d1a',
    '--theme-surface':   '#091629',
    '--theme-elevated':  '#0e2040',
    '--theme-sidebar':   '#060f1f',
    '--theme-border':    'rgba(79,135,255,0.15)',
    '--theme-accent':    '#4f87ff',
    '--theme-accent2':   '#2563eb',
    '--theme-text':      '#ffffff',
    '--theme-muted':     'rgba(255,255,255,0.5)',
    '--theme-card':      'rgba(9,22,41,0.7)',
    '--theme-hover':     'rgba(79,135,255,0.12)',
    '--theme-input-bg':  'rgba(5,13,26,0.85)',
    '--theme-profit':    '#00ff88',
    '--theme-loss':      '#ff3b30',
  },
  'midnight': {
    '--theme-bg':        '#000000',
    '--theme-surface':   '#0a0a0a',
    '--theme-elevated':  '#111111',
    '--theme-sidebar':   '#050505',
    '--theme-border':    'rgba(147,51,234,0.2)',
    '--theme-accent':    '#a855f7',
    '--theme-accent2':   '#7c3aed',
    '--theme-text':      '#ffffff',
    '--theme-muted':     'rgba(255,255,255,0.45)',
    '--theme-card':      'rgba(10,10,10,0.8)',
    '--theme-hover':     'rgba(168,85,247,0.1)',
    '--theme-input-bg':  'rgba(0,0,0,0.9)',
    '--theme-profit':    '#10b981',
    '--theme-loss':      '#ef4444',
  },
  'emerald': {
    '--theme-bg':        '#061a14',
    '--theme-surface':   '#0a2620',
    '--theme-elevated':  '#0e322a',
    '--theme-sidebar':   '#04120e',
    '--theme-border':    'rgba(16,185,129,0.2)',
    '--theme-accent':    '#10b981',
    '--theme-accent2':   '#059669',
    '--theme-text':      '#ffffff',
    '--theme-muted':     'rgba(255,255,255,0.5)',
    '--theme-card':      'rgba(10,38,32,0.7)',
    '--theme-hover':     'rgba(16,185,129,0.1)',
    '--theme-input-bg':  'rgba(6,26,20,0.85)',
    '--theme-profit':    '#34d399',
    '--theme-loss':      '#fb7185',
  },
  'royal-purple': {
    '--theme-bg':        '#120a2a',
    '--theme-surface':   '#1c123e',
    '--theme-elevated':  '#251a4d',
    '--theme-sidebar':   '#0a061d',
    '--theme-border':    'rgba(192,132,252,0.2)',
    '--theme-accent':    '#c084fc',
    '--theme-accent2':   '#a855f7',
    '--theme-text':      '#ffffff',
    '--theme-muted':     'rgba(255,255,255,0.5)',
    '--theme-card':      'rgba(28,18,62,0.7)',
    '--theme-hover':     'rgba(192,132,252,0.1)',
    '--theme-input-bg':  'rgba(18,10,42,0.85)',
    '--theme-profit':    '#22c55e',
    '--theme-loss':      '#f43f5e',
  },
  'light-pro': {
    '--theme-bg':        '#f8f9fa',
    '--theme-surface':   '#ffffff',
    '--theme-elevated':  '#f1f3f5',
    '--theme-sidebar':   '#ffffff',
    '--theme-border':    '#dee2e6',
    '--theme-accent':    '#212529',
    '--theme-accent2':   '#343a40',
    '--theme-text':      '#212529',
    '--theme-muted':     '#6c757d',
    '--theme-card':      '#ffffff',
    '--theme-hover':     '#e9ecef',
    '--theme-input-bg':  '#ffffff',
    '--theme-profit':    '#198754',
    '--theme-loss':      '#dc3545',
  },
};

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {
  private readonly KEY = 'tradeflow_settings';
  private settingsSubject = new BehaviorSubject<AppSettings>(this.load());
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.applyTheme(this.settingsSubject.value.theme);
    this.applyFontSize(this.settingsSubject.value.fontSize);
  }

  get current(): AppSettings { return this.settingsSubject.value; }

  update(patch: Partial<AppSettings>): void {
    const next = { ...this.settingsSubject.value, ...patch };
    this.settingsSubject.next(next);
    localStorage.setItem(this.KEY, JSON.stringify(next));
    if (patch.theme) this.applyTheme(patch.theme);
    if (patch.fontSize) this.applyFontSize(patch.fontSize);
    if (patch.accentColor) this.applyAccent(patch.accentColor);
    if (patch.compactSidebar !== undefined) {
      document.documentElement.classList.toggle('sidebar-compact', patch.compactSidebar);
    }
    if (patch.animationsEnabled !== undefined) {
      document.documentElement.classList.toggle('no-animations', !patch.animationsEnabled);
    }
  }

  private load(): AppSettings {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return { ...DEFAULTS };
  }

  private applyTheme(theme: ThemeName): void {
    const vars = THEME_VARS[theme];
    if (!vars) return;
    const root = document.documentElement;
    const body = document.body;
    
    // Apply CSS custom properties
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    
    const isLight = theme === 'light-pro';
    
    // Toggle dark/light classes on BOTH html and body
    root.classList.toggle('light-theme', isLight);
    root.classList.toggle('dark', !isLight);
    body.classList.toggle('light-theme', isLight);
    body.classList.toggle('dark', !isLight);
    
    // Fix body background directly
    body.style.background = vars['--theme-bg'] || '';
    body.style.color = vars['--theme-text'] || '';
  }

  private applyFontSize(size: 'sm' | 'md' | 'lg'): void {
    const map = { sm: '13px', md: '15px', lg: '17px' };
    document.documentElement.style.setProperty('--font-size-base', map[size]);
  }

  private applyAccent(color: string): void {
    document.documentElement.style.setProperty('--theme-accent', color);
  }

  getThemeVars(): Record<ThemeName, Record<string, string>> {
    return THEME_VARS;
  }
}
