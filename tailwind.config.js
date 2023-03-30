/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				robotoMono: ['Roboto Mono', 'monospace'],
			},
			animation: {
				border: 'background ease infinite',
			},
			keyframes: {
				background: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
			},
		},
	},
	plugins: [],
}
