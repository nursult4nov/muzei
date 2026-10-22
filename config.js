/* ===== ОБЩАЯ ТАБЛИЦА РЕЗУЛЬТАТОВ =====
   Вставьте сюда адрес вашей базы Firebase Realtime Database (инструкция в файле ИНСТРУКЦИЯ.md).
   Пример: "https://museum-quiz-12345-default-rtdb.firebaseio.com"
   Пока строка пустая, результаты хранятся только на том телефоне, где играли. */
const MUSEUM_DB_URL = "https://museum-quiz-72895-default-rtdb.firebaseio.com/";

const MuseumDB = {
  on: !!MUSEUM_DB_URL,
  _u() { return MUSEUM_DB_URL.replace(/\/+$/, '') + '/quiz.json'; },
  async _f(url, opt) {
    const c = new AbortController(), t = setTimeout(() => c.abort(), 8000);
    try { const r = await fetch(url, Object.assign({ signal: c.signal }, opt)); if (!r.ok) { const e = new Error('HTTP ' + r.status); e.status = r.status; throw e; } return await r.json(); }
    finally { clearTimeout(t); }
  },
  /* понятное объяснение ошибки */
  why(e) {
    const s = e && e.status;
    if (s === 401 || s === 403) return 'Firebase запретил доступ: во вкладке «Правила» вставьте правила из ИНСТРУКЦИИ и нажмите «Опубликовать».';
    if (s === 404) return 'База не найдена: проверьте адрес в config.js.';
    if (e && e.name === 'AbortError') return 'База не ответила за 8 секунд.';
    if (s) return 'Ошибка базы (код ' + s + ').';
    return 'Нет доступа к базе: проверьте интернет и адрес в config.js.';
  },
  /* отправить результат */
  push(r) {
    return this._f(this._u(), { method: 'POST', body: JSON.stringify({ name: String(r.name).slice(0, 16), score: r.score | 0, right: r.right | 0, t: r.t }) });
  },
  /* получить лучшие результаты всех игроков */
  async top() {
    const o = await this._f(this._u() + '?orderBy=' + encodeURIComponent('"$key"') + '&limitToLast=300');
    return Object.values(o || {}).filter(x => x && typeof x.score === 'number' && typeof x.name === 'string').sort((a, b) => b.score - a.score || a.t - b.t);
  }
};
