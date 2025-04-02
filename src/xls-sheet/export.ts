import { utils, WorkBook, writeFile } from "xlsx-js-style";
import path from "path";
import { mainTotalWaterValueCell, mainTotalWaterValueCellHalfTempl, maxNameListLength, namesRange, outputFolder, outputTotalFileName, totalDayWaterRange, totalDayWaterRangeHalfTempl, waterValuesRange, waterValuesRangeHalfTempl } from "../consts";
import { getSheetData } from "./import";
import { calcTotalWaterPerDay, fillEmptyCellsInRange, insertDataIntoRange, setDailyWaterIntale, setDocumentNumber } from "./xlsHelpers";
import { IExportToExcelArgs, ITotalFile } from "../interface";
import { parseToNum, reaplaceStringSymbol } from "../helpers";

export const createWorkbookByJson = (data: any, sheetName: string = 'sheet_1'): WorkBook => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, sheetName);
    return workbook;
};

export const saveExcelFile = (workbook: WorkBook, newFilePath: string) => {
    writeFile(workbook, newFilePath, { bookType: 'xlsx', type: 'array', cellStyles: true });
};

export const exportListToExcel = ({ book, data, dateList, fileSuffix, documentNumberStart, isHalfTemplate }: IExportToExcelArgs): void => {
    const totalWaterRange = isHalfTemplate ? totalDayWaterRangeHalfTempl : totalDayWaterRange;
    const mainTotalCell = isHalfTemplate ? mainTotalWaterValueCellHalfTempl : mainTotalWaterValueCell;
    const waterRange = isHalfTemplate ? waterValuesRangeHalfTempl : waterValuesRange;

    const sheet = getSheetData(book);
    let documentCounter = parseToNum(documentNumberStart);
    let totalCalcData: ITotalFile[] = [];
    
    Object.keys(data).forEach((locationName) => {
        const rawList = data[locationName];
        const nameList = rawList.map((i) => i.name);
        const excelFileCount = Math.ceil(nameList.length / maxNameListLength); // Round to bigger
        
        for (let fileIndex = 0; fileIndex < excelFileCount; fileIndex++) {
            const slieStart = fileIndex * maxNameListLength;
            const slieEnd = (fileIndex+1) * maxNameListLength;
            const nameCells = insertDataIntoRange(sheet, namesRange, nameList.slice(slieStart, slieEnd));
            const newFileSuffix = `${fileSuffix}_(${fileIndex + 1})`;
            const outputFileName = `${reaplaceStringSymbol(locationName, '/', '-')}_${newFileSuffix}.xlsx`
            
            const updSheet = setDailyWaterIntale(sheet, nameCells, dateList, rawList);
            
            const { totalColArr, total } = calcTotalWaterPerDay(updSheet, waterRange);
            insertDataIntoRange(updSheet, totalWaterRange, totalColArr.map(i => `${i}`));
            insertDataIntoRange(updSheet, mainTotalCell, [`${total}`]);

            if (documentNumberStart) setDocumentNumber(updSheet, documentCounter);

            fillEmptyCellsInRange(updSheet, waterRange);

            book.Sheets[book.SheetNames[0]] = updSheet;

            saveExcelFile(book, path.join(__dirname, outputFolder, outputFileName));
            totalCalcData.push({ location: outputFileName, total });
            documentCounter++; // increase doc number and set for the next one
        };
    });

    saveTotalFile(totalCalcData, path.join(__dirname, outputFolder, `${outputTotalFileName}_${fileSuffix}.xlsx`))
};

export const saveTotalFile = (data: ITotalFile[], filePath: string) => {
    const totalRow: ITotalFile = data.reduce((prev, curr) => {
        const total = parseToNum(prev.total) + parseToNum(curr.total);
        return { ...prev, total  };
    }, { location: 'Всього', total: 0 });

    data.push(totalRow);
    const totalWorkbook = createWorkbookByJson(data, 'Total');
    saveExcelFile(totalWorkbook, filePath);
};