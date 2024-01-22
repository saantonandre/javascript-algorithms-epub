import Epub from "epub-gen";
import path from "path";
import { existsSync, promises as fs } from "fs";
import { listFiles } from "utils/listFiles";
import { createChapter } from "./createChapter";
const title = "JavaScript Algorithms and Data Structures";

export async function convertToEpub(repoPath: string, outputPath: string,coverPath:string) {
  const chapters: Epub.Chapter[] = await Promise.all(
    listFiles(repoPath)
      .filter((file) => file.split("/").pop() === "README.md")
      .map(createChapter)
  );
  const options: Epub.Options = {
    version: 3,
    title,
    author: "trekhleb",
    cover: coverPath,
    content: chapters,
    lang: "en",
  };
  console.log("Generating EPUB...");
  if (!existsSync(outputPath)) {
    await fs.mkdir(outputPath);
  }
  const epub = new Epub(options, outputPath + "/" + title + ".epub");
  await epub.promise;
}
