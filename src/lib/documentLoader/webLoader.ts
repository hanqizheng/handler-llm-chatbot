import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";


export function initialHtmlLoader() {
  return new CheerioWebBaseLoader(
    "https://chunzuo.com/about.html",
    {
      selector: "p",
    }
  );
}