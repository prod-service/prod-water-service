"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportListToExcel = exports.saveExcelFile = void 0;
const xlsx_js_style_1 = require("xlsx-js-style");
const path_1 = __importDefault(require("path"));
const consts_1 = require("../consts");
const import_1 = require("./import");
const xlsHelpers_1 = require("./xlsHelpers");
const saveExcelFile = (workbook, newFilePath) => {
    (0, xlsx_js_style_1.writeFile)(workbook, newFilePath, { bookType: 'xlsx', type: 'array', cellStyles: true });
};
exports.saveExcelFile = saveExcelFile;
const exportListToExcel = (book, data, dateList, fileSuffix = '_1') => {
    const sheet = (0, import_1.getSheetData)(book);
    Object.keys(data).forEach((locationName) => {
        const rawList = data[locationName];
        const nameList = rawList.map((i) => i.name);
        const excelFileCount = Math.ceil(nameList.length / consts_1.maxNameListLength); // Round to bigger
        for (let fileIndex = 0; fileIndex < excelFileCount; fileIndex++) {
            const slieStart = fileIndex * consts_1.maxNameListLength;
            const slieEnd = (fileIndex + 1) * consts_1.maxNameListLength;
            const nameCells = (0, xlsHelpers_1.insertDataIntoRange)(sheet, consts_1.namesRange, nameList.slice(slieStart, slieEnd));
            const newFileSuffix = fileIndex > 0 ? `${fileSuffix}(${fileIndex})` : fileSuffix;
            const updSheet = (0, xlsHelpers_1.setDailyWaterIntale)(sheet, nameCells, dateList, rawList);
            const { totalColArr, total } = (0, xlsHelpers_1.calcTotalWaterPerDay)(updSheet, consts_1.waterValuesRange);
            (0, xlsHelpers_1.insertDataIntoRange)(updSheet, consts_1.totalDayWaterRange, totalColArr.map(i => `${i}`));
            (0, xlsHelpers_1.insertDataIntoRange)(updSheet, consts_1.mainTotalWaterValueCell, [`${total}`]);
            book.Sheets[book.SheetNames[0]] = updSheet;
            (0, exports.saveExcelFile)(book, path_1.default.join(__dirname, consts_1.outputFolder, `${locationName}_${newFileSuffix}.xlsx`));
        }
        ;
    });
};
exports.exportListToExcel = exportListToExcel;
//# sourceMappingURL=export.js.map