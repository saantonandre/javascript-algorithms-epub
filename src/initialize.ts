import fs from "fs";
import path from "path";
import cloneRepository from "git-clone";
import { listFiles } from "listFiles";

export const REPO_PATH = path.join(__dirname, "repo");

/**
 * Downloads the content of the source repo to the /repo folder
 */
export async function downloadRepo(
  repoWebURL: string = "https://github.com/trekhleb/javascript-algorithms"
) {
  if (!fs.existsSync(REPO_PATH)) {
    fs.mkdirSync(REPO_PATH);
  }
  console.log(`Clearing path ${REPO_PATH}...`);
  fs.rmSync(REPO_PATH, { recursive: true });
  console.log(`Downloading repository "${repoWebURL}"...`);
  await new Promise<void>((resolve) => {
    cloneRepository(repoWebURL, REPO_PATH, undefined, () => resolve());
  });
}

export async function removeUnnecessaryFiles() {
  console.log(`Removing unnecessary files...`);
  let removedFiles = 0;
  let removedFolders = 0;
  const folders: string[] = [];
  listFiles(
    REPO_PATH,
    undefined,
    (filePath) => {
      const isAssetFile = filePath.includes("/assets/");
      const isPlayground = filePath.includes("/playground/");
      const isImageFile = filePath.includes("/images/");
      const isEngReadme = filePath.split("/").pop() === "README.md";
      if (!(isImageFile || isAssetFile || isEngReadme) || isPlayground) {
        removedFiles++;
        fs.rmSync(filePath);
      }
    },
    (folderPath) => folders.push(folderPath)
  );
  console.log(`Removing empty directories...`);
  folders
    .filter((folder) => fs.readdirSync(folder).length === 0)
    .sort((a, b) => (a.length < b.length ? 1 : -1))
    .forEach((folder) => {
      removedFolders++;
      fs.rmSync(folder, { recursive: true });
    });
  console.log(
    `Removed ${removedFiles} files and ${removedFolders} directories`
  );
}
