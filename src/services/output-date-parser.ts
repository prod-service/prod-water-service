import { DateParser } from "./date-parser";
import { IStringParser } from "../interface";

export class OutputDateParser extends DateParser implements IStringParser {
    dateRegex: RegExp
    dateSeparator: string

    constructor(dateRegex: RegExp, dateSeparator: string) {
        super(dateRegex, dateSeparator);
    }

    parseString(inputString: string): string {
        const dateStr = this.getDateFromFileName(inputString);
        const reversed = this.reverseDateFromFileName(dateStr);
        const formated = this.formatDate(reversed);
        return this.addOneDayToDateStr(formated);
    }
}