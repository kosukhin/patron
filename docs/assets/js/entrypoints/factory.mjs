import { Page } from "patron-components";
import { EntryPointRouting } from "../routing.mjs";

const main = () => {
  const routing = new EntryPointRouting(
    ".factory-loader",
    ".factory-page-area",
    ".factory-menu"
  );

  routing.routes([
    {
      url: "/factory",
      template: "pages/factory/index.html",
      page: new Page("Фабрика"),
    },
  ]);
};

export { main };
