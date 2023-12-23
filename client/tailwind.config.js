module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          // primary: "#007fff",

          // secondary: "#60a5fa",

          // accent: "#7dd3fc",

          // neutral: "#2f2a26",

          // "base-100": "#242424",

          // info: "#00d5ff",

          // success: "#00dc01",

          // warning: "#ffb200",

          // error: "#ff6378",

          primary: "#9400ff",

          secondary: "#8b5cf6",

          accent: "#e879f9",

          neutral: "#45246c",

          "base-100": "#242a2d",

          info: "#a78bfa",

          success: "#84cc16",

          warning: "#fbbf24",

          error: "#fa0809",
          // primary: "#064e3b",
          // secondary: "#166534",
          // accent: "#fbbf24",
          // neutral: "#374151",
          // "base-100": "#1f2626",
          // info: "#00c4ff",
          // success: "#00ac00",
          // warning: "#f59e0b",
          // error: "#f43f5e",
        },
        trempi: {
          primary: "#00a2bc",
          secondary: "#3c6400",
          accent: "#c0a500",
          neutral: "#374151",
          "base-100": "#1f2626",
          info: "#00c4ff",
          success: "#00ac00",
          warning: "#be3700",
          error: "#ff6a7c",
        },
        trempi2: {
          primary: "#15803d",
          secondary: "#009000",
          accent: "#959700",
          neutral: "#2f2d32",
          "base-100": "#064e3b",
          info: "#0097ff",
          success: "#00f3cf",
          warning: "#f2a800",
          error: "#ff004e",
        },
        mybusiness: {
          ...require("daisyui/src/theming/themes")["business"],
          success: "#00ac00",
          warning: "#f59e0b",
          error: "#f43f5e",
          accent: "f8b000",
        },
      },
      "light",
      "black",
      "forest",
      "sunset",
      "luxury",
      "business",
      "dim",
    ],
  },
};
