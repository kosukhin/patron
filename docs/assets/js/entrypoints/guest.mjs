import { Page } from "patron-components";
import { EntryPointRouting } from "../routing.mjs";

const main = () => {
  const routing = new EntryPointRouting(
    ".guest-loader",
    ".guest-page-area",
    ".guest-menu"
  );

  routing.routes([
    {
      url: "/guest",
      template: "pages/guest/index.html",
      page: new Page("Класс Guest"),
    },
    {
      url: "/guest/guest-cast",
      template: "pages/guest/guest-cast.html",
      page: new Page("GuestCast"),
    },
    {
      url: "/guest/guest-object",
      template: "pages/guest/guest-object.html",
      page: new Page("GuestObject"),
    },
    {
      url: "/guest/guest-pool",
      template: "pages/guest/guest-pool.html",
      page: new Page("GuestPool"),
    },
    {
      url: "/guest/guest-sync",
      template: "pages/guest/guest-sync.html",
      page: new Page("GuestSync"),
    },
    {
      url: "/guest/guest-disposable",
      template: "pages/guest/guest-disposable.html",
      page: new Page("GuestDisposable"),
    },
    {
      url: "/guest/guest-applied",
      template: "pages/guest/guest-applied.html",
      page: new Page("GuestApplied"),
    },
    {
      url: "/guest/guest-executor-applied",
      template: "pages/guest/guest-executor-applied.html",
      page: new Page("GuestExecutorApplied"),
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
