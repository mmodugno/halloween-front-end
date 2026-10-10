// Small wrappers around localStorage so a broken or missing value never crashes the app.
const SESSION_KEY = "halloween-session";

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// { passphrase, userID, isAdmin } or null when logged out.
export const loadSession = () => read(SESSION_KEY, null);
export const saveSession = (session) => write(SESSION_KEY, session);

// IDs of the candidates this user already voted, per user so a shared phone works.
export const loadVotedIds = (userID) => read(`halloween-votes-${userID}`, []);
export const saveVotedIds = (userID, ids) => write(`halloween-votes-${userID}`, ids);
export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
};
