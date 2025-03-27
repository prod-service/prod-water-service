"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSheetDataJson = exports.getSheetData = exports.getWorkbookXlsx = void 0;
const xlsx_js_style_1 = require("xlsx-js-style");
const getWorkbookXlsx = (data) => {
    return (0, xlsx_js_style_1.read)(data, { type: "buffer", cellStyles: true });
};
exports.getWorkbookXlsx = getWorkbookXlsx;
const getSheetData = (workbook, sheetIndex = 0) => {
    const sheetName = workbook.SheetNames[sheetIndex];
    return workbook.Sheets[sheetName];
};
exports.getSheetData = getSheetData;
const getSheetDataJson = (sheet) => {
    return xlsx_js_style_1.utils.sheet_to_json(sheet);
};
exports.getSheetDataJson = getSheetDataJson;
//# sourceMappingURL=import.js.map