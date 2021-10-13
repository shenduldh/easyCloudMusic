module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      height: {
        dh: '5%',
        dm: '85%',
        df: '10%'
      },
      fontSize: {
        us: '0.5rem',
      },
      gridTemplateColumns: {
        list: 'repeat(5,8rem)'
      }
    }
  },
  variants: {
    extend: {
      display: ['group-hover'],
    }
  }
}
