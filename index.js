#!/usr/bin/env node
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = (s) => process.stdout.write(s);
const c = (n) => `\x1b[38;5;${n}m`;
const R = "\x1b[0m";
const HIDE = "\x1b[?25l";
const SHOW = "\x1b[?25h";
const rnd = (n) => (Math.random() * n) | 0;

process.on("exit", () => out(SHOW + R));
process.on("SIGINT", () => process.exit());

const greens = [22, 28, 34, 40, 46, 82, 118, 154, 118, 82, 46, 40, 34, 28];
const GLYPHS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*";

const box = [
  "╔══════════════════════════════════╗",
  "║                                  ║",
  "║      HI, I'M DARSHAN M R         ║",
  "║                                  ║",
  "║      AIML Engineering Student    ║",
  "║      Developer                   ║",
  "║      📈 Tech Explorer            ║",
  "║                                  ║",
  "║      GitHub: darshanmr-911       ║",
  "║                                  ║",
  "╚══════════════════════════════════╝",
];

const skillRows = [
  ["Python", "C", "C++", "R", "Java"],
  ["JavaScript", "Django", "MySQL", "MongoDB", "HTML5"],
  ["Dart", "Flutter", "Git", "GitHub", "Machine Learning"],
];
const W = 64, H = 9, CX = 32, CY = 4;
const rowY = [0, 4, 8];
const labelColors = [46, 82, 118, 40, 154];

const labels = [];
skillRows.forEach((row, ri) => {
  const texts = row.map((n) => "◆ " + n);
  const total = texts.reduce((a, t) => a + t.length, 0) + 3 * (texts.length - 1);
  let x = Math.floor((W - total) / 2);
  texts.forEach((t, k) => {
    labels.push({ text: t, x, y: rowY[ri], color: labelColors[k % labelColors.length] });
    x += t.length + 3;
  });
});

// ---------- hacker boot sequence ----------
async function boot() {
  const lines = [
    "init kernel",
    "loading python + c + dart",
    "mounting skills.db",
    "training neural nets",
    "connecting github/darshanmr-911",
  ];
  const spin = ["|", "/", "-", "\\"];
  for (const l of lines) {
    out(c(34) + "> " + l.padEnd(36, ".") + " ");
    for (let i = 0; i < 10; i++) {
      out(c(46) + spin[i % 4] + "\b");
      await sleep(40);
    }
    out(c(46) + "[ OK ]" + R + "\n");
  }
  await sleep(250);
  out(`\x1b[${lines.length}A\x1b[J`);
}

// ---------- snake ----------
async function snake() {
  const SW = 40, SH = 9;
  const path = [];
  for (let r = 0; r < 5; r++) {
    const y = r * 2;
    for (let i = 0; i < SW; i++) path.push([r % 2 === 0 ? i : SW - 1 - i, y]);
    if (r < 4) path.push([r % 2 === 0 ? SW - 1 : 0, y + 1]);
  }
  const food = new Set();
  for (let i = 12; i < path.length - 6; i += 12) food.add(i);

  out("\n".repeat(SH));
  let h = 0;
  while (true) {
    const eaten = [...food].filter((i) => i <= h).length;
    const len = 4 + eaten;
    if (h - len >= path.length) break;

    const grid = Array.from({ length: SH }, () => Array(SW).fill(" "));
    for (const i of food) {
      if (i > h) {
        const [x, y] = path[i];
        grid[y][x] = c(190) + "•" + R;
      }
    }
    for (let k = len - 1; k >= 0; k--) {
      const i = h - k;
      if (i < 0 || i >= path.length) continue;
      const [x, y] = path[i];
      grid[y][x] =
        k === 0
          ? c(231) + "●" + R
          : c(Math.max(22, 46 - k * 2)) + (k < 3 ? "█" : k < 6 ? "▓" : "▒") + R;
    }
    out(`\x1b[${SH}A`);
    for (const row of grid) out("\x1b[2K" + row.join("") + "\n");
    h++;
    await sleep(14);
  }
  out(`\x1b[${SH}A\x1b[J`);
}

// ---------- info box ----------
async function decode(line, color) {
  const chars = Array.from(line);
  const scramble = (i) => /[A-Za-z0-9'|:,\-]/.test(chars[i]);
  for (let step = 0; step <= chars.length; step += 2) {
    const s = chars
      .map((ch, i) => (i < step || !scramble(i) ? ch : GLYPHS[rnd(GLYPHS.length)]))
      .join("");
    out(`\r${color}${s}${R}`);
    await sleep(14);
  }
  out("\n");
}

function paint(offset) {
  box.forEach((l, i) => out(`${c(greens[(i * 2 + offset) % greens.length])}${l}${R}\n`));
}

// ---------- glitch burst on the box ----------
async function glitch() {
  for (let f = 0; f < 20; f++) {
    out(`\x1b[${box.length}A`);
    box.forEach((l, i) => {
      const hit = f < 17 && Math.random() < 0.3;
      let s = l;
      if (hit) {
        s = Array.from(l)
          .map((ch) => (/[A-Za-z0-9]/.test(ch) && Math.random() < 0.15 ? GLYPHS[rnd(GLYPHS.length)] : ch))
          .join("");
      }
      const off = hit ? " ".repeat(1 + rnd(4)) : "";
      const col = hit ? (Math.random() < 0.5 ? 231 : 51) : greens[(i * 2) % greens.length];
      out("\x1b[2K" + c(col) + off + s + R + "\n");
    });
    await sleep(60);
  }
}

// ---------- grid helpers ----------
function newGrid() {
  return Array.from({ length: H }, () => Array(W).fill(null));
}
function put(grid, x, y, ch, col) {
  x = Math.round(x);
  y = Math.round(y);
  if (x >= 0 && x < W && y >= 0 && y < H) grid[y][x] = { ch, col };
}
function render(grid) {
  out(`\x1b[${H}A`);
  for (const row of grid) {
    out("\x1b[2K" + row.map((cell) => (cell ? c(cell.col) + cell.ch : " ")).join("") + R + "\n");
  }
}

// draws all skills in their normal colors
function skillsGrid() {
  const g = newGrid();
  labels.forEach((L) =>
    Array.from(L.text).forEach((ch, k) => put(g, L.x + k, L.y, ch, L.color))
  );
  return g;
}

// ---------- skills blast ----------
async function blast() {
  out("\n".repeat(H));

  const CH = 16;
  for (let f = 0; f < CH; f++) {
    const g = newGrid();
    const d = (1 - f / CH) * 14;
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      put(g, CX + Math.cos(a) * d * 2, CY + Math.sin(a) * d * 0.3, "·", 34);
    }
    const core = ["·", "•", "●", "◉"][Math.min(3, Math.floor(f / 4))];
    put(g, CX, CY, core, f < 8 ? 40 : f < 12 ? 82 : 154);
    render(g);
    await sleep(55);
  }

  const DUR = 16;
  const sparks = Array.from({ length: 50 }, () => ({
    a: Math.random() * Math.PI * 2,
    v: 0.8 + Math.random() * 2,
    life: 8 + rnd(10),
  }));
  const total = labels.length + DUR + 6;

  for (let f = 0; f < total; f++) {
    const g = newGrid();

    const r = f * 1.3;
    if (r < 22) {
      for (let a = 0; a < Math.PI * 2; a += 0.12) {
        put(g, CX + Math.cos(a) * r * 2, CY + Math.sin(a) * r * 0.45, "·", r < 8 ? 46 : r < 14 ? 34 : 22);
      }
    }

    for (const s of sparks) {
      if (f >= s.life) continue;
      const age = f / s.life;
      put(
        g,
        CX + Math.cos(s.a) * s.v * f * 2,
        CY + Math.sin(s.a) * s.v * f * 0.5,
        age < 0.4 ? "*" : age < 0.7 ? "+" : "·",
        age < 0.2 ? 231 : age < 0.5 ? 118 : age < 0.8 ? 40 : 22
      );
    }

    if (f < 3) {
      for (let k = -3; k <= 3; k++) put(g, CX + k * 2, CY, "─", 231);
      put(g, CX, CY - 1, "│", 231);
      put(g, CX, CY + 1, "│", 231);
      put(g, CX, CY, "✹", 231);
    }

    labels.forEach((L, i) => {
      const local = f - i;
      if (local < 0) return;
      const t = Math.min(1, local / DUR);
      const ease = (u) => 1 - Math.pow(1 - u, 3);
      const tx = L.x + Math.floor(L.text.length / 2);
      const ty = L.y;

      if (t >= 1) {
        const age = local - DUR;
        const col = age < 2 ? 231 : age < 5 ? 190 : L.color;
        Array.from(L.text).forEach((ch, k) => put(g, L.x + k, L.y, ch, col));
      } else {
        for (let k = 3; k >= 1; k--) {
          const tk = ease(Math.max(0, (local - k) / DUR));
          put(g, CX + (tx - CX) * tk, CY + (ty - CY) * tk, "•", [0, 118, 40, 28][k]);
        }
        const e = ease(t);
        put(g, CX + (tx - CX) * e, CY + (ty - CY) * e, "◆", 231);
      }
    });

    render(g);
    await sleep(35);
  }
}

// ---------- light beam sweep ----------
async function shimmer() {
  for (let f = 0; f < 50; f++) {
    const g = newGrid();
    labels.forEach((L) => {
      Array.from(L.text).forEach((ch, k) => {
        const x = L.x + k;
        const beam = f * 1.8 - 6 - L.y * 2;
        const d = Math.abs(x - beam);
        const col = d < 2 ? 231 : d < 4 ? 157 : d < 7 ? 120 : L.color;
        put(g, x, L.y, ch, col);
      });
    });
    render(g);
    await sleep(35);
  }
}

// ---------- pac-man runs BETWEEN the skill rows (skills never hide) ----------
async function pacman() {
  const lanes = [2, 6]; // empty lines between the skill rows
  for (const lane of lanes) {
    for (let px = -4; px < W + 4; px++) {
      const g = skillsGrid();

      // dots still waiting to be eaten
      for (const l of lanes) {
        if (l < lane) continue;
        for (let x = 0; x < W; x += 2) {
          if (l === lane && x <= px) continue;
          put(g, x, l, "·", 34);
        }
      }

      put(g, px, lane, px % 2 ? "ᗧ" : "●", 226); // pac-man
      put(g, px - 5, lane, "ᗣ", px % 4 < 2 ? 51 : 45); // ghost
      render(g);
      await sleep(14);
    }
  }
  render(skillsGrid()); // final frame: skills only
}

// ---------- fireworks finale ----------
async function fireworks() {
  const rockets = Array.from({ length: 7 }, (_, i) => ({
    x: 8 + rnd(W - 16),
    y: H - 1,
    top: 1 + rnd(4),
    start: i * 7,
    col: [46, 82, 118, 154, 190, 51, 231][i],
    done: false,
  }));
  let parts = [];
  const total = 7 * 7 + 40;

  for (let f = 0; f < total; f++) {
    const g = newGrid();

    for (const r of rockets) {
      if (f < r.start || r.done) continue;
      const age = f - r.start;
      const y = r.y - age * 0.8;
      if (y <= r.top) {
        r.done = true;
        for (let k = 0; k < 28; k++) {
          const a = (k / 28) * Math.PI * 2;
          const v = 0.6 + Math.random() * 1.1;
          parts.push({
            x: r.x,
            y: r.top,
            vx: Math.cos(a) * v * 2,
            vy: Math.sin(a) * v * 0.7,
            life: 14 + rnd(8),
            age: 0,
            col: r.col,
          });
        }
      } else {
        put(g, r.x, y, "|", 231);
        put(g, r.x, y + 1, "¦", 40);
        put(g, r.x, y + 2, "·", 22);
      }
    }

    parts = parts.filter((p) => p.age < p.life);
    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.age++;
      const t = p.age / p.life;
      put(g, p.x, p.y, t < 0.3 ? "✦" : t < 0.6 ? "*" : t < 0.85 ? "+" : "·", t < 0.3 ? 231 : t < 0.7 ? p.col : 22);
    }

    render(g);
    await sleep(45);
  }
  out(`\x1b[${H}A\x1b[J`); // clears only the fireworks area
}

async function type(text, delay = 50) {
  for (const ch of text) {
    out(ch);
    await sleep(delay);
  }
}

async function main() {
  out(HIDE);

  await boot(); // 1. hacker boot log
  await snake(); // 2. snake

  // 3. your information
  for (let i = 0; i < box.length; i++) {
    await decode(box[i], c(greens[(i * 2) % greens.length]));
  }
  for (let f = 0; f < 60; f++) {
    out(`\x1b[${box.length}A`);
    paint(f);
    await sleep(50);
  }
  await glitch(); // 4. glitch burst

  // 5. skills (stay visible from here on)
  out("\n" + c(46) + "Skills\n" + R);
  await blast();
  await shimmer();
  await pacman(); // 6. pac-man runs between the rows

  // 7. fireworks in a fresh area BELOW the skills
  out("\n");
  out("\n".repeat(H));
  await fireworks();

  out(c(46));
  await type("Thanks for visiting!");
  for (let i = 0; i < 8; i++) {
    out(i % 2 ? "\b \b" : "█");
    await sleep(250);
  }
  out(R + "\n" + SHOW);
}

main();