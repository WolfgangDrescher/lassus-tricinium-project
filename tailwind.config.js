const { purple } = require('tailwindcss/colors');

module.exports = {
    content: [
        './src/layouts/**.{vue,html,js}',
        './src/components/**/*.{vue,html,js}',
        './src/pages/**/*.{vue,html,js}',
    ],
    theme: {
        extend: {
            colors: {
                primary: purple,
            },
            gridTemplateColumns: {
                filter: 'repeat(auto-fill, minmax(200px, 1fr))',
            },
        },
        fontFamily: {
            fraktur: "'UnifrakturMaguntia', cursive",
        },
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                md: '3rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        },
    },
    plugins: [],
};
