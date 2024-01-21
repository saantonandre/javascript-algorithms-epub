import Showdown from "showdown";
import Epub from "epub-gen";
import path from "path";
import { existsSync, promises as fs } from "fs";
import { REPO_PATH } from "initialize";
import { listFiles } from "listFiles";
export const mdConverter = new Showdown.Converter({ tables: true });
const title = "JavaScript Algorithms and Data Structures";
export const OUTPUT_PATH = path.join(__dirname, "./dist");

export async function convertToEpub() {
  const chapters: Epub.Chapter[] = await Promise.all(
    listFiles(REPO_PATH)
      .filter((file) => file.split("/").pop() === "README.md")
      .map(createChapter)
  );
  const options: Epub.Options = {
    version: 3,
    title,
    author: "trekhleb",
    cover: path.resolve(__dirname, "./src/assets/cover.png"),
    content: chapters,
    lang: "en",
  };
  console.log("Generating EPUB...");
  if (!existsSync(OUTPUT_PATH)) {
    await fs.mkdir(OUTPUT_PATH);
  }
  const epub = new Epub(options, OUTPUT_PATH + "/" + title);
  await epub.promise;
}

async function processMarkdownFile(filePath: string) {
  const markdown = await fs.readFile(filePath, "utf8");
  console.log("Adjusting image urls...");
  const urls =
    markdown.match(/\]\((?!http).*?\)/g)?.map((url) => url.slice(2, -1)) || [];
  const processed = urls.reduce((acc, url) => {
    if (url.includes("images/") || url.includes("assets/")) {
      const folderPathArray = filePath.split("/");
      folderPathArray.pop();
      const resolved = path.resolve(folderPathArray.join("/"), url);
      console.log(`Replacing ${url} with ${resolved}`);
      return acc.replaceAll(url, resolved);
    }
    return acc;
  }, markdown);

  return processed;
}

async function createChapter(filePath: string) {
  console.log("Processing markdown files...");
  const markdown = await processMarkdownFile(filePath);
  const chapter: Epub.Chapter = {
    title: filePath
      .split("/")
      .slice(-2, -1)
      .pop()
      ?.split("-")
      .map((str) => str[0].toUpperCase() + str.slice(1))
      .join(" "),
    data: mdConverter.makeHtml(markdown),
  };
  return chapter;
}
