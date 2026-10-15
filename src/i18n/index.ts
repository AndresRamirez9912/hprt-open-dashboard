// i18next setup: Spanish or English, chosen from the browser language (English otherwise).
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { es } from "./es";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { es: { translation: es }, en: { translation: en } },
    supportedLngs: ["es", "en"],
    nonExplicitSupportedLngs: true, // es-CO, en-GB… map to es / en
    fallbackLng: "en",
    detection: { order: ["navigator"], caches: [] }, // follow the browser, do not persist
    interpolation: { escapeValue: false }, // React already escapes
  });

// Keep <html lang> in sync for accessibility and correct hyphenation.
i18n.on("languageChanged", (lng) =>
  document.documentElement.setAttribute("lang", lng),
);
document.documentElement.setAttribute("lang", i18n.resolvedLanguage ?? "en");

export default i18n;
