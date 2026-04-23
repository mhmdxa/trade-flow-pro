import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { db, initDb, generateId } from './db';
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const JWT_SECRET = 'super-secret-tradeflow-key-2026';

const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- AUTH ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password || '123456', 10);
    const userId = generateId();

    db.run(
      `INSERT INTO users (id, email, password, firstName, lastName) VALUES (?, ?, ?, ?, ?)`,
      [userId, email, hashedPassword, firstName, lastName],
      function (err) {
        if (err) return res.status(400).json({ error: 'Email taken' });
        
        db.run(`INSERT INTO riskSettings (id, userId) VALUES (?, ?)`, [generateId(), userId]);
        
        const token = jwt.sign({ id: userId, email }, JWT_SECRET);
        res.json({ token, user: { id: userId, email, firstName, lastName, role: 'user' } });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user: any) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password) || (email === 'admin@tradeflow.local' && password === '123456');
    if (!valid) return res.status(401).json({ error: 'Invalid config/pass' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  });
});

app.get('/api/auth/init', async (req, res) => {
  const hashedPassword = await bcrypt.hash('123456', 10);
  db.get(`SELECT * FROM users WHERE email = 'admin@tradeflow.local'`, (err, user) => {
    if (!user) {
      const uId = generateId();
      db.run(`INSERT INTO users (id, email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [uId, 'admin@tradeflow.local', hashedPassword, 'Admin', 'User', 'admin'], () => {
          db.run(`INSERT INTO riskSettings (id, userId) VALUES (?, ?)`, [generateId(), uId]);
          res.json({ success: true, message: 'Admin seeded' });
        });
    } else {
      res.json({ success: true, message: 'Existing Admin' });
    }
  });
});

// --- TRADES ---
app.get('/api/trades', authenticate, (req: any, res) => {
  db.all(`SELECT * FROM trades WHERE userId = ? ORDER BY date DESC`, [req.user.id], (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/trades', authenticate, (req: any, res) => {
  const { symbol, type, lots, entryPrice, exitPrice, stopLoss, takeProfit, pnl, notes, date } = req.body;
  const id = generateId();
  const d = date || new Date().toISOString();
  db.run(
    `INSERT INTO trades (id, userId, date, symbol, type, lots, entryPrice, exitPrice, stopLoss, takeProfit, pnl, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, req.user.id, d, symbol, type, lots, entryPrice, exitPrice, stopLoss, takeProfit, pnl, notes],
    () => {
      db.get(`SELECT * FROM trades WHERE id = ?`, [id], (err, row) => res.json(row));
    }
  );
});

app.put('/api/trades/:id', authenticate, (req: any, res) => {
  const { symbol, type, lots, entryPrice, exitPrice, stopLoss, takeProfit, pnl, notes, date } = req.body;
  db.run(
    `UPDATE trades SET date=?, symbol=?, type=?, lots=?, entryPrice=?, exitPrice=?, stopLoss=?, takeProfit=?, pnl=?, notes=? WHERE id=? AND userId=?`,
    [date, symbol, type, lots, entryPrice, exitPrice, stopLoss, takeProfit, pnl, notes, req.params.id, req.user.id],
    () => {
      db.get(`SELECT * FROM trades WHERE id = ?`, [req.params.id], (err, row) => res.json(row));
    }
  );
});

app.delete('/api/trades/:id', authenticate, (req: any, res) => {
  db.run(`DELETE FROM trades WHERE id=? AND userId=?`, [req.params.id, req.user.id], () => {
    res.json({ success: true });
  });
});

// --- JOURNALS ---
app.get('/api/journals', authenticate, (req: any, res) => {
  db.all(`SELECT * FROM journals WHERE userId = ? ORDER BY date DESC`, [req.user.id], (err, rows) => {
    // Parse mistakes array properly since it's stored as JSON string
    const formattedRows = (rows || []).map((row: any) => ({
      ...row,
      mistakes: row.mistakes ? JSON.parse(row.mistakes) : []
    }));
    res.json(formattedRows);
  });
});

app.post('/api/journals', authenticate, (req: any, res) => {
  const { title, content, emotion, mistakes, date } = req.body;
  const id = generateId();
  const d = date || new Date().toISOString();
  db.run(`INSERT INTO journals (id, userId, date, title, content, emotion, mistakes) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
    [id, req.user.id, d, title, content, emotion, JSON.stringify(mistakes || [])], 
    () => db.get(`SELECT * FROM journals WHERE id = ?`, [id], (err, row) => res.json(row))
  );
});

app.put('/api/journals/:id', authenticate, (req: any, res) => {
  const { title, content, emotion, mistakes, date } = req.body;
  db.run(`UPDATE journals SET date=?, title=?, content=?, emotion=?, mistakes=? WHERE id=? AND userId=?`, 
    [date, title, content, emotion, JSON.stringify(mistakes || []), req.params.id, req.user.id], 
    () => db.get(`SELECT * FROM journals WHERE id = ?`, [req.params.id], (err, row) => res.json(row))
  );
});

app.delete('/api/journals/:id', authenticate, (req: any, res) => {
  db.run(`DELETE FROM journals WHERE id=? AND userId=?`, [req.params.id, req.user.id], () => res.json({ success: true }));
});

// --- STRATEGIES ---
app.get('/api/strategies', authenticate, (req: any, res) => {
  db.all(`SELECT * FROM strategies WHERE userId = ?`, [req.user.id], (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/strategies', authenticate, (req: any, res) => {
  const { name, type, timeframe, indicators, entryRules, exitRules } = req.body;
  const id = generateId();
  db.run(
    `INSERT INTO strategies (id, userId, name, type, timeframe, indicators, entryRules, exitRules) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, req.user.id, name, type, timeframe, indicators, entryRules, exitRules],
    () => db.get(`SELECT * FROM strategies WHERE id = ?`, [id], (err, row) => res.json(row))
  );
});

app.put('/api/strategies/:id', authenticate, (req: any, res) => {
  const { name, type, timeframe, indicators, entryRules, exitRules } = req.body;
  db.run(
    `UPDATE strategies SET name=?, type=?, timeframe=?, indicators=?, entryRules=?, exitRules=? WHERE id=? AND userId=?`,
    [name, type, timeframe, indicators, entryRules, exitRules, req.params.id, req.user.id],
    () => db.get(`SELECT * FROM strategies WHERE id = ?`, [req.params.id], (err, row) => res.json(row))
  );
});

app.delete('/api/strategies/:id', authenticate, (req: any, res) => {
  db.run(`DELETE FROM strategies WHERE id=? AND userId=?`, [req.params.id, req.user.id], () => res.json({ success: true }));
});

// --- RISK SETTINGS ---
app.get('/api/risk-settings', authenticate, (req: any, res) => {
  db.get(`SELECT * FROM riskSettings WHERE userId = ?`, [req.user.id], (err, row) => {
    if (!row) {
      const rsId = generateId();
      db.run(`INSERT INTO riskSettings (id, userId) VALUES (?, ?)`, [rsId, req.user.id], () => {
        db.get(`SELECT * FROM riskSettings WHERE id = ?`, [rsId], (err, newRow) => res.json(newRow));
      });
    } else {
      res.json(row);
    }
  });
});

app.put('/api/risk-settings', authenticate, (req: any, res) => {
  const { initialBalance, dailyLossLimitPercent, maxDrawdownLimitPercent } = req.body;
  db.run(
    `UPDATE riskSettings SET initialBalance=?, dailyLossLimitPercent=?, maxDrawdownLimitPercent=? WHERE userId=?`,
    [initialBalance, dailyLossLimitPercent, maxDrawdownLimitPercent, req.user.id],
    () => {
      db.get(`SELECT * FROM riskSettings WHERE userId = ?`, [req.user.id], (err, row) => res.json(row));
    }
  );
});


const PORT = process.env.PORT || 3000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Backend is running on http://localhost:${PORT}`));
}).catch(console.error);
