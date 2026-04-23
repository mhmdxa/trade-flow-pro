import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TradesComponent } from './features/trades/trades.component';
import { JournalComponent } from './features/journal/journal.component';
import { StrategiesComponent } from './features/strategies/strategies.component';
import { RiskSettingsComponent } from './features/risk/risk-settings/risk-settings.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { ReportsComponent } from './features/reports/reports.component';
import { SettingsComponent } from './features/settings/settings.component';
import { HelpComponent } from './features/help/help.component';
import { authGuard } from './core/guards/auth.guard';
import { riskGuard } from './core/guards/risk.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: '', 
    component: LayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'trades', component: TradesComponent }, 
      { path: 'journal', component: JournalComponent },
      { path: 'strategies', component: StrategiesComponent },
      { path: 'risk-settings', component: RiskSettingsComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'help', component: HelpComponent }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
