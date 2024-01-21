import { convertToEpub } from "converter";
import { downloadRepo, removeUnnecessaryFiles } from "initialize";

const start = async () => {
  // await downloadRepo();
  // await removeUnnecessaryFiles();
  await convertToEpub()
};
start()