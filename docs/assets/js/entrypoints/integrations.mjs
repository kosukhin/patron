import { Page } from "patron-components";
import { EntryPointRouting } from "../routing.mjs";

const main = () => {
  const routing = new EntryPointRouting(
    ".integrations-loader",
    ".integrations-page-area",
    ".integrations-menu"
  );

  routing.routes([
    {
      url: "/integrations/vue",
      template: "pages/integrations/vue.html",
      page: new Page("Vue"),
    },
    {
      url: "/integrations/angular",
      template: "pages/integrations/angular.html",
      page: new Page("Angular"),
    },
    {
      url: "/integrations/react",
      template: "pages/integrations/react.html",
      page: new Page("React"),
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
