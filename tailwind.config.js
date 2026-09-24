/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--signal))',
  				'2': 'hsl(var(--quantum))',
  				'3': 'hsl(var(--traffic))',
  				'4': 'hsl(var(--feasible))',
  				'5': 'hsl(var(--warn))'
  			},
  			signal: 'hsl(var(--signal))',
  			quantum: 'hsl(var(--quantum))',
  			traffic: 'hsl(var(--traffic))',
  			feasible: 'hsl(var(--feasible))',
  			warn: 'hsl(var(--warn))',
  			incident: 'hsl(var(--incident))',
  			panel: 'hsl(var(--panel))',
  			hairline: 'hsl(var(--hairline))',
  			ink: {
  				DEFAULT: 'hsl(var(--ink))',
  				dim: 'hsl(var(--ink-dim))',
  				faint: 'hsl(var(--ink-faint))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--panel))',
  				foreground: 'hsl(var(--ink-dim))',
  				primary: 'hsl(var(--signal))',
  				'primary-foreground': 'hsl(var(--background))',
  				accent: 'hsl(var(--accent))',
  				'accent-foreground': 'hsl(var(--ink))',
  				border: 'hsl(var(--hairline))',
  				ring: 'hsl(var(--signal))'
  			}
  		},
  		fontFamily: {
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		letterSpacing: {
  			tightest: '-0.04em',
  			ultra: '0.22em'
  		},
  		keyframes: {
  			'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
  			'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
  			'signal-pulse': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
  			'dash-flow': { to: { strokeDashoffset: '-100' } },
  			'sweep': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(300%)' } },
  			'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
  			'rise': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
  			'spin-slow': { to: { transform: 'rotate(360deg)' } },
  			'breathe': { '0%,100%': { opacity: '0.5' }, '50%': { opacity: '0.9' } }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'signal-pulse': 'signal-pulse 1.8s ease-in-out infinite',
  			'dash-flow': 'dash-flow 1.6s linear infinite',
  			'sweep': 'sweep 2.2s ease-in-out infinite',
  			'fade-in': 'fade-in 0.4s ease-out both',
  			'rise': 'rise 0.5s cubic-bezier(0.22,1,0.36,1) both',
  			'spin-slow': 'spin-slow 8s linear infinite',
  			'breathe': 'breathe 3.5s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
