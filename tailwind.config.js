// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Custom utility: use 'font-xanhmono' in your classes
        xanhmono: ["'Xanh Mono'", 'monospace'],
        // Optionally, set as default sans
        sans: ["'Xanh Mono'", 'monospace'],
      },
    },
  },
  plugins: [],
};
