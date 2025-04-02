import { read, utils, WorkBook, WorkSheet } from 'xlsx-js-style';

interface IXlsxImport {
    getWorkbookXlsx: (data: Buffer<ArrayBufferLike>) => WorkBook,
    getSheetData: (workbook: WorkBook, sheetIndex: number) => WorkSheet
    getSheetDataJson: (sheet: WorkSheet) =>unknown[]
}

class XlsxImport implements IXlsxImport {
    static getWorkbookXlsx = (data: Buffer<ArrayBufferLike>): WorkBook => {
        return read(data, { type: "buffer", cellStyles: true });
    };
    
    static getSheetData = (workbook: WorkBook, sheetIndex: number = 0): WorkSheet => {
        const sheetName = workbook.SheetNames[sheetIndex];
        return workbook.Sheets[sheetName];
    };
    
    static getSheetDataJson = (sheet: WorkSheet): unknown[] => {
        return utils.sheet_to_json(sheet);
    };
}