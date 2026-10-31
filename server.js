import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(here, 'dist');
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'TeddyPups website' }));
app.post('/api/inquiries', (req, res) => {
  const { name, phone, email, city, interest, message, website } = req.body || {};
  if (website) return res.json({ ok: true });
  if (!name?.trim() || !phone?.trim() || !email?.trim() || !city?.trim() || !interest?.trim()) return res.status(400).json({ error: 'Please fill in your name, phone, email, location and puppy interest.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  // The static clone confirms submitted enquiries locally; it does not send or retain personal information.
  res.status(201).json({ ok: true, received: Boolean(message) });
});
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*path', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  app.get('/', (_req, res) => res.status(200).send('TeddyPups Node API is ready. Run npm run dev for the React site.'));
}
const port = Number(process.env.PORT || 3001);
app.listen(port, '0.0.0.0', () => console.log(`TeddyPups server listening on http://localhost:${port}`));
