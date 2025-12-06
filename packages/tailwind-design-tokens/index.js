const colors = require('./colors/index.js');
const spacing = require('./spacing/index.js');
const typography = require('./typography/index.js');

/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors,
      spacing,
      fontSize: typography,
    },
  },
};

module.exports = config;

// Export separately for semantic tokens or direct usage
module.exports.colors = colors;
module.exports.spacing = spacing;
module.exports.typography = typography;
