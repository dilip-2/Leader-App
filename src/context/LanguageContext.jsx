// src/context/LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const LanguageContext = createContext();

// 👉 Yahan apne saare text add karte jao (jitni zaroorat ho utna badhao)
const translations = {
  en: {
    home: "Home",
    logout: "Logout",
    welcome: "Welcome",
    addBanner: "Add New Banner",
    upload: "Upload",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    update: "Update",
  },
  hi: {
    home: "होम",
    logout: "लॉग आउट",
    welcome: "स्वागत है",
    addBanner: "नया बैनर जोड़ें",
    upload: "अपलोड करें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    update: "अपडेट करें",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(Cookies.get("app_lang") || "en");

  useEffect(() => {
    Cookies.set("app_lang", lang, { expires: 365, path: "/" });
  }, [lang]);

  // t("home") -> "Home" ya "होम" (current language ke hisaab se)
  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);