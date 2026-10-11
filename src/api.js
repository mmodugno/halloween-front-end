const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Calls the backend and returns the parsed JSON. Throws with the backend's
// error message when the response is not OK.
async function request(path, { method = "GET", passphrase, body } = {}) {
  const headers = {};
  if (passphrase) headers.User = passphrase;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.Message || `HTTP ${res.status}`);
  return data;
}

const api = {
  login: (passphrase) => request("/users/login", { passphrase }),
  // [{ id, name, members: ["Lu", "Tomi"] }]: what people vote for.
  costumes: () => request("/costumes"),
  // { costume, costume_id (to join an existing one), name, partners: [] }
  // -> { costume: { id, name }, users: [{ name, pw_code, ... }] }, registrant first.
  register: (form) => request("/register", { method: "POST", body: form }),
  vote: (passphrase, costumeId, message) =>
    request("/votes", {
      method: "POST",
      passphrase,
      body: { costume_id: costumeId, message },
    }),
  undoVote: (passphrase, candidateId) => request(`/votes/${candidateId}`, { method: "DELETE", passphrase }),
  feed: () => request("/feed"),
  // { guests, cast, possible }
  stats: () => request("/stats"),
  winners: () => request("/results/winners"),
  // Votes and messages a costume received (only its members or an admin can read them).
  messages: (passphrase, costumeID) => request(`/results/${costumeID}`, { passphrase }),
  // { started, finished, registration_open, votes_per_user }
  game: () => request("/game"),
};

// Admin only: every call sends the admin's pass code.
export const adminApi = (passphrase) => ({
  setGame: (state) => request("/game", { method: "PUT", passphrase, body: state }),
  // { registration_open, votes_per_user } -> the whole game state.
  setRegistration: (settings) => request("/admin/registration", { method: "PUT", passphrase, body: settings }),
  renameCostume: (id, name) => request(`/admin/costumes/${id}`, { method: "PUT", passphrase, body: { name } }),
  results: () => request("/results", { passphrase }),
  users: () => request("/admin/users", { passphrase }),
  createUsers: (users) => request("/users/batch", { method: "POST", passphrase, body: users }).then((r) => r.Users),
  updateUser: (user) => request(`/admin/users/${user.id}`, { method: "PUT", passphrase, body: user }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE", passphrase }),
  messages: () => request("/admin/messages", { passphrase }),
  setMessageHidden: (id, hidden) => request(`/admin/messages/${id}`, { method: "PUT", passphrase, body: { hidden } }),
  resetVotes: (votesPerUser) =>
    request("/admin/votes/reset", { method: "POST", passphrase, body: { votes_per_user: votesPerUser } }),
});

export default api;
