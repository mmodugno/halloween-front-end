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
  results: () => request("/results"),
  winners: () => request("/results/winners"),
  messages: (userID) => request(`/results/${userID}`),
  isStarted: () => request("/start").then((d) => d.Message),
  start: () => request("/start", { method: "PUT" }),
  isFinished: () => request("/finish").then((d) => d.Message),
  finish: () => request("/finish", { method: "PUT" }),
};

export default api;
