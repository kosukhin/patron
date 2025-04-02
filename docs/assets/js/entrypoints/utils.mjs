import { Page } from "patron-components";
import { EntryPointRouting } from "../routing.mjs";

const main = () => {
  const routing = new EntryPointRouting(
    ".utils-loader",
    ".utils-page-area",
    ".utils-menu"
  );

  routing.routes([
    {
      url: "/utils",
      template: "pages/utils/index.html",
      page: new Page("Утилиты"),
    },
    {
      url: "/utils/give",
      template: "pages/utils/give.html",
      page: new Page("give функция"),
    },
    {
      url: "/utils/value",
      template: "pages/utils/value.html",
      page: new Page("value функция"),
    },
    {
      url: "/utils/private",
      template: "pages/utils/private.html",
      page: new Page("Private"),
    },
    {
      url: "/utils/is-patron-in-pools",
      template: "pages/utils/is-patron-in-pools.html",
      page: new Page("isPatronInPools"),
    },
    {
      url: "/utils/remove-patron-from-pools",
      template: "pages/utils/remove-patron-from-pools.html",
      page: new Page("removePatronFromPools"),
    },
    {
      url: "/utils/is-source",
      template: "pages/utils/is-source.html",
      page: new Page("isSource"),
    },
    {
      url: "/utils/is-guest",
      template: "pages/utils/is-guest.html",
      page: new Page("isGuest"),
    },
    {
      url: "/utils/source-of",
      template: "pages/utils/source-of.html",
      page: new Page("sourceOf"),
    },
    {
      url: "",
      template: "pages/404.html",
      page: new Page("Страница не найдена"),
      default: true,
    },
  ]);
};

export { main };
