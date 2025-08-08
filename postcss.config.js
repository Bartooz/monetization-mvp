const createPreset = require('tailwindcss/createPreset');

module.exports = {
  plugins: {
    tailwindcss: createPreset(), // 👈 this line is KEY for Tailwind v4
    autoprefixer: {},
  },
};