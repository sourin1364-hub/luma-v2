/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "luma-navy": "#0B0D1A",
        "luma-navy-light": "#131627",
        "luma-navy-lighter": "#1C2033",
        "luma-gold": "#D6B56D",
        "luma-gold-light": "#E8C77A",
        "luma-gold-dark": "#B8944E",
        "luma-purple": "#4A2D6B",
        "luma-purple-light": "#6B4A8F",
        "luma-cream": "#F5EFE0",
        "element-water-deep": "#0A2540",
        "element-water": "#1E6091",
        "element-water-light": "#48CAE4",
        "element-fire-deep": "#3D0C02",
        "element-fire": "#C1121F",
        "element-fire-light": "#F77F00",
        "element-air-deep": "#2C3E50",
        "element-air": "#7B9BB5",
        "element-air-light": "#E0F0FF",
        "element-earth-deep": "#1B3A2F",
        "element-earth": "#5A7D5A",
        "element-earth-light": "#A8C09A",
        "success": "#10B981",
        "warning": "#F59E0B",
        "error": "#EF4444",
        "info": "#3B82F6"
      },
      fontFamily: {
        // فونت اصلی فارسی (برای همه متن‌ها از جمله عنوان‌ها)
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
        // فونت نمایشی فقط برای لوگو و اعداد لاتین
        display: ["Cormorant Garamond", "serif"],
        // فونت تیتر فارسی (وزن بولد Vazirmatn)
        heading: ["Vazirmatn", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"]
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "3xs": ["0.5rem", { lineHeight: "0.75rem" }]
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      },
      boxShadow: {
        "glow-gold": "0 0 20px rgba(214, 181, 109, 0.4)",
        "glow-gold-sm": "0 0 10px rgba(214, 181, 109, 0.3)",
        "glow-purple": "0 0 20px rgba(74, 45, 107, 0.5)",
        "inner-soft": "inset 0 1px 2px rgba(255, 255, 255, 0.05)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.3)"
      },
      backdropBlur: {
        "xs": "2px"
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-in-up": "fadeInUp 0.4s ease-out",
        "shimmer": "shimmer 2s infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      }
    }
  },
  plugins: []
};