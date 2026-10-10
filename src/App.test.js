import { render, screen } from "@testing-library/react";
import Splash from "./pages/Splash";
import { rankWinners } from "./components/WinnerPodium";
import * as sprites from "./components/pixel/sprites";

test("splash asks for the password", () => {
  render(<Splash onLogin={() => {}} />);
  expect(screen.getByRole("heading", { name: /noche de disfraces/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
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

