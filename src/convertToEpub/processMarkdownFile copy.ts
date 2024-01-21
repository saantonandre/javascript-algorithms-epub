import path from "path";
import fs from "fs";
export async function processMarkdownFile(filePath: string) {
  const markdown = await fs.promises.readFile(filePath, "utf8");
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