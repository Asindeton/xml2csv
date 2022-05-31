const { Readable } = require("stream");
const fs = require("fs");

class CustomReadable extends Readable {
  filename: string;
  fd: number | null;
  constructor(filename: string) {
    super();
    this.filename = filename;
    this.fd = null;
    this.numOfChunk = 0;
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
  private _read(n: number) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err: Error, bytesRead: number) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  private _destroy(err: Error, callback: Function) {
    if (this.fd) {
      fs.close(this.fd, (er: Error) => callback(er || err));
    } else {
      callback(err);
    }
  }
}

export { CustomReadable };
