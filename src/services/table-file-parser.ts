import { IStringParser } from "../interface";

interface ITableFileParser {
    dateParser: IStringParser
};

export default class TableFileParser {
    constructor(parameters) {
        
    }

    getDateListByFileNames (fileNames: string[]): string[] {
        return fileNames;
    }
}