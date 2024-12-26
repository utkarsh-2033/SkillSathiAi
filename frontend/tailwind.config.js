module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Include your React component files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',   // Green color for buttons and highlights
        secondary: '#FF9800', // Orange color for secondary actions
        background: '#f7f7f7', // Background color for the app
        border: '#e0e0e0',  // Light border color
        text: '#333333',    // Primary text color
        accent: '#007BFF',   // Blue for links and accents
      },
      spacing: {
        128: '32rem',  // Custom spacing for large sections
        144: '36rem',  // Additional custom spacing if needed
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'], // Using Inter font for modern UI
      },
      screens: {
        'sm': '640px',    // Mobile screens start from 640px
        'md': '768px',    // Tablet screens start from 768px
        'lg': '1024px',   // Desktop screens start from 1024px
        'xl': '1280px',   // Larger screens start from 1280px
        '2xl': '1536px',  // Very large screens start from 1536px
      },
      fontSize: {
        'xl': '1.25rem', // Font size for large text
        '2xl': '1.5rem', // Font size for headings or significant text
        '3xl': '1.875rem', // Font size for very large text (e.g., quiz questions)
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.1)', // Light shadow for cards or modals
        'button': '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow for buttons
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),  // For better form styling (input, select, textarea)
    require('@tailwindcss/typography'),  // For rich text formatting
    require('@tailwindcss/aspect-ratio'),  // For aspect ratios
  ],
}
