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
const fs = __importStar(require("fs"));
// import * as fs from 'fs/promises';
const path = __importStar(require("path"));
const import_1 = require("./xls-sheet/import");
const xlsHelpers_1 = require("./xls-sheet/xlsHelpers");
const export_1 = require("./xls-sheet/export");
const consts_1 = require("./consts");
const helpers_1 = require("./helpers");
const templateDirPath = path.join(__dirname, consts_1.templateFolder);
const inputDirPath = path.join(__dirname, consts_1.inputFileDir);
const concatPersonLists = (baseItems, nextItems) => {
    let resultArr = [...baseItems, ...nextItems];
    return resultArr.reduce((prev, curr) => {
        const prevPerson = prev.find(({ name: prevN }) => prevN === curr.name);
        if (prevPerson) {
            prevPerson.date = prevPerson.date.concat(curr.date);
        }
        else {
            prev.push(curr);
        }
        return prev;
    }, []);
};
const formatDate = (fileDate) => {
    const parts = fileDate.split(consts_1.dateSeparator);
    return `${parts[0]}.${parts[1]}.${parts[2].slice(2)}.`;
};
const parseInputFile = (inputObj, date) => {
    return inputObj.reduce((prev, currInput) => {
        const currentLocation = currInput[consts_1.locationSign];
        const currentName = currInput[consts_1.nameSign];
        const prevNameListByLocation = prev[currentLocation];
        if (prevNameListByLocation) {
            prevNameListByLocation.push({ name: currentName, date: [date] });
            return { ...prev };
        }
        return {
            ...prev,
            [currInput[consts_1.locationSign]]: [{ name: currentName, date: [date] }]
        };
    }, {});
};
const concatToSignleFilBse = (prevObj, currentObj) => {
    return Object.keys(currentObj).reduce((prev, currLoc) => {
        const prevLocation = prevObj[currLoc];
        const currLocation = currentObj[currLoc];
        if (!prevLocation && currLocation)
            return { ...prev, [currLoc]: currLocation };
        const up = concatPersonLists(prevLocation, currLocation);
        const newSing = {
            ...prev,
            [currLoc]: up
        };
        return newSing;
    }, {});
};
try {
    const fileList = fs.readdirSync(inputDirPath);
    const dateList = fileList.map(fileName => formatDate((0, helpers_1.reverseDateFromFileName)((0, helpers_1.getDateFromFileName)(fileName))));
    const parsedFileList = fileList.map((fileName) => {
        const fileDate = formatDate((0, helpers_1.reverseDateFromFileName)((0, helpers_1.getDateFromFileName)(fileName)));
        const data = fs.readFileSync(path.join(inputDirPath, fileName));
        const sheetData = (0, import_1.getSheetDataJson)((0, import_1.getSheetData)((0, import_1.getWorkbookXlsx)(data)));
        return parseInputFile((0, helpers_1.toInterface)(sheetData), fileDate);
    });
    const mainFileBase = parsedFileList.reduce((prev, curr) => {
        return { ...prev, ...concatToSignleFilBse(prev, curr) };
    }, {});
    const templateFile = fs.readdirSync(templateDirPath).find(t => t === consts_1.templateFileName);
    const templateBuffer = fs.readFileSync(path.join(templateDirPath, templateFile));
    const book = (0, import_1.getWorkbookXlsx)(templateBuffer);
    const updSheet = (0, import_1.getSheetData)(book);
    (0, xlsHelpers_1.addCellsStyles)(updSheet, consts_1.fullPageRange);
    (0, xlsHelpers_1.addBordersMultiTable)(updSheet, [consts_1.headerTableRange, consts_1.bodyTableRange]);
    (0, xlsHelpers_1.addRotateStyles)(updSheet, [consts_1.subjectNameRange, consts_1.dateRange, consts_1.totalItemsRange, consts_1.dateSignRange]);
    // setCellTypeForRange(updSheet, waterValuesRange, 'n')
    const dataCells = (0, xlsHelpers_1.insertDataIntoRange)(updSheet, consts_1.dateRange, dateList);
    (0, export_1.exportListToExcel)(book, mainFileBase, dataCells, 'квітень'); // TODO: set from cli
}
catch (error) {
    console.log(error);
}
//# sourceMappingURL=index.js.map