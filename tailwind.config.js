module.exports = {
  purge: {
    enabled: true,
    content: [
      './templates/**/*.html',
      './src/**/*.css'
    ]
  },
  theme: {
    extend: {
      fontFamily: {
        'avenir-book': ['Avenir Book', 'sans-serif'],
        'avenir-heavy': ['Avenir Heavy', 'sans-serif'],
        'avenir-light': ['Avenir Light', 'sans-serif'],
        'avenir-medium': ['Avenir Medium', 'sans-serif'],
        'produkt-bold': ['Produkt Bold', 'monospace'],
        'produkt-light': ['Produkt Light', 'monospace'],
        'produkt-medium': ['Produkt Medium', 'monospace'],
        'produkt-regular': ['Produkt Regular', 'monospace'],
        'produkt-semibold': ['Produkt Semibold', 'monospace'],
      },

      colors: {
        'ucsb-navy': '#003660',
        'ucsb-gold': '#FEBC11',
        'ucsb-sea-green': '#09847A',
        'ucsb-coral': '#EF5645',
        'ucsb-mist': '#9CBEBE'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
