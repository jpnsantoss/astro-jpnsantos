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
				foreground: "#191c1f",
				muted: "#8d969e",
			},
			borderRadius: {
				xl: `calc(var(--radius) + 4px)`,
				lg: `var(--radius)`,
				md: `calc(var(--radius) - 2px)`,
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [],
};
