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
  users: () => request("/users"),
  vote: (passphrase, candidateId, message) =>
    request("/votes", {
      method: "POST",
      passphrase,
      body: { user_costume_id: candidateId, message },
    }),
  undoVote: (passphrase, candidateId) => request(`/votes/${candidateId}`, { method: "DELETE", passphrase }),
  feed: () => request("/feed"),
  winners: () => request("/results/winners"),
  // Votes and messages a user received (only that user or an admin can read them).
  messages: (passphrase, userID) => request(`/results/${userID}`, { passphrase }),
  // { started, finished }
  game: () => request("/game"),
};

// Admin only: every call sends the admin's pass code.
export const adminApi = (passphrase) => ({
  setGame: (state) => request("/game", { method: "PUT", passphrase, body: state }),
  results: () => request("/results", { passphrase }),
  users: () => request("/admin/users", { passphrase }),
  createUsers: (users) => request("/users/batch", { method: "POST", passphrase, body: users }).then((r) => r.Users),
  updateUser: (user) => request(`/admin/users/${user.id}`, { method: "PUT", passphrase, body: user }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE", passphrase }),
  resetVotes: (votesPerUser) =>
    request("/admin/votes/reset", { method: "POST", passphrase, body: { votes_per_user: votesPerUser } }),
});

export default api;
