import { render, screen } from "@testing-library/react";
import Splash from "./pages/Splash";
import { rankWinners } from "./components/WinnerPodium";
import * as sprites from "./components/pixel/sprites";

test("splash asks for the password", () => {
  render(<Splash game={{ started: true, finished: false, registration_open: true }} onLogin={() => {}} />);
  expect(screen.getByRole("heading", { name: /noche de disfraces/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /anotarme/i })).not.toBeInTheDocument();
});

test("splash offers signing up before the vote opens", () => {
  render(<Splash game={{ started: false, finished: false, registration_open: true }} onLogin={() => {}} />);
  expect(screen.getByRole("button", { name: /anotarme con mi disfraz/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/ya tenés contraseña/i)).toBeInTheDocument();
});

test("joinNames lists people the Spanish way", () => {
  const { joinNames } = require("./session");
  expect(joinNames(["Lu"])).toBe("Lu");
  expect(joinNames(["Lu", "Tomi"])).toBe("Lu y Tomi");
  expect(joinNames(["Lu", "Sol", "Tomi"])).toBe("Lu, Sol y Tomi");
});

test("groupByCostume groups guests and leaves people without costume last", () => {
  const { groupByCostume } = require("./components/admin/GuestsTab");
  const groups = groupByCostume([
    { id: 1, name: "Maga", costume: "", costume_id: 0 },
    { id: 2, name: "Lu", costume: "Zombie", costume_id: 7 },
    { id: 3, name: "Tomi", costume: "Bruja", costume_id: 4 },
    { id: 4, name: "Sol", costume: "Zombie", costume_id: 7 },
  ]);
  expect(groups.map((g) => [g.name, g.members.map((m) => m.name)])).toEqual([
    ["Bruja", ["Tomi"]],
    ["Zombie", ["Lu", "Sol"]],
    ["", ["Maga"]],
  ]);
});

test("rankWinners sorts by votes and ties share a position", () => {
  const ranked = rankWinners([
    { name: "c", votes_count: 1 },
    { name: "a", votes_count: 3 },
    { name: "b", votes_count: 3 },
  ]);
  expect(ranked.map((w) => [w.name, w.position])).toEqual([
    ["a", 1],
    ["b", 1],
    ["c", 2],
  ]);
});

test("sprites are rectangular and every pixel has a color", () => {
  const all = Object.entries(sprites).filter(([, s]) => s.rows);
  for (const [name, sprite] of all) {
    const widths = new Set(sprite.rows.map((r) => r.length));
    expect([name, widths.size]).toEqual([name, 1]);
    const missing = [...new Set(sprite.rows.join("").replace(/\./g, ""))].filter((k) => !sprite.palette[k]);
    expect([name, missing]).toEqual([name, []]);
  }
});

test("parseGuestList accepts commas, dashes, tabs and names alone", () => {
  const { parseGuestList } = require("./components/admin/GuestsTab");
  expect(parseGuestList("Lu, Bruja del bosque\nTomi - Zombie\n\nSai\nDei\tVampira", 2)).toEqual([
    { name: "Lu", costume: "Bruja del bosque", pending_votes: 2, is_admin: false },
    { name: "Tomi", costume: "Zombie", pending_votes: 2, is_admin: false },
    { name: "Sai", costume: "", pending_votes: 2, is_admin: false },
    { name: "Dei", costume: "Vampira", pending_votes: 2, is_admin: false },
  ]);
});
