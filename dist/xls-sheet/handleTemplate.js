"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveExcelFile = exports.setDataToTemplate = void 0;
const xlsx_js_style_1 = require("xlsx-js-style");
const setDataToTemplate = (baseSheet, range, data) => {
    const rangeRef = xlsx_js_style_1.utils.decode_range(range);
    // console.log(baseSheet['B6']);
    // if (!baseSheet['A5']) baseSheet['A5'] = { v: 12 };
    return baseSheet;
};
exports.setDataToTemplate = setDataToTemplate;
const saveExcelFile = (workbook, newFilePath) => {
    (0, xlsx_js_style_1.writeFile)(workbook, newFilePath, { bookType: 'xlsx', type: 'array', cellStyles: true });
};
exports.saveExcelFile = saveExcelFile;
//# sourceMappingURL=handleTemplate.js.map