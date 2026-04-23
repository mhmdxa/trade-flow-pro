import sqlite3 from 'sqlite3';
import path from 'path';

import crypto from 'crypto';

const dbPath = path.resolve(__dirname, '../../tradeflow.db');
export const db = new sqlite3.Database(dbPath);

export const initDb = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // 1. Users
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        firstName TEXT,
        lastName TEXT,
        role TEXT DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 2. Trades
      db.run(`CREATE TABLE IF NOT EXISTS trades (
        id TEXT PRIMARY KEY,
        userId TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        symbol TEXT,
        type TEXT,
        lots REAL,
        entryPrice REAL,
        exitPrice REAL,
        stopLoss REAL,
        takeProfit REAL,
        pnl REAL,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // 3. Journals
      db.run(`CREATE TABLE IF NOT EXISTS journals (
        id TEXT PRIMARY KEY,
        userId TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        title TEXT,
        content TEXT,
        emotion TEXT,
        mistakes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // 4. Strategies
      db.run(`CREATE TABLE IF NOT EXISTS strategies (
        id TEXT PRIMARY KEY,
        userId TEXT,
        name TEXT,
        type TEXT,
        timeframe TEXT,
        indicators TEXT,
        entryRules TEXT,
        exitRules TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // 5. Risk Settings
      db.run(`CREATE TABLE IF NOT EXISTS riskSettings (
        id TEXT PRIMARY KEY,
        userId TEXT UNIQUE,
        initialBalance REAL DEFAULT 100000,
        dailyLossLimitPercent REAL DEFAULT 5.0,
        maxDrawdownLimitPercent REAL DEFAULT 10.0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // 6. Risk Logs
      db.run(`CREATE TABLE IF NOT EXISTS riskLogs (
        id TEXT PRIMARY KEY,
        userId TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        event TEXT,
        severity TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // 7. Calendar Events
      db.run(`CREATE TABLE IF NOT EXISTS calendarEvents (
        id TEXT PRIMARY KEY,
        userId TEXT,
        date DATETIME,
        title TEXT,
        description TEXT,
        impact TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // 8. Analytics
      db.run(`CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        userId TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        winRate REAL,
        profitFactor REAL,
        totalTrades INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // 9. Reports
      db.run(`CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        userId TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        type TEXT,
        url TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // 10. Settings
      db.run(`CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        userId TEXT UNIQUE,
        theme TEXT DEFAULT 'dark',
        currency TEXT DEFAULT 'USD',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

export const generateId = () => crypto.randomUUID();
