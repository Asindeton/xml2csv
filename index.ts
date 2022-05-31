import EventEmitter from "events";
import path from "path";

import { CustomReadable } from "./src/readStream";
import { CustomWriteable } from "./src/writeStream";
import { CustomTransform } from "./src/transformStream";

const myEmitter: EventEmitter = new EventEmitter();
const rootDirectory: string = path.parse(__dirname).dir;
const [readFile, writeFile] = [
  path.join(rootDirectory, process.argv[2]),
  path.join(rootDirectory, process.argv[3]),
];

myEmitter.on("call", (read: string, write: string) => {
  const readable = new CustomReadable(read);
  const writable = new CustomWriteable(write);
  const transform = new CustomTransform();
  readable.pipe(transform).pipe(writable);
});

myEmitter.emit("call", readFile, writeFile);
