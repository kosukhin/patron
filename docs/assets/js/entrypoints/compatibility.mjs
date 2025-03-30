import { Page } from "patron-components";
import { EntryPointRouting } from "../routing.mjs";

const main = () => {
  const routing = new EntryPointRouting(
    ".compatibility-loader",
    ".compatibility-page-area",
    ".compatibility-menu"
  );

  routing.routes([
    {
      url: "/compatibility/elegant-objects",
      template: "pages/compatibility/elegant-objects.html",
      page: new Page("Elegant Objects"),
    },
    {
      url: "/compatibility/dip",
      template: "pages/compatibility/dip.html",
      page: new Page("DIP"),
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
