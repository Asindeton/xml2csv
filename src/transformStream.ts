const { Transform } = require("stream");

type TChunk = Buffer | string;
type JSONItem = { [x: string]: string };

class CustomTransform extends Transform {
  private headBuffer: string = "";
  private tailBuffer: string = "";
  private headers: string[] = [];
  private state: string[] = [];

  private _transform(chunk: TChunk, encoding: string, callback: Function) {
    try {
      let buf = this.headBuffer + chunk.toString().trim() + this.tailBuffer;
      this.headBuffer = "";
      this.tailBuffer = "";
      this.preTransformJSON(buf);

      const data: Array<JSONItem> = JSON.parse(
        "[" + this.state.toString() + "]",
      );

      if (this.headers.length == 0) {
        this.headers = Object.keys(data[0]);
      }
      let resultString = this.headers.join(",") + "\n";
      data.forEach((element) => {
        resultString +=
          this.headers.map((headerVal) =>
            element[headerVal] == undefined ? "" : element[headerVal],
          ) + "\n";
      });
      callback(null, resultString);
    } catch (err) {
      callback(err);
    }
  }
  private preTransformJSON(
    jsonString: string,
    firstSelector: string = "{",
    lastSelector: string = "}",
    firstSelectorStartPos: number = 0,
    lastSelectorStartPos: number = 0,
  ) {
    const posStart = jsonString.indexOf(firstSelector, firstSelectorStartPos);
    const posEnd = jsonString.indexOf(lastSelector, lastSelectorStartPos);
    if (posStart !== -1 && posEnd !== -1) {
      this.state.push(jsonString.slice(posStart, posEnd + 1));
      this.preTransformJSON(
        jsonString,
        firstSelector,
        lastSelector,
        posStart + 1,
        posEnd + 1,
      );
    } else if (posStart == -1 && posEnd !== -1) {
      this.tailBuffer = jsonString.slice(0, posEnd + 1);
      return;
    } else if (posStart !== -1 && posEnd == -1) {
      this.headBuffer = jsonString.slice(posStart);
      return;
    } else {
      return;
    }
  }
}

export { CustomTransform };
