import path from "path";
import fs from "fs";

export async function processMarkdownFile(filePath: string) {
  const markdown = await fs.promises.readFile(filePath, "utf8");
  const processes: ((filePath: string, md: string) => string)[] = [replaceUrls];
  return processes.reduce((acc, process) => process(filePath, acc), markdown);
}
function replaceUrls(filePath: string, markdown: string) {
  console.log("Adjusting image urls...");
  const urls =
    markdown.match(/\]\((?!http).*?\)/g)?.map((url) => url.slice(2, -1)) || [];
  const processed = urls.reduce((acc, url) => {
    let mdFile = acc;
    if (url.includes("images/") || url.includes("assets/")) {
      const folderPathArray = filePath.split("/");
      folderPathArray.pop();
      const resolved = path.resolve(folderPathArray.join("/"), url);
      console.log(`Replacing ${url} with ${resolved}`);
      mdFile = mdFile.replaceAll(url, resolved);
    }
    if (url.includes("src/")) {
      const urlTitle = url.split("/").pop()!;
      console.log(`Replacing ${url} with ${urlTitle}`);
      mdFile = mdFile.replaceAll(url, urlTitle);
    }
    return mdFile;
  }, markdown);
  return processed;
}
