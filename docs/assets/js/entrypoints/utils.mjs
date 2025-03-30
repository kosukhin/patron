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
      url: "/utils/is-guest-aware",
      template: "pages/utils/is-guest-aware.html",
      page: new Page("isGuestAware"),
    },
    {
      url: "/utils/is-guest",
      template: "pages/utils/is-guest.html",
      page: new Page("isGuest"),
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
