@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-neon: var(--neon);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}

:root {
  color-scheme: dark;
  --background: oklch(0.05 0.005 240);
  --foreground: oklch(0.92 0.02 200);
  --card: oklch(0.09 0.01 235 / 70%);
  --card-foreground: oklch(0.92 0.02 200);
  --popover: oklch(0.08 0.01 235);
  --popover-foreground: oklch(0.92 0.02 200);
  --primary: oklch(0.78 0.15 200);
  --primary-foreground: oklch(0.05 0.005 240);
  --secondary: oklch(0.16 0.02 230);
  --secondary-foreground: oklch(0.92 0.02 200);
  --muted: oklch(0.14 0.015 230);
  --muted-foreground: oklch(0.6 0.03 210);
  --accent: oklch(0.2 0.04 210);
  --accent-foreground: oklch(0.92 0.02 200);
  --destructive: oklch(0.62 0.22 20);
  --border: oklch(0.3 0.06 200 / 30%);
  --input: oklch(0.2 0.03 220 / 50%);
  --ring: oklch(0.78 0.15 200);
  --neon: oklch(0.82 0.16 195);
  --radius: 0.5rem;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    background-color: #050505;
  }
}

@keyframes octa-pulse {
  0%, 100% { opacity: 0.55; filter: drop-shadow(0 0 8px #00f5ff); }
  50% { opacity: 1; filter: drop-shadow(0 0 26px #00f5ff); }
}
.animate-octa-pulse { animation: octa-pulse 2.4s ease-in-out infinite; }

@keyframes neon-breathe {
  0%, 100% { box-shadow: 0 0 20px rgba(0,245,255,0.25), inset 0 0 20px rgba(0,245,255,0.1); }
  50% { box-shadow: 0 0 55px rgba(0,245,255,0.6), inset 0 0 30px rgba(0,245,255,0.25); }
}
.animate-neon-breathe { animation: neon-breathe 3s ease-in-out infinite; }

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
.animate-scanline { animation: scanline 4s linear infinite; }

@keyframes blink-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
.animate-blink-dot { animation: blink-dot 1.4s ease-in-out infinite; }

.text-glow {
  text-shadow: 0 0 8px rgba(0,245,255,0.7), 0 0 20px rgba(0,245,255,0.4);
}
