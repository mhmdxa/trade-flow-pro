import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'en' | 'ar' | 'fr';

const TRANSLATIONS: Record<string, Record<Lang, string>> = {

  // ──────── COMMON ────────
  'app.name':            { en: 'TradeFlow Pro', ar: 'ترايد فلو برو', fr: 'TradeFlow Pro' },
  'app.tagline':         { en: 'Institutional Grade Trading Journal', ar: 'منصة تداول واحترافية متكاملة', fr: 'Journal de trading institutionnel' },
  'common.save':         { en: 'Save Changes', ar: 'حفظ التغييرات', fr: 'Sauvegarder' },
  'common.cancel':       { en: 'Cancel', ar: 'إلغاء', fr: 'Annuler' },
  'common.delete':       { en: 'Delete', ar: 'حذف', fr: 'Supprimer' },
  'common.edit':         { en: 'Edit', ar: 'تعديل', fr: 'Modifier' },
  'common.confirm':      { en: 'Are you sure?', ar: 'هل أنت متأكد؟', fr: 'Êtes-vous sûr ?' },
  'common.refresh':      { en: 'Refresh Data', ar: 'تحديث البيانات', fr: 'Actualiser' },
  'common.export':       { en: 'Export Report', ar: 'تصدير التقرير', fr: 'Exporter' },
  'common.all':          { en: 'All', ar: 'الكل', fr: 'Tout' },
  'common.add':          { en: 'Add', ar: 'إضافة', fr: 'Ajouter' },
  'common.search':       { en: 'Search...', ar: 'بحث...', fr: 'Rechercher...' },
  'common.success':      { en: 'Operation successful', ar: 'تمت العملية بنجاح', fr: 'Opération réussie' },
  'common.error':        { en: 'An error occurred', ar: 'حدث خطأ ما', fr: 'Une erreur est survenue' },

  // ──────── STRATEGIES ────────
  'strategies.title':    { en: 'Strategy Playbook', ar: 'كتاب الاستراتيجيات', fr: 'Cahier de stratégies' },
  'strategies.subtitle': { en: 'Build and manage your trading edge', ar: 'بنّ وأدِر ميزتك التنافسية في التداول', fr: 'Gérez votre avantage trading' },
  'strategies.add':      { en: 'New Strategy', ar: 'استراتيجية جديدة', fr: 'Nouvelle stratégie' },
  'strategies.empty':    { en: 'No strategies yet', ar: 'لا توجد استراتيجيات بعد', fr: 'Aucune stratégie' },
  'strategies.emptyHint': { en: 'Define your trading edge and track your playbooks', ar: 'عرّف ميزتك وتتبع استراتيجياتك الرابحة', fr: 'Définissez votre edge et gérez vos playbooks' },
  'strategies.winRate':  { en: 'Win Rate', ar: 'نسبة الفوز', fr: 'Taux de réussite' },
  'strategies.indicators': { en: 'Indicators', ar: 'المؤشرات', fr: 'Indicateurs' },
  'strategies.entry':    { en: 'Entry Rules', ar: 'شروط الدخول', fr: "Règles d'entrée" },
  'strategies.exit':     { en: 'Exit Rules', ar: 'شروط الخروج', fr: 'Règles de sortie' },
  'strategies.notes':    { en: 'Notes', ar: 'ملاحظات', fr: 'Notes' },
  'strategies.name':     { en: 'Strategy Name', ar: 'اسم الاستراتيجية', fr: 'Nom de la stratégie' },
  'strategies.type':     { en: 'Type', ar: 'النوع', fr: 'Type' },
  'strategies.timeframe': { en: 'Timeframe', ar: 'الإطار الزمني', fr: 'Unité de temps' },
  'strategies.rr':       { en: 'Risk:Reward', ar: 'المخاطرة:العائد', fr: 'Risque:Récompense' },

  // ──────── AUTH ────────
  'auth.login.title':        { en: 'TradeFlow Platform - Professional Trading', ar: 'منصة TradeFlow - تداول باحترافية', fr: 'Plateforme TradeFlow - Trading Professionnel' },
  'auth.login.subtitle':     { en: 'Enter your credentials to access your dashboard.', ar: 'أدخل بياناتك للدخول إلى لوحة التحكم', fr: 'Entrez vos identifiants pour accéder au tableau de bord' },
  'auth.login.btn':          { en: 'Sign In', ar: 'تسجيل الدخول', fr: 'Connexion' },
  'auth.login.createAcc':    { en: 'Create New Account', ar: 'إنشاء حساب جديد', fr: 'Créer un compte' },
  'auth.login.google':       { en: 'Sign in with Google', ar: 'تسجيل عبر Google', fr: 'Continuer avec Google' },
  'auth.login.forgot':       { en: 'Forgot Password?', ar: 'نسيت كلمة المرور؟', fr: 'Mot de passe oublié ?' },
  'auth.login.email':        { en: 'Email Address', ar: 'البريد الإلكتروني', fr: 'Adresse e-mail' },
  'auth.login.password':     { en: 'Security Code', ar: 'كلمة المرور', fr: 'Mot de passe' },
  'auth.login.hero':         { en: 'TradeFlow Pro - Trade Like a Professional', ar: 'منصة TradeFlow - تداول باحترافية', fr: 'TradeFlow Pro - Tradez comme un pro' },
  'auth.login.heroSub':      { en: 'The most advanced trading journal for elite performance.', ar: 'أقوى مذكرة تداول رقمية لتحليل أدائك وتطوير مهاراتك بشكل احترافي.', fr: 'Le journal de trading le plus avancé pour des performances d\'élite.' },
  'auth.login.emailRequired': { en: 'Valid email is required', ar: 'البريد الإلكتروني مطلوب', fr: 'Email requis' },
  'auth.login.passwordRequired': { en: 'Security code is required', ar: 'كلمة المرور مطلوبة', fr: 'Mot de passe requis' },
  'auth.login.authenticating': { en: 'Establishing Secure Session...', ar: 'جاري التحقق من الهوية...', fr: 'Authentification...' },
  'auth.login.noAccount':    { en: "Don't have an account?", ar: 'ليس لديك حساب؟', fr: 'Pas encore de compte ?' },

  // ──────── DASHBOARD ────────
  'dash.riskActive':         { en: 'Safe Mode Active', ar: 'نظام الحماية مفعل', fr: 'Mode sécurité activé' },
  'dash.winRate':            { en: 'Profit Probability', ar: 'نسبة النجاح', fr: 'Taux de réussite' },
  'dash.totalTrades':        { en: 'Total Executions', ar: 'إجمالي الصفقات', fr: 'Total des trades' },
  'dash.liveMetrics':        { en: 'Real-time Analytics', ar: 'تحليلات مباشرة', fr: 'Analyses en temps réel' },
  'dash.balance':            { en: 'Current Balance', ar: 'الرصيد الحالي', fr: 'Solde actuel' },
  'dash.dailyTarget':        { en: 'Daily Target', ar: 'الهدف اليومي', fr: 'Objectif journalier' },
  'dash.remainingLimit':     { en: 'Remaining Limit', ar: 'الحد المتبقي', fr: 'Limite restante' },
  'dash.drawdown':           { en: 'Drawdown', ar: 'الدروداون', fr: 'Drawdown' },
  'dash.equityCurve':        { en: 'Equity Curve', ar: 'منحنى الأداء', fr: 'Courbe des capitaux' },
  'dash.recentTrades':       { en: 'Latest Executions', ar: 'أحدث العمليات', fr: 'Trades récents' },
  'dash.countdown':          { en: 'Reset In', ar: 'العد التنازلي', fr: 'Réinitialisation dans' },

  // ──────── TRADES ────────
  'trades.title':            { en: 'Trade Ledger', ar: 'سجل الصفقات', fr: 'Historique des trades' },
  'trades.add':              { en: 'Add Trade', ar: 'إضافة صفقة', fr: 'Ajouter un trade' },
  'trades.buy':              { en: 'Buy', ar: 'شراء', fr: 'Achat' },
  'trades.sell':             { en: 'Sell', ar: 'بيع', fr: 'Vente' },
  'trades.exportCsv':        { en: 'Export CSV/Excel', ar: 'تصدير CSV/Excel', fr: 'Exporter CSV/Excel' },
  'trades.search':           { en: 'Search by pair or notes...', ar: 'بحث بالزوج أو الملاحظات...', fr: 'Rechercher par paire ou notes...' },
  'trades.col.date':         { en: 'Date', ar: 'التاريخ', fr: 'Date' },
  'trades.col.symbol':       { en: 'Pair', ar: 'الزوج', fr: 'Paire' },
  'trades.col.type':         { en: 'Type', ar: 'النوع', fr: 'Type' },
  'trades.col.lots':         { en: 'Volume', ar: 'حجم العقد', fr: 'Taille du lot' },
  'trades.col.entry':        { en: 'Entry', ar: 'سعر الدخول', fr: "Prix d'entrée" },
  'trades.col.exit':         { en: 'Exit', ar: 'سعر الخروج', fr: 'Prix de sortie' },
  'trades.col.pnl':          { en: 'Profit/Loss', ar: 'الربح/الخسارة', fr: 'P&L' },
  'trades.col.actions':      { en: 'Actions', ar: 'الإجراءات', fr: 'Actions' },
  'trades.modal.edit':       { en: 'Edit Execution', ar: 'تعديل الصفقة', fr: 'Modifier le trade' },
  'trades.modal.add':        { en: 'Log New Execution', ar: 'تسجيل صفقة جديدة', fr: 'Nouveau trade' },
  'trades.modal.symbol':     { en: 'Trading Pair', ar: 'زوج التداول', fr: 'Paire de devises' },
  'trades.modal.entry':      { en: 'Entry Price', ar: 'سعر الدخول', fr: "Prix d'entrée" },
  'trades.modal.exit':       { en: 'Exit Price (Optional)', ar: 'سعر الخروج (اختياري)', fr: 'Prix de sortie (Optionnel)' },
  'trades.modal.lots':       { en: 'Lot Size / Volume', ar: 'حجم العقد', fr: 'Taille du lot' },
  'trades.modal.date':       { en: 'Execution Date', ar: 'تاريخ التنفيذ', fr: "Date d'exécution" },
  'trades.modal.notes':      { en: 'Trade Notes', ar: 'ملاحظات الصفقة', fr: 'Notes de trade' },

  // ──────── JOURNAL ────────
  'journal.title':           { en: 'Trading Diary - Your Analytics', ar: 'دفتر اليومية - ملاحظاتك وتحليلاتك', fr: 'Journal de trading' },
  'journal.subtitle':        { en: 'Reflect and Optimize Your Strategy', ar: 'تأمل وحلّل وطوّر استراتيجيتك', fr: 'Réflexion et optimisation' },
  'journal.add':             { en: 'Log Entry', ar: 'إضافة تدوينة', fr: 'Nouvelle entrée' },
  'journal.field.link':      { en: 'Link Trade', ar: 'ربط الصفقة', fr: 'Lier trade' },
  'journal.field.title':     { en: 'Heading', ar: 'العنوان', fr: 'Titre' },
  'journal.field.content':   { en: 'Content', ar: 'المحتوى', fr: 'Contenu' },
  'journal.field.emotions':  { en: 'Emotions', ar: 'المشاعر', fr: 'Émotions' },
  'journal.field.mistakes':  { en: 'Mistakes', ar: 'الأخطاء', fr: 'Erreurs' },
  'journal.stats.week':      { en: 'This Week', ar: 'هذا الأسبوع', fr: 'Cette semaine' },
  'journal.stats.emotion':   { en: 'Dominant Emotion', ar: 'المشاعر الغالبة', fr: 'Émotion dominante' },
  'journal.stats.hurdle':    { en: 'Primary Hurdle', ar: 'العقبة الرئيسية', fr: 'Obstacle majeur' },
  'journal.stats.logged':    { en: 'Reflections Logged', ar: 'تدوينة مسجلة', fr: 'Réflexions' },
  'journal.stats.pulse':     { en: 'Mindset Pulse', ar: 'نبض الحالة الذهنية', fr: 'État d\'esprit' },
  'journal.stats.target':    { en: 'Optimization Target', ar: 'هدف التطوير القادم', fr: 'Cible d\'optimisation' },

  // ──────── RISK MANAGEMENT ────────
  'risk.title':              { en: 'Risk Management - Protection', ar: 'إدارة المخاطرة - حماية الحساب الممول', fr: 'Gestion des risques' },
  'risk.initialBalance':     { en: 'Initial Balance', ar: 'الرصيد الابتدائي', fr: 'Solde initial' },
  'risk.dailyLoss':          { en: 'Daily Loss Limit (%)', ar: 'حد الخسارة اليومي (%)', fr: 'Limite journalière (%)' },
  'risk.maxDrawdown':        { en: 'Max Drawdown (%)', ar: 'حد الدروداون الكلي (%)', fr: 'Drawdown max (%)' },
  'risk.riskPerTrade':       { en: 'Risk Per Position (%)', ar: 'نسبة المخاطرة لكل صفقة (%)', fr: 'Risque par trade (%)' },

  // ──────── CALENDAR ────────
  'calendar.title':          { en: 'Analytical Calendar - Daily Performance', ar: 'التقويم التحليلي - أدائك اليومي', fr: 'Calendrier analytique' },
  'calendar.today':          { en: 'Today', ar: 'اليوم', fr: "Aujourd'hui" },

  // ──────── SETTINGS ────────
  'settings.title':          { en: 'Platform Settings', ar: 'إعدادات المنصة', fr: 'Paramètres' },
  'settings.tab.profile':    { en: 'Profile', ar: 'الملف الشخصي', fr: 'Profil' },
  'settings.tab.appearance': { en: 'App Preferences', ar: 'تفضلات التطبيق', fr: 'Apparence' },
  'settings.tab.data':       { en: 'Data Management', ar: 'إدارة البيانات', fr: 'Données' },
  'settings.tab.security':   { en: 'Security', ar: 'الأمان', fr: 'Sécurité' },
  'settings.tab.accounts':   { en: 'Accounts', ar: 'إدارة الحسابات', fr: 'Comptes' },
  'settings.tab.language':   { en: 'Language', ar: 'اللغة', fr: 'Langue' },
  'settings.profile.pic':    { en: 'Profile Picture', ar: 'صورة الحساب', fr: 'Photo de profil' },
  'settings.profile.fname':  { en: 'First Name', ar: 'الاسم الأول', fr: 'Prénom' },
  'settings.profile.lname':  { en: 'Last Name', ar: 'اسم العائلة', fr: 'Nom' },
  'settings.appearance.theme': { en: 'Visual Theme', ar: 'نسق المظهر', fr: 'Thème visuel' },
  'settings.appearance.font':  { en: 'Font Size', ar: 'حجم الخط', fr: 'Taille de la police' },
  'settings.security.password': { en: 'Change Password', ar: 'تغيير كلمة المرور', fr: 'Changer le mot de passe' },
  'settings.security.2fa':   { en: 'Two-Factor Authentication', ar: 'المصادقة الثنائية (2FA)', fr: 'Authentification 2FA' },
  'settings.security.critical': { en: 'Critical Actions', ar: 'إجراءات حرجة', fr: 'Actions critiques' },
  'settings.security.export': { en: 'Export Data File', ar: 'تصدير البيانات', fr: 'Exporter les données' },
  'settings.security.delete': { en: 'Purge Persistence', ar: 'حذف جميع البيانات', fr: 'Purger les données' },
  'settings.appearance.theme.darkGold':  { en: 'Imperial Gold', ar: 'الذهبي الملكي', fr: 'Or Impérial' },
  'settings.appearance.theme.darkBlue':  { en: 'Deep Sapphire', ar: 'الأزرق العميق', fr: 'Saphir Profond' },
  'settings.appearance.theme.midnight':   { en: 'Midnight Onyx', ar: 'منتصف الليل', fr: 'Midnight' },
  'settings.appearance.theme.lightPro':   { en: 'Studio Light', ar: 'الإضاءة الاحترافية', fr: 'Studio Light' },
  'settings.appearance.color': { en: 'Accent Color', ar: 'لون التمييز', fr: 'Couleur d\'accent' },
  'settings.data.deleteWarn': { en: 'WARNING: This will erase everything.', ar: 'تحذير: سيتم حذف كافة البيانات بشكل نهائي.', fr: 'ATTENTION : Cela effacera tout.' },

  // Nav
  'nav.dashboard':           { en: 'Dashboard', ar: 'لوحة التحكم', fr: 'Bord' },
  'nav.trades':              { en: 'Trades', ar: 'الصفقات', fr: 'Trades' },
  'nav.journal':             { en: 'Journal', ar: 'اليومية', fr: 'Journal' },
  'nav.risk':                { en: 'Risk Engine', ar: 'إدارة المخاطر', fr: 'Risque' },
  'nav.calendar':            { en: 'Calendar', ar: 'التقويم', fr: 'Calendrier' },
  'nav.settings':            { en: 'Settings', ar: 'الإعدادات', fr: 'Paramètres' },
  'nav.logout':              { en: 'Logout', ar: 'تسجيل الخروج', fr: 'Déconnexion' },
  'nav.guide':               { en: 'Guide', ar: 'الدليل', fr: 'Guide' },
  'nav.reports':             { en: 'Reports', ar: 'التقارير', fr: 'Rapports' },
  'nav.strategies':          { en: 'Strategies', ar: 'الاستراتيجيات', fr: 'Stratégies' },
  'nav.analytics':           { en: 'Analytics', ar: 'التحليلات', fr: 'Analyses' },
  
  // ──────── ACCOUNTS ────────
  'accounts.add':            { en: 'Add Account', ar: 'إضافة حساب', fr: 'Ajouter un compte' },
  'accounts.delete':         { en: 'Delete Account', ar: 'حذف الحساب', fr: 'Supprimer le compte' },
  'accounts.activate':       { en: 'Set Active', ar: 'تفعيل', fr: 'Activer' },
  'accounts.name':           { en: 'Account Name', ar: 'اسم الحساب', fr: 'Nom du compte' },
  'accounts.balance':        { en: 'Initial Balance', ar: 'الرصيد الابتدائي', fr: 'Solde initial' },
  'accounts.type':           { en: 'Account Type', ar: 'نوع الحساب', fr: 'Type de compte' },
  'accounts.added':          { en: 'Account added successfully', ar: 'تم إضافة الحساب بنجاح', fr: 'Compte ajouté avec succès' },
  'accounts.deleted':        { en: 'Account deleted', ar: 'تم حذف الحساب', fr: 'Compte supprimé' },
  'accounts.switched':       { en: 'Account switched', ar: 'تم تغيير الحساب', fr: 'Compte changé' },

  // ──────── HELP ────────
  'help.title':              { en: 'Help & Guide', ar: 'المساعدة والدليل', fr: 'Aide & Guide' },
  'help.step1.title':        { en: 'Log Your Trades', ar: 'سجّل صفقاتك', fr: 'Enregistrez vos trades' },
  'help.step2.title':        { en: 'Monitor Risk', ar: 'راقب المخاطرة', fr: 'Surveiller les risques' },
  'help.step3.title':        { en: 'Analyse Performance', ar: 'حلل الأداء', fr: 'Analyser les performances' },
  'help.step4.title':        { en: 'Export Reports', ar: 'صدّر التقارير', fr: 'Exporter les rapports' },

  // ──────── ALERTS / TOASTS ────────
  'alert.trade.added':       { en: 'Trade added successfully', ar: 'تم إضافة الصفقة بنجاح', fr: 'Trade ajouté avec succès' },
  'alert.trade.updated':     { en: 'Trade updated', ar: 'تم تحديث الصفقة', fr: 'Trade mis à jour' },
  'alert.trade.deleted':     { en: 'Trade deleted', ar: 'تم حذف الصفقة', fr: 'Trade supprimé' },
  'alert.risk.exceeded':     { en: 'Risk limit exceeded!', ar: 'تم تجاوز حد المخاطرة!', fr: 'Limite de risque dépassée !' },
  'alert.daily.loss':        { en: 'Daily loss limit reached!', ar: 'تم الوصول لحد الخسارة اليومي!', fr: 'Limite journalière atteinte !' },
  'alert.no.notifications':  { en: 'No new notifications', ar: 'لا توجد إشعارات جديدة', fr: 'Aucune nouvelle notification' },
  'alert.saved':             { en: 'Settings saved', ar: 'تم حفظ الإعدادات', fr: 'Paramètres sauvegardés' },
  'alert.theme.changed':     { en: 'Theme updated', ar: 'تم تغيير المظهر', fr: 'Thème mis à jour' },
  'alert.lang.changed':      { en: 'Language changed', ar: 'تم تغيير اللغة', fr: 'Langue modifiée' },
  'alert.exported':          { en: 'Data exported successfully', ar: 'تم تصدير البيانات بنجاح', fr: 'Données exportées' },
  'alert.cleared':           { en: 'All data cleared', ar: 'تم مسح جميع البيانات', fr: 'Toutes les données effacées' },

  'common.copyright':        { en: '© 2026 TradeFlow Pro. All rights reserved.', ar: '© 2026 ترايد فلو برو. جميع الحقوق محفوظة.', fr: '© 2026 TradeFlow Pro. Tous droits réservés.' },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly LANG_KEY = 'tradeflow_lang';
  private langSubject = new BehaviorSubject<Lang>('ar');
  public lang$ = this.langSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem(this.LANG_KEY) as Lang | null;
    if (saved && ['en', 'ar', 'fr'].includes(saved)) {
      this.langSubject.next(saved);
      this.applyDir(saved);
    } else {
      this.applyDir('ar');
    }
  }

  get currentLang(): Lang { return this.langSubject.value; }

  setLanguage(lang: Lang): void {
    localStorage.setItem(this.LANG_KEY, lang);
    this.langSubject.next(lang);
    this.applyDir(lang);
  }

  t(key: string): string {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[this.currentLang] ?? entry['en'] ?? key;
  }

  private applyDir(lang: Lang): void {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }
}
