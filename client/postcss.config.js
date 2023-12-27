module.exports = {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    "@fullhuman/postcss-purgecss": {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
        "./src/**/**/*.{js,jsx,ts,tsx}",
      ],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    },
    autoprefixer: {},
  },
};
