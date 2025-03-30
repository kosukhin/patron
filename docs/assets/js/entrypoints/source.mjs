import { Page } from "patron-components";
import { EntryPointRouting } from "../routing.mjs";

const main = () => {
  const routing = new EntryPointRouting(
    ".source-loader",
    ".source-page-area",
    ".source-menu"
  );

  routing.routes([
    {
      url: "/source",
      template: "pages/source/index.html",
      page: new Page("Источник"),
    },
    {
      url: "/source/source-active",
      template: "pages/source/source-active.html",
      page: new Page("SourceActive"),
    },
    {
      url: "/source/source-all",
      template: "pages/source/source-all.html",
      page: new Page("SourceAll"),
    },
    {
      url: "/source/source-applied",
      template: "pages/source/source-applied.html",
      page: new Page("SourceApplied"),
    },
    {
      url: "/source/source-dynamic",
      template: "pages/source/source-dynamic.html",
      page: new Page("Source Dynamic"),
    },
    {
      url: "/source/source-executor-applied",
      template: "pages/source/source-executor-applied.html",
      page: new Page("SourceExecutorApplied"),
    },
    {
      url: "/source/source-map",
      template: "pages/source/source-map.html",
      page: new Page("SourceMap"),
    },
    {
      url: "/source/source-once",
      template: "pages/source/source-once.html",
      page: new Page("SourceOnce"),
    },
    {
      url: "/source/source-race",
      template: "pages/source/source-race.html",
      page: new Page("SourceRace"),
    },
    {
      url: "/source/source-sequence",
      template: "pages/source/source-sequence.html",
      page: new Page("SourceSequence"),
    },
    {
      url: "/source/source-with-pool",
      template: "pages/source/source-with-pool.html",
      page: new Page("SourceWithPool"),
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
