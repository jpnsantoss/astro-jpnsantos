module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		container: {
			center: true,
			screens: {
				"2xl": "1400px",
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			colors: {
				background: "#fff",
				primary: "#191c1f",
				foreground: "#505a63",
				muted: {
					DEFAULT: "#f7f7f7",
					foreground: "#81898f",
				}
			},
			borderRadius: {
				"card": "20px",
			},
			boxShadow: {
				'card': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
			},
		},
	},
	plugins: [],
};
