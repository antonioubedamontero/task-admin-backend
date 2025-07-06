const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

const {
  availableTranslations,
  defaultLanguage,
} = require("./available-translations");

i18next
  .use(Backend) // to read .json translations
  .use(middleware.LanguageDetector) // to get language from headers
  .init({
    fallbackLng: defaultLanguage,
    preload: [...availableTranslations],
    backend: {
      loadPath: __dirname + "/locales/{{lng}}/translation.json",
    },
  });

module.exports = { i18next, middleware };
