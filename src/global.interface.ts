import { closeSync, fdatasyncSync, openSync, readFileSync, writeSync } from "fs";
import { createHash, randomBytes } from "crypto";

export const uid = () => randomBytes(16).toString("hex");

export class RecvFile {
  tmpFile: string;
  tmpFd: number;
  constructor(readonly fileName: string, readonly size: number, readonly md5?: string) {
    this.tmpFile = "/tmp/" + uid();
    this.tmpFd = openSync(this.tmpFile, "w+");
  }
  write(chunk: string) {
    writeSync(this.tmpFd, chunk);
    fdatasyncSync(this.tmpFd);
  }

  close() {
    closeSync(this.tmpFd);
  }
  check() {
    if (this.md5) {
      return createHash("md5").update(readFileSync(this.tmpFd)).digest("hex") === this.md5;
    } else {
      return true;
    }
  }
}

