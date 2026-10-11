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

// { passphrase, userID, costumeID, isAdmin } or null when logged out.
export const loadSession = () => read(SESSION_KEY, null);
export const saveSession = (session) => write(SESSION_KEY, session);

// IDs of the costumes this user already voted, per user so a shared phone works.
export const loadVotedIds = (userID) => read(`halloween-voted-costumes-${userID}`, []);
export const saveVotedIds = (userID, ids) => write(`halloween-voted-costumes-${userID}`, ids);

// What the sign-up form returned ({ costume, users }), so the pass codes of
// whoever you signed up stay at hand until the party.
export const loadSignup = () => read("halloween-signup", null);
export const saveSignup = (signup) => write("halloween-signup", signup);

// Turns { passphrase, user from the API } into the stored session.
export const sessionFor = (passphrase, user) => ({
  passphrase,
  userID: user.id,
  costumeID: user.costume_id,
  isAdmin: user.is_admin,
});

// "Lu", "Lu y Tomi", "Lu, Sol y Tomi".
export const joinNames = (names = []) =>
  names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
};
