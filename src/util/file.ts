import fs from "fs";

export function deleteFile(filePath: string) {
  fs.unlink("src/" + filePath, (err) => {
    if (err) throw err;
  });
}
