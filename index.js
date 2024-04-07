import { readFileSync, writeFileSync, existsSync } from 'fs';
import { marked } from 'marked';
import { renderer, replaceImageUrlsWithRemote, findUnmappedImages } from './helper.js';
import * as path from 'path';

const DEFAULT_INPUT_FILENAME = 'input.md';
const DEFAULT_OUTPUT_FILENAME = 'blog.html';

let inputFilename;
let outputFilename;
if (process.argv.length < 3 || process.argv[2]?.length <= 0) {
    // no additional parameters provided
    inputFilename = DEFAULT_INPUT_FILENAME;
} else {
    // input file name provided
    inputFilename = process.argv[2]
}
if (process.argv.length < 4 || process.argv[3]?.length <= 0) {
    // no output file name provided
    const parentDir = path.dirname(inputFilename);
    outputFilename = parentDir + '/' + DEFAULT_OUTPUT_FILENAME;
} else {
    // output file name provided
    outputFilename = process.argv[3]
}
if (!existsSync(inputFilename)) {
    inputFilename += (inputFilename === DEFAULT_INPUT_FILENAME) ? ' (default)' : '';
    console.error(`Provided file ${inputFilename} not found.`);
    process.exit(1);
}

let mappingJson;
const assumedMappingJsonFileName = inputFilename.replace('\.md', '\.json');
if (!existsSync(assumedMappingJsonFileName)) {
    console.info(`Assumed mapping file ${assumedMappingJsonFileName} was not found. Not mapping image URLs`)
    mappingJson = [];
} else {
    mappingJson = JSON.parse(readFileSync(assumedMappingJsonFileName, 'utf8'));
}

// add image & code tag renderer override
marked.use({ renderer });

try {
    console.info(`Rendering HTML from file ${inputFilename}`)
    const markdown = readFileSync(inputFilename, 'utf8');
    let html = marked.parse(markdown);

    if (mappingJson.length > 0) {
        console.info('Trying to replace local image URLs with remote URLs');
        html = replaceImageUrlsWithRemote(html, mappingJson);
    }
    const unmappedImages = findUnmappedImages(html);
    if (unmappedImages.length > 0) {
        console.warn('The following images are not mapped to a remote SAP Blogs image URL yet:');
        console.dir(unmappedImages);
    }

    writeFileSync(outputFilename, html, {
        encoding: 'utf8',
        flag: 'w'
    });
} catch (error) {
    console.error(error)
}