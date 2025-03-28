import { WorkBook, writeFile } from "xlsx-js-style";
import path from "path";
import { mainTotalWaterValueCell, maxNameListLength, namesRange, outputFolder, totalDayWaterRange, waterValuesRange } from "../consts";
import { getSheetData } from "./import";
import { calcTotalWaterPerDay, insertDataIntoRange, setDailyWaterIntale } from "./xlsHelpers";
import { IDataCell, IFileBase } from "../interface";
import { reaplaceStringSymbol } from "../helpers";

export const saveExcelFile = (workbook: WorkBook, newFilePath: string) => {
    writeFile(workbook, newFilePath, { bookType: 'xlsx', type: 'array', cellStyles: true });
};

export const exportListToExcel = (book: WorkBook, data: IFileBase, dateList: IDataCell[], fileSuffix: string='_1'): void => {
    const sheet = getSheetData(book);
    
    Object.keys(data).forEach((locationName) => {
        const rawList = data[locationName];
        const nameList = rawList.map((i) => i.name);
        const excelFileCount = Math.ceil(nameList.length / maxNameListLength); // Round to bigger
        
        for (let fileIndex = 0; fileIndex < excelFileCount; fileIndex++) {
            const slieStart = fileIndex * maxNameListLength;
            const slieEnd = (fileIndex+1) * maxNameListLength;
            const nameCells = insertDataIntoRange(sheet, namesRange, nameList.slice(slieStart, slieEnd));
            const newFileSuffix = fileIndex > 0 ? `${fileSuffix}(${fileIndex})` : fileSuffix;
            const outputFileName = `${reaplaceStringSymbol(locationName, '/', '-')}_${newFileSuffix}.xlsx`
            
            const updSheet = setDailyWaterIntale(sheet, nameCells, dateList, rawList);
            
            const { totalColArr, total } = calcTotalWaterPerDay(updSheet, waterValuesRange);
            insertDataIntoRange(updSheet, totalDayWaterRange, totalColArr.map(i => `${i}`));
            insertDataIntoRange(updSheet, mainTotalWaterValueCell, [`${total}`]);

            book.Sheets[book.SheetNames[0]] = updSheet;

            saveExcelFile(book, path.join(__dirname, outputFolder, outputFileName));
        };
    });
};