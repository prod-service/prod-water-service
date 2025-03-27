"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcTotalWaterPerDay = exports.setCellTypeForRange = exports.setDailyWaterIntale = exports.insertDataIntoRange = exports.addRotateStyles = exports.addBordersMultiTable = exports.addBorderdsTable = exports.addCellsStyles = exports.insertStaticFormattedCells = exports.insertListIntoColumn = exports.getCellsArrFromRange = void 0;
const XLSX = __importStar(require("xlsx-js-style"));
const consts_1 = require("../consts");
const helpers_1 = require("../helpers");
const getCellsArrFromRange = (worksheet, range) => {
    const rangeRef = XLSX.utils.decode_range(range);
    let result = [];
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress])
                worksheet[cellAddress] = { v: '' };
            result.push({ value: worksheet[cellAddress].v, colIndex: col, rowIndex: row });
        }
    }
    ;
    return result;
};
exports.getCellsArrFromRange = getCellsArrFromRange;
const insertListIntoColumn = (worksheet, list, colName, colStart) => {
    list.forEach((item, idx) => {
        const cell = `${colName}${colStart + idx}`;
        worksheet[cell] = {
            v: item,
            s: { font: consts_1.defaultFont, alignment: consts_1.leftCenterAlignHV }
        };
    });
};
exports.insertListIntoColumn = insertListIntoColumn;
const insertStaticFormattedCells = (worksheet, formattedCells) => {
    formattedCells.forEach(({ cell, value, style }) => {
        if (!worksheet[cell])
            worksheet[cell] = {};
        XLSX.utils.sheet_add_aoa(worksheet, [[value]], { origin: cell, cellStyles: true });
        worksheet[cell].s = style;
    });
};
exports.insertStaticFormattedCells = insertStaticFormattedCells;
const addCellsStyles = (worksheet, range, styles = consts_1.defultStyles) => {
    const rangeRef = XLSX.utils.decode_range(range);
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress])
                worksheet[cellAddress] = { v: '' }; // Якщо комірка порожня, створюємо її
            worksheet[cellAddress].s = {
                ...worksheet[cellAddress].s,
                ...styles
            };
        }
    }
};
exports.addCellsStyles = addCellsStyles;
const addBorderdsTable = (worksheet, range) => {
    const rangeRef = XLSX.utils.decode_range(range);
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress])
                worksheet[cellAddress] = { v: '' }; // Якщо комірка порожня, створюємо її
            worksheet[cellAddress].v = worksheet[cellAddress].v || '';
            worksheet[cellAddress].t = 's';
            worksheet[cellAddress].s = {
                ...worksheet[cellAddress].s,
                border: {
                    top: consts_1.defaultBorderStyle,
                    bottom: consts_1.defaultBorderStyle,
                    left: consts_1.defaultBorderStyle,
                    right: consts_1.defaultBorderStyle,
                },
            };
        }
    }
};
exports.addBorderdsTable = addBorderdsTable;
const addBordersMultiTable = (worksheet, range) => {
    range.forEach((rangeItem) => { (0, exports.addBorderdsTable)(worksheet, rangeItem); });
};
exports.addBordersMultiTable = addBordersMultiTable;
const addRotateStyles = (worksheet, range) => {
    range.forEach((rangeItem) => {
        (0, exports.addCellsStyles)(worksheet, rangeItem, { alignment: { textRotation: consts_1.textRotation, ...consts_1.centerAlignVH } });
    });
};
exports.addRotateStyles = addRotateStyles;
const insertDataIntoRange = (worksheet, range, data) => {
    const rangeRef = XLSX.utils.decode_range(range);
    let result = [];
    let dataIndex = 0;
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const value = data[dataIndex] || '';
            if (!worksheet[cellAddress])
                worksheet[cellAddress] = { v: value }; // Якщо комірка порожня, створюємо її
            else {
                worksheet[cellAddress] = { ...worksheet[cellAddress], v: value };
            }
            if (value)
                result.push({ value, colIndex: col, rowIndex: row });
            dataIndex++;
        }
    }
    ;
    return result;
};
exports.insertDataIntoRange = insertDataIntoRange;
// TODO: immutable
const setDailyWaterIntale = (booksheet, nameCells, dateList, personList) => {
    let localSheet = { ...booksheet };
    nameCells.forEach((nameCell) => {
        const currPersone = personList.find(({ name }) => name === nameCell.value);
        const cossCoordinates = currPersone.date.map((currDate) => {
            const crossDate = dateList.find((d) => d.value === currDate);
            return { c: crossDate.colIndex, r: nameCell.rowIndex };
        });
        cossCoordinates.forEach((coordinateItem) => {
            const cellAddress = XLSX.utils.encode_cell(coordinateItem);
            localSheet[cellAddress] = { ...localSheet[cellAddress], v: consts_1.waterConst };
        });
    });
    return localSheet;
};
exports.setDailyWaterIntale = setDailyWaterIntale;
const setCellTypeForRange = (worksheet, range, cellType) => {
    const rangeRef = XLSX.utils.decode_range(range);
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress])
                worksheet[cellAddress] = { v: '' }; // Якщо комірка порожня, створюємо її
            worksheet[cellAddress].t = cellType;
        }
    }
};
exports.setCellTypeForRange = setCellTypeForRange;
;
const calcTotalWaterPerDay = (worksheet, valuesRange) => {
    const waterValues = XLSX.utils.decode_range(valuesRange);
    const values = [];
    for (let col = waterValues.s.c; col <= waterValues.e.c; col++) {
        const colSum = [];
        for (let row = waterValues.s.r; row <= waterValues.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (worksheet[cellAddress]) {
                colSum.push(worksheet[cellAddress].v);
            }
        }
        ;
        values.push(colSum.reduce((prev, curr) => {
            return prev + (0, helpers_1.parseToNum)(curr);
        }, 0));
    }
    ;
    return {
        totalColArr: values,
        total: values.reduce((prev, curr) => (prev + curr), 0)
    };
};
exports.calcTotalWaterPerDay = calcTotalWaterPerDay;
//# sourceMappingURL=xlsHelpers.js.map