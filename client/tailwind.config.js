/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FF5A5F', // Orange primary
                'primary-dark': '#E04E4E',
                secondary: '#00A699',
                accent: '#FF8C55',
            },
            boxShadow: {
                'card': '0 4px 12px rgba(0,0,0,0.08)',
                'card-hover': '0 6px 20px rgba(0,0,0,0.15)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'scale': 'scale 0.2s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scale: {
                    '0%': { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
