import fs from "fs";
import path from "path";
import axios from "axios";
import { getGoogleTranslateSecret } from "@/utils/secrets";

export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}
export const translatePage = async ({
  componentName,
  phrases,
}: TranslatePageProps) => {
  /**
   * const componentName = "TemplateComponent"
   * const phrases = [
      { key: "text1", text: "hello" },
      { key: "text1", text: "hello" },
    ];
    await translatePage({ componentName, phrases })
   * 
   */
  const languages = [
    // wealthy demand countries (7)
    { title: "English", google: "en", ant: "en" },
    { title: "Japanese", google: "ja", ant: "ja" },
    { title: "Korean", google: "ko", ant: "kr" },
    { title: "French", google: "fr", ant: "fr" },
    { title: "German", google: "de", ant: "de" },
    { title: "Italian", google: "it", ant: "it" },
    { title: "Arabic", google: "ar", ant: "ar" },

    // middle demand & supply (5)
    { title: "Chinese", google: "zh", ant: "zh" },
    { title: "Spanish", google: "es", ant: "es" },
    { title: "Hindi", google: "hi", ant: "hi" },
    { title: "Polish", google: "pl", ant: "pl" },
    { title: "Turkish", google: "tr", ant: "tr" },

    // developing supply countries (10)
    { title: "Thai", google: "th", ant: "th" },
    { title: "Vietnamese", google: "vi", ant: "vi" },
    { title: "Russian", google: "ru", ant: "ru" },
    { title: "Portuguese", google: "pt", ant: "pt" },
    { title: "Tagalog", google: "fil", ant: "tl-ph" },
    { title: "Indonesian", google: "id", ant: "id" },
    { title: "Ukrainian", google: "uk", ant: "uk" },
    { title: "Bengali", google: "bn", ant: "bn" },
    { title: "Malaysian", google: "ms", ant: "ms" },
    { title: "Urdu", google: "ur", ant: "ur" },
  ];
  await Promise.all(
    languages.map(async (lang) => {
      const phraseTranslations = await Promise.all(
        phrases.map(async (ph) => {
          return `"${ph.key}.___${componentName}": "${await translate({
            lang: lang.google,
            text: ph.text,
          })}",`;
        })
      );

      const fileContent = `
import { i18n_Mapping } from "./types.i18n.${componentName}";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    ${phraseTranslations.join("\n")}
  };
  return language;
};
  `;
      const filePath = path.join(
        __dirname,
        `../scripts/i18-assist/output/i18n.${lang.ant}.${componentName}.ts`
      );
      fs.writeFileSync(filePath, fileContent, "utf8");
      return;
    })
  );
  const typeMappings = await Promise.all(
    phrases.map((ph) => {
      return `"${ph.key}.___${componentName}": string;`;
    })
  );
  const typeFile = `
export const cid = "___${componentName}";
export interface i18n_Mapping {
  ${typeMappings.join("\n")}
}
  `;
  const filePath = path.join(
    __dirname,
    `../scripts/i18-assist/output/types.i18n.${componentName}.ts`
  );
  fs.writeFileSync(filePath, typeFile, "utf8");
};

export const translate = async ({
  lang,
  text,
}: {
  lang: string;
  text: string;
}): Promise<string> => {
  try {
    const token = await getGoogleTranslateSecret();
    const payload = {
      q: text,
      target: lang,
    };
    const res = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${token}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data.data.translations);
    const translation = res.data.data.translations[0].translatedText;
    return translation || text;
  } catch (e: any) {
    console.log(`failed with ${lang}: ${text}`);
    console.log(e);
    return text;
  }
};
