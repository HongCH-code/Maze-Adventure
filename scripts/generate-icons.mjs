/**
 * Generate PWA app icons (192x192 and 512x512) + favicon (32x32)
 * Design: maze pattern background with a gold star in the center
 */
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

function buildSvg(size) {
  const s = size;
  const wall = "#2a2a4e";
  const path = "#4a90d9";
  const bg = "#1a1a2e";

  // Grid-based mini maze (8x8 grid)
  const cellSize = s / 8;
  // 0 = wall, 1 = path
  const maze = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  let mazeRects = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const color = maze[r][c] === 1 ? path : wall;
      mazeRects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}"/>`;
    }
  }

  // Gold star in center
  const cx = s / 2;
  const cy = s / 2;
  const outer = s * 0.22;
  const inner = s * 0.09;
  let starPoints = "";
  for (let i = 0; i < 5; i++) {
    const oa = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const ia = oa + Math.PI / 5;
    starPoints += `${cx + Math.cos(oa) * outer},${cy + Math.sin(oa) * outer} `;
    starPoints += `${cx + Math.cos(ia) * inner},${cy + Math.sin(ia) * inner} `;
  }

  // Glow circle behind star
  const glowR = s * 0.28;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="${bg}" rx="${s * 0.12}"/>
  ${mazeRects}
  <!-- Round corners mask -->
  <defs>
    <mask id="roundMask">
      <rect width="${s}" height="${s}" fill="black"/>
      <rect width="${s}" height="${s}" fill="white" rx="${s * 0.12}"/>
    </mask>
  </defs>
  <rect width="${s}" height="${s}" fill="${bg}" mask="url(#roundMask)"/>
  <!-- Redraw maze inside rounded rect -->
  <g mask="url(#roundMask)">
    <rect width="${s}" height="${s}" fill="${bg}"/>
    ${mazeRects}
  </g>
  <!-- Star glow -->
  <circle cx="${cx}" cy="${cy}" r="${glowR}" fill="#1a1a2e" opacity="0.85"/>
  <circle cx="${cx}" cy="${cy}" r="${glowR * 0.85}" fill="#222244" opacity="0.6"/>
  <!-- Gold star -->
  <polygon points="${starPoints.trim()}" fill="#ffd700" stroke="#ffaa00" stroke-width="${s * 0.01}"/>
  <!-- Shine dot -->
  <circle cx="${cx - outer * 0.25}" cy="${cy - outer * 0.35}" r="${s * 0.025}" fill="white" opacity="0.7"/>
</svg>`;
}

async function generate() {
  const sizes = [
    { name: "icon-512.png", size: 512 },
    { name: "icon-192.png", size: 192 },
    { name: "favicon.ico", size: 32 },
  ];

  for (const { name, size } of sizes) {
    const svg = buildSvg(size);
    const buf = Buffer.from(svg);
    const outPath = join(publicDir, name);

    await sharp(buf).png().toFile(outPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Also generate an SVG version for modern browsers
  const svgContent = buildSvg(512);
  const fs = await import("fs");
  fs.writeFileSync(join(publicDir, "icon.svg"), svgContent);
  console.log("Generated icon.svg");
}

generate().catch(console.error);
