import path from "path";
import { removeUnnecessaryFiles } from "removeUnnecessaryFiles";
import { convertToEpub } from "convertToEpub";
import { downloadRepo } from "downloadRepo";

const REPO_URL = "https://github.com/trekhleb/javascript-algorithms";
const REPO_PATH = path.join(__dirname, "./repo");
const OUTPUT_PATH = path.join(__dirname, "./dist");
const COVER_PATH = path.join(__dirname, "./src/assets/cover.png");

const start = async () => {
  await downloadRepo(REPO_URL, REPO_PATH);
  await removeUnnecessaryFiles(REPO_PATH);
  await convertToEpub(REPO_PATH, OUTPUT_PATH, COVER_PATH);
};
start();
