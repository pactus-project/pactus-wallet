import TailwindTyporaphy from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/scenes/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0fef9e',
        'primary-dark': '#064560',
        'primary-light': '#4fffc0',
        background: '#15191c',
        surface: '#101010',
        'surface-light': '#242424',
        'surface-medium': '#1d2328',
        'text-primary': '#ffffff',
        'text-secondary': '#e1e1e1',
        'text-tertiary': '#858699',
        'text-disabled': '#6e6e6e',
        error: '#bd0f0f',
        'error-light': '#FFD7D7',
        success: '#0F840B',
        'success-light': '#C6FFBD',
        warning: '#ca6534',
        info: '#0f65ef',
        border: '#3e3e3e',
        'border-light': '#414144',
        divider: '#1d2328',
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        loose: '1.8',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        '2xl': '2.5rem', // 40px
        '3xl': '3rem', // 48px
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        pill: '100px',
        circle: '50%',
      },
      boxShadow: {
        sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        lg: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        button:
          '0px 0.303px 0.908px 0px rgba(0, 0, 0, 0.32), 0px 1.614px 3.631px 0px rgba(0, 0, 0, 0.28)',
        inset: '0px 0px 3px 2px #272B33 inset',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(91deg, #0fef9e -0.23%, #064560 105.78%)',
        'gradient-hover': 'linear-gradient(91deg, #4fffc0 -0.23%, #0fef9e 105.78%)',
      },
      transitionTimingFunction: {
        fast: 'ease',
        normal: 'ease',
        slow: 'ease',
      },
      transitionDuration: {
        fast: '200ms',
        normal: '300ms',
        slow: '500ms',
      },
      zIndex: {
        dropdown: '100',
        sticky: '200',
        fixed: '300',
        'modal-backdrop': '400',
        modal: '500',
        popover: '600',
        tooltip: '700',
      },
      screens: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1024px',
        'large-desktop': '1440px',
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.primary').join(', '),
            fontSize: theme('fontSize.base'),
            lineHeight: theme('lineHeight.normal'),
          },
        },
        sm: {
          css: {
            fontSize: theme('fontSize.sm'),
          },
        },
        lg: {
          css: {
            fontSize: theme('fontSize.lg'),
          },
        },
        xl: {
          css: {
            fontSize: theme('fontSize.xl'),
          },
        },
      }),
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.2' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.4' }], // 14px
        base: ['1rem', { lineHeight: '1.5' }], // 16px
        md: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.5' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '1.5' }], // 24px
        '3xl': ['1.75rem', { lineHeight: '1.5' }], // 28px
        '4xl': ['2.25rem', { lineHeight: '1.2' }], // 36px
        '5xl': ['2.8125rem', { lineHeight: '1.2' }], // 45px
      },
      border: {
        primary: '1px solid primary',
      },
    },
  },
  safelist: [
    // Colors
    {
      pattern:
        /(bg|text|border|divide|ring|stroke|fill)-(primary|primary-dark|primary-light|background|surface|surface-light|surface-medium|text-primary|text-secondary|text-tertiary|text-disabled|error|error-light|success|success-light|warning|info|border|border-light|divider)/,
    },
    // Font Sizes
    {
      pattern: /text-(xs|sm|base|md|lg|xl|2xl|3xl|4xl|5xl)/,
    },
    // Spacings
    {
      pattern: /(p|pt|pb|pl|pr|px|py|m|mt|mb|ml|mr|mx|my)-(xs|sm|md|lg|xl|2xl|3xl)/,
    },
    // Border Radius
    {
      pattern: /rounded-(sm|md|lg|xl|pill|circle)/,
    },
    // Shadows
    {
      pattern: /shadow-(sm|md|lg|button|inset)/,
    },
    // Z-Index
    {
      pattern: /z-(dropdown|sticky|fixed|modal-backdrop|modal|popover|tooltip)/,
    },
    // Others nếu cần thêm
  ],
  plugins: [TailwindTyporaphy],
};
