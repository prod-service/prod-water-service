import * as fs from 'fs';
// import * as fs from 'fs/promises';
import * as path from 'path';
import yargs from "yargs";
import { getSheetData, getSheetDataJson, getWorkbookXlsx } from './xls-sheet/import';
import { addBordersMultiTable, addCellsStyles, addRotateStyles, insertDataIntoRange, parseDateForOutpu } from './xls-sheet/xlsHelpers';
import { exportListToExcel } from './xls-sheet/export';
import { bodyTableRange, dateRange, dateSignRange, defaultOutputFileName, fullPageRange, headerTableRange, inputFileDir, locationSign, nameSign, subjectNameRange, templateFileName, templateFolder, totalItemsRange } from './consts';
import { IPerson, IInuptData, IFileBase } from './interface';
import { getDateFromFileName, toInterface } from './helpers';

const argv = yargs(process.argv.slice(2))
  .option("file", {
    alias: "f",
    type: "string",
    description: "output file suffix",
    demandOption: false,
  })
  .option("documentNumber", {
    alias: "n",
    type: "string",
    description: "document number start",
    demandOption: false,
  })
  .parse();

const outputFileName = argv['file'] || defaultOutputFileName;
const outputDocNumberStart = argv['documentNumber'];

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
    const dateList = fileList.map(fileName => parseDateForOutpu(getDateFromFileName(fileName)));

    const parsedFileList = fileList.map((fileName) => {
        const fileDate: string = parseDateForOutpu(getDateFromFileName(fileName));
        
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

    const dateCells = insertDataIntoRange(updSheet, dateRange, dateList);
    
    exportListToExcel({
        book,
        data: mainFileBase,
        dateList: dateCells,
        fileSuffix: outputFileName,
        documentNumberStart: outputDocNumberStart
    });

} catch (error) {
    console.log(error);
}
