import * as fs from 'fs';
// import * as fs from 'fs/promises';
import * as path from 'path';
import { getSheetData, getSheetDataJson, getWorkbookXlsx } from './xls-sheet/import';
import { addBordersMultiTable, addCellsStyles, addRotateStyles, calcTotalWaterPerDay, insertDataIntoRange, setCellTypeForRange } from './xls-sheet/xlsHelpers';
import { exportListToExcel } from './xls-sheet/export';
import { bodyTableRange, dateRange, dateSeparator, dateSignRange, fullPageRange, headerTableRange, inputFileDir, locationSign, nameSign, subjectNameRange, templateFileName, templateFolder, totalDayWaterRange, totalItemsRange, waterValuesRange } from './consts';
import { IPerson, IInuptData, IFileBase } from './interface';
import { reverseDateFromFileName, getDateFromFileName, toInterface } from './helpers';

const templateDirPath = path.join(__dirname, templateFolder);
const inputDirPath = path.join(__dirname, inputFileDir);


const concatPersonLists = (baseItems: IPerson[], nextItems: IPerson[]): IPerson[] => {
    let resultArr = [...baseItems, ...nextItems];

    return resultArr.reduce((prev, curr) => {
        const prevPerson = prev.find(({ name:prevN }) => prevN === curr.name);
        if (prevPerson){
            prevPerson.date = prevPerson.date.concat(curr.date);
        } else {prev.push(curr);}
        
        return prev;
    }, []);
};

const formatDate = (fileDate: string): string => {
    const parts = fileDate.split(dateSeparator);
    return `${parts[0]}.${parts[1]}.${parts[2].slice(2)}.`;
};

const parseInputFile = (inputObj: IInuptData[], date: string): IFileBase => {
    return inputObj.reduce((prev, currInput) => {
        const currentLocation = currInput[locationSign];
        const currentName = currInput[nameSign];
        const prevNameListByLocation = prev[currentLocation];

        if (prevNameListByLocation) {
            prevNameListByLocation.push({ name: currentName, date: [date] });
            return { ...prev };
        }

        return {
            ...prev,
            [currInput[locationSign]]: [{ name: currentName, date: [date] }]
        };

    }, {});
};

const concatToSignleFilBse = (prevObj: IFileBase, currentObj: IFileBase): IFileBase => {
    return Object.keys(currentObj).reduce((prev, currLoc) => {
        const prevLocation = prevObj[currLoc];
        const currLocation = currentObj[currLoc];

        if (!prevLocation && currLocation) return { ...prev, [currLoc]: currLocation }

        const up = concatPersonLists(prevLocation, currLocation);
        
        const newSing = {
            ...prev,
            [currLoc]: up
        }

        return newSing;        
    }, {})
};

try {

    const fileList = fs.readdirSync(inputDirPath);
    const dateList = fileList.map(fileName => formatDate(reverseDateFromFileName(getDateFromFileName(fileName))))

    const parsedFileList = fileList.map((fileName) => {
        const fileDate: string = formatDate(reverseDateFromFileName(getDateFromFileName(fileName)));
        
        const data = fs.readFileSync(path.join(inputDirPath, fileName));
        
        const sheetData = getSheetDataJson(getSheetData(getWorkbookXlsx(data)));
        
        return parseInputFile(toInterface(sheetData), fileDate);
    });


    const mainFileBase: IFileBase = parsedFileList.reduce((prev, curr: IFileBase): IFileBase => {
        return { ...prev, ...concatToSignleFilBse(prev, curr) };
    }, {});

    const templateFile = fs.readdirSync(templateDirPath).find(t => t === templateFileName);
    const templateBuffer = fs.readFileSync(path.join(templateDirPath, templateFile));

    const book = getWorkbookXlsx(templateBuffer);
    const updSheet = getSheetData(book);
    
    addCellsStyles(updSheet, fullPageRange);
    addBordersMultiTable(updSheet, [headerTableRange, bodyTableRange]);
    addRotateStyles(updSheet, [subjectNameRange, dateRange, totalItemsRange, dateSignRange]);

    // setCellTypeForRange(updSheet, waterValuesRange, 'n')

    const dataCells = insertDataIntoRange(updSheet, dateRange, dateList);
    
    exportListToExcel(book, mainFileBase, dataCells, 'квітень'); // TODO: set from cli

} catch (error) {
    console.log(error);
}
