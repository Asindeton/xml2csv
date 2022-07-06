import path from 'path';
import { stringify } from 'csv-stringify';
import xml2js from 'xml2js';
import fs from 'fs';
import flatten from './utils/flatten';
import currencyConvertor from './utils/currencyConvertor';
const parser = new xml2js.Parser({
    attrkey: 'ATTR',
    explicitChildren: true,
    explicitArray: false,
    mergeAttrs: true,
    valueProcessors: [currencyConvertor],
});

const rootDirectory: string = path.parse(__dirname).dir;
const inputDirectory: string = path.join(rootDirectory, 'input');
const outputDirectory: string = path.join(rootDirectory, 'output');

fs.readdir(inputDirectory, (err, files) => {
    if (err) {
        throw new Error('Wrong directory name');
    }
    const xmlFile = fs.readFileSync(path.join(inputDirectory, files[0]), 'utf-8');
    parser.parseString(xmlFile, (error: Error | null, result: any) => {
        if (error === null) {
            stringify(
                result.Document.DocDetail.map((el: any) => flatten(el)),
                // result.Document.DocDetail,
                {
                    header: true,
                },
                (err, output) => {
                    fs.writeFile(
                        path.join(outputDirectory, files[0].split('.')[0].concat('.csv')),
                        output,
                        { flag: 'w' },
                        (error: Error | null | undefined) => {
                            if (error) {
                                console.error(error);
                            }
                            // file written successfully
                            console.log('file written successfully');
                        }
                    );
                }
            );
        } else {
            console.log(error);
        }
    });
});
