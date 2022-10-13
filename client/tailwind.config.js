module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx,jsx}'],
  theme: {
    extend: {
      width: {
        62: '62%'
      },
      height: {
        56: '56%'
      },
      borderWidth: {
        thin: '0.3px'
      }
    },
    colors: {
      'blue-lightest': '#A8DADC',
      'blue-light': '#457b9d',
      blue: '#1d3557',
      red: '#e63946',
      honeydew: '#f1faee',
      white: '#fdfdfd',
      green: '#28a428',
      grey: '#d9d9d9',
      'dark-grey': '#343A40',
      'rich-black': '#141d29',
      'blue-fade': 'rgba(168,218,220,.1)',
      'blue-fade-bold': 'rgba(168,218,220,.3)',
      'grey-fade': 'rgba(217, 217, 217, .1)',
      'black-fade': 'rgba(0, 0, 0, .4)',
      black: '#000000',
      orangered: '#FF4500'
    }
  },
  plugins: []
}
