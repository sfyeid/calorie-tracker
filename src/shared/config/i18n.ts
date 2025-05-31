import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import ruTranslations from "@/shared/locales/ru.json"
import enTranslations from "@/shared/locales/en.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ru",
    debug: import.meta.env.DEV,

    resources: {
      ru: {
        translation: ruTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
