import { read, utils, WorkBook, WorkSheet } from 'xlsx-js-style'; // outside module

export abstract class IXlsxImport {
    getWorkbookXlsx: (data: Buffer<ArrayBufferLike>) => WorkBook;
    getSheetData: (workbook: WorkBook, sheetIndex: number) => WorkSheet;
    getSheetDataJson: (sheet: WorkSheet) =>unknown[];
};

export class XlsxImport extends IXlsxImport {
    static getWorkbook = (data: Buffer<ArrayBufferLike>): WorkBook => {
        return read(data, { type: "buffer", cellStyles: true });
    };
    
    static getSheetData = (workbook: WorkBook, sheetIndex: number = 0): WorkSheet => {
        const sheetName = workbook.SheetNames[sheetIndex];
        return workbook.Sheets[sheetName];
    };
    
    static getSheetDataJson = (sheet: WorkSheet): unknown[] => {
        return utils.sheet_to_json(sheet);
    };

    static getJsonFromBuffer = (data: Buffer<ArrayBufferLike>): unknown[] => {
        return this.getSheetDataJson(this.getSheetData(this.getWorkbook(data)));
    }
};