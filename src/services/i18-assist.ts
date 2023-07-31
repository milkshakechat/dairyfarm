import fs from "fs";
import path from "path";
import axios from "axios";
import { getGoogleTranslateSecret } from "@/utils/secrets";
import { sleep } from "@/utils/utils";

export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

// IDs need to be predefined when passed in as args.phrases
export const translatePage = async ({
  componentName,
  phrases,
}: TranslatePageProps) => {
  const dirPath = path.join(
    __dirname,
    `../scripts/i18-assist/output/${componentName}`
  );
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory /${componentName}/ is created.`);
  } else {
    console.log(`Directory /${componentName}/ already exists.`);
  }
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
    // // wealthy demand countries (7)
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
  async function runSequentially() {
    for (let i = 0; i < languages.length; i++) {
      const lang = languages[i];
      const phraseTranslations: string[] = [];
      const runSeq = async () => {
        for (let j = 0; j < phrases.length; j++) {
          const ph = phrases[j];
          const _trs = (
            await translate({
              lang: lang.google,
              text: ph.text,
            })
          ).replace(/"/g, `'`);
          const trs = `"${ph.key}.___${componentName}": "${_trs}",`;
          phraseTranslations.push(trs);
          await sleep(200);
        }
      };
      await runSeq();

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
        `../scripts/i18-assist/output/${componentName}/i18n.${lang.ant}.${componentName}.ts`
      );
      fs.writeFileSync(filePath, fileContent, "utf8");
      await sleep(1000);
      continue;
    }
  }
  await runSequentially();
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
    `../scripts/i18-assist/output/${componentName}/types.i18n.${componentName}.ts`
  );
  fs.writeFileSync(filePath, typeFile, "utf8");
  const phraseMappings = await Promise.all(
    phrases.map((ph) => {
      return `{ key: "${ph.key}", text: "${ph.text.replace(/"/g, `'`)}" },`;
    })
  );
  const phraseFile = `
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "${componentName}";
  const phrases: PhraseSet[] = [
  ${phraseMappings.join("\n")}
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  `;
  const filePhrasePath = path.join(
    __dirname,
    `../scripts/i18-assist/output/${componentName}/phrases.${componentName}.ts`
  );
  fs.writeFileSync(filePhrasePath, phraseFile, "utf8");
  await generatePlaceholderPrintVariables({ componentName, phrases });
  console.log(`
  
=============== FINISHED TRANSLATION ===============
  
  `);
  return;
};

export const translate = async ({
  lang,
  text,
}: {
  lang: string;
  text: string;
}): Promise<string> => {
  try {
    if (lang === "en") return text;
    const token = await getGoogleTranslateSecret();
    const payload = {
      q: text,
      target: lang,
      source: "en",
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
    console.log(e.message);
    return text;
  }
};

export const autoGenIDsPlaceholderPrint = async ({
  componentName,
  phrases,
}: TranslatePageProps) => {
  console.log("Generating IDs for phrases...");
  const phraseMappings = await Promise.all(
    phrases.map((ph) => {
      return `{ key: "${generateCamelCaseID(
        ph.text
      )}", text: "${ph.text.replace(/"/g, `'`)}" },`;
    })
  );
  const phraseFile = `
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "${componentName}";
  const phrases: PhraseSet[] = [
  ${phraseMappings.join("\n")}
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  `;
  const filePhrasePath = path.join(
    __dirname,
    `../scripts/i18-assist/phrases/phrases.${componentName}.ts`
  );
  fs.writeFileSync(filePhrasePath, phraseFile, "utf8");
};

function generateCamelCaseID(inputString: string, maxChars = 20) {
  // Remove special characters, commas, periods, and numbers using regex
  const words = inputString.replace(/[^a-zA-Z\s]/g, "").split(/\s+/);

  // Truncate each word to the first maxChars characters and convert to camel case
  const camelCaseWords = words
    .map((word) => word.slice(0, maxChars))
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

  // Create the camel case ID
  const wordCombo = camelCaseWords.join("");

  // Generate a random 3-char hex code
  const hexCode = Math.floor(Math.random() * 16777215)
    .toString(16)
    .substring(0, 3);

  // Concatenate the parts with the format
  const result = `_txt_${wordCombo}_${hexCode}`;
  return result;
}

export const generatePlaceholderPrintVariables = async ({
  componentName,
  phrases,
}: TranslatePageProps) => {
  const placeholderPrintVariables: string[] = [];
  const runSeq = async () => {
    for (let j = 0; j < phrases.length; j++) {
      const ph = phrases[j];

      const trs = `// const ${ph.key} = intl.formatMessage({ id: "${
        ph.key
      }.___${componentName}", defaultMessage: "${ph.text.replace(
        /"/g,
        `'`
      )}" });`;
      placeholderPrintVariables.push(trs);
      await sleep(200);
    }
  };
  await runSeq();

  const fileContent = `
// import { useIntl } from "react-intl";
// const intl = useIntl();
${placeholderPrintVariables.join("\n")}

export const varsComponentName = "${componentName}"
  `;
  const filePath = path.join(
    __dirname,
    `../scripts/i18-assist/output/${componentName}/vars.${componentName}.ts`
  );
  fs.writeFileSync(filePath, fileContent, "utf8");
};
