import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation strings
const resources = {
  en: {
    translation: {
      navbar: {
        search: "Search Scholarships",
        dashboard: "Dashboard",
        login: "Log in",
        logout: "Log out",
        language: "Language",
      },
      hero: {
        title: "Find the Perfect",
        titleHighlight: "Scholarship",
        subtitle: "Smart scholarship discovery engine. Matching students with global funding opportunities seamlessly.",
        searchPlaceholder: "Search by course, country, or keyword...",
        searchButton: "Search Scholarships"
      },
      stats: {
        active: "Active Scholarships",
        countries: "Countries",
        users: "Students Funded"
      },
      footer: {
        about: "About",
        privacy: "Privacy",
        terms: "Terms",
        help: "Help"
      },
      search: {
        results: "Showing",
        scholarships: "scholarships",
        filters: "Filters",
        country: "Country",
        level: "Degree Level",
        apply: "Apply Now"
      }
    }
  },
  hi: {
    translation: {
      navbar: {
        search: "छात्रवृत्ति खोजें",
        dashboard: "डैशबोर्ड",
        login: "लॉग इन",
        logout: "लॉग आउट",
        language: "भाषा",
      },
      hero: {
        title: "अपने लिए सही",
        titleHighlight: "छात्रवृत्ति खोजें",
        subtitle: "AI-संचालित छात्रवृत्ति खोज इंजन। छात्रों को वैश्विक फंडिंग अवसरों के साथ सहजता से मिलाना।",
        searchPlaceholder: "कोर्स, देश या कीवर्ड से खोजें...",
        searchButton: "छात्रवृत्ति खोजें",
      },
      stats: {
        active: "सक्रिय छात्रवृत्तियां",
        countries: "देश",
        users: "छात्रों को वित्त पोषित"
      },
      footer: {
        about: "हमारे बारे में",
        privacy: "गोपनीयता",
        terms: "शर्तें",
        help: "मदद"
      },
      search: {
        results: "दिखा रहे हैं",
        scholarships: "छात्रवृत्तियां",
        filters: "फ़िल्टर",
        country: "देश",
        level: "डिग्री स्तर",
        apply: "अभी आवेदन करें"
      }
    }
  },
  es: {
    translation: {
      navbar: {
        search: "Buscar Becas",
        dashboard: "Panel",
        login: "Iniciar sesión",
        logout: "Cerrar sesión",
        language: "Idioma",
      },
      hero: {
        title: "Encuentra la",
        titleHighlight: "Beca Perfecta",
        subtitle: "Motor de búsqueda impulsado por IA. Conectando estudiantes con oportunidades globales.",
        searchPlaceholder: "Buscar por curso, país o palabra clave...",
        searchButton: "Buscar Becas"
      },
      stats: {
        active: "Becas Activas",
        countries: "Países",
        users: "Estudiantes Financiados"
      },
      footer: {
        about: "Acerca",
        privacy: "Privacidad",
        terms: "Términos",
        help: "Ayuda"
      },
      search: {
        results: "Mostrando",
        scholarships: "becas",
        filters: "Filtros",
        country: "País",
        level: "Nivel de grado",
        apply: "Aplica ya"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
