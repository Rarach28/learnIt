module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("@fullhuman/postcss-purgecss")({
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
        "./src/**/**/*.{js,jsx,ts,tsx}",
      ],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
    require("autoprefixer"),
  ],
};
