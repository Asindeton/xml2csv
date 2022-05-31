const { Writable } = require("stream");
const fs = require("fs");

type TChunk = Buffer | string;

class CustomWriteable extends Writable {
  filename: string;
  fd: number | null;
  constructor(filename: string) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  private _construct(callback: Function) {
    fs.open(this.filename, (err: Error, fd: number) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  private _write(chunk: TChunk, encoding: string, callback: Function) {
    fs.writeFile(this.filename, chunk, callback);
  }
  private _destroy(err: Error, callback: Function) {
    if (this.fd) {
      fs.close(this.fd, (er: Error) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
export { CustomWriteable };
