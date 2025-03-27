import { read, utils, WorkBook, WorkSheet } from "xlsx-js-style";

export const getWorkbookXlsx = (data: Buffer<ArrayBufferLike>): WorkBook => {
    return read(data, { type: "buffer", cellStyles: true });
};

export const getSheetData = (workbook: WorkBook, sheetIndex: number = 0): WorkSheet => {
    const sheetName = workbook.SheetNames[sheetIndex];
    return workbook.Sheets[sheetName];
};

export const getSheetDataJson = (sheet: WorkSheet): unknown[] => {
    return utils.sheet_to_json(sheet);
};