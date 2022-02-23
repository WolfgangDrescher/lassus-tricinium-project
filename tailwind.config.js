module.exports = {
    content: [
        './src/App.vue',
        './src/components/**/*.{vue,html,js}',
        './src/views/**/*.{vue,html,js}',
    ],
    theme: {
        extend: {},
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
