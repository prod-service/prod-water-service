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
exports.addBorderdsTable = exports.addDefultStyles = exports.insertStaticFormattedCells = exports.insertListIntoColumn = void 0;
const XLSX = __importStar(require("xlsx-js-style"));
const consts_1 = require("../consts");
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
const addDefultStyles = (worksheet, range) => {
    const rangeRef = XLSX.utils.decode_range(range);
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress])
                worksheet[cellAddress] = { v: '' }; // Якщо комірка порожня, створюємо її
            worksheet[cellAddress].s = Object.assign(Object.assign({}, worksheet[cellAddress].s), { font: consts_1.defaultFont, alignment: consts_1.centerAlignVH });
        }
    }
};
exports.addDefultStyles = addDefultStyles;
const addBorderdsTable = (worksheet, range) => {
    const rangeRef = XLSX.utils.decode_range(range);
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress])
                worksheet[cellAddress] = { v: '' }; // Якщо комірка порожня, створюємо її
            worksheet[cellAddress].s = Object.assign(Object.assign({}, worksheet[cellAddress].s), { border: {
                    top: consts_1.defaultBorderStyle,
                    bottom: consts_1.defaultBorderStyle,
                    left: consts_1.defaultBorderStyle,
                    right: consts_1.defaultBorderStyle,
                } });
        }
    }
};
exports.addBorderdsTable = addBorderdsTable;
//# sourceMappingURL=xls-helpers.js.map