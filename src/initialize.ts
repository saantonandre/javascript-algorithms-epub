import { existsSync, promises as fs } from "fs";
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
  if (!existsSync(REPO_PATH)) {
    await fs.mkdir(REPO_PATH);
  }
  console.log(`Clearing path ${REPO_PATH}...`);
  await fs.rm(REPO_PATH, { recursive: true });
  console.log(`Downloading repository "${repoWebURL}"...`);
  await new Promise<void>((resolve) => {
    cloneRepository(repoWebURL, REPO_PATH, undefined, () => resolve());
  });
}

export async function removeUnnecessaryFiles() {
  console.log(`Removing unnecessary files...`);
  let removedFiles = 0;
  let removedFolders = 0;
  const removePromises: Promise<void>[] = [];
  const folders: string[] = [];
  listFiles(
    REPO_PATH,
    undefined,
    (filePath) => {
      const isAssetFile = filePath.includes("/assets/");
      const isPlayground = filePath.includes("/playground/");
      const isImageFile = filePath.includes("/images/");
      const isEngReadme = filePath.split("/").pop() === "README.md";
      if (!(isImageFile || isAssetFile || isEngReadme || !isPlayground)) {
        removedFiles++;
        removePromises.push(fs.rm(filePath));
      }
    },
    (folderPath) => folders.push(folderPath)
  );
  await Promise.all(removePromises);
  console.log(`Removing empty directories...`);
  folders
    .filter(async (folder) => (await fs.readdir(folder)).length === 0)
    .sort((a, b) => (a.length < b.length ? 1 : -1))
    .forEach(async (folder) => {
      removedFolders++;
      await fs.rm(folder, { recursive: true });
    });
  console.log(
    `Removed ${removedFiles} files and ${removedFolders} directories`
  );
}
