import * as fs from 'fs';
// import * as fs from 'fs/promises';
import * as path from 'path';
import yargs from "yargs";
import { getSheetData, getSheetDataJson, getWorkbookXlsx } from './xls-sheet/import';
import { addBordersMultiTable, addCellsStyles, addRotateStyles, insertDataIntoRange } from './xls-sheet/xlsHelpers';
import { exportListToExcel } from './xls-sheet/export';
import { bodyTableRange, dateRange, dateRegex, dateSeparator, dateSignRange, defaultOutputFileName, fullPageRange, fullTemplateFileName, halfTemplateFileName, headerTableRange, inputFileDir, locationSign, nameSign, subjectNameRange, templateFolder, totalItemsRange } from './consts';
import { IPerson, IInuptData, IFileBase } from './interface';
import { toInterface } from './helpers';
import FileReaderService from './file-reader';
import { OutputDateParser } from './output-date-parser';
import { XlsxImport } from './xlsx-import';
import { InvoiceModel } from './invoice-model';

const fileService = new FileReaderService({ fileService: fs});
const dateParser = new OutputDateParser(dateRegex, dateSeparator);
const invoiceModel = new InvoiceModel({ locationSign: locationSign, nameSign: nameSign });

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
  .option("halfTemplate", {
    alias: "h",
    type: "boolean",
    description: "half template if needed",
    demandOption: false,
  })
  .parse();

const outputFileName = argv['file'] || defaultOutputFileName;
const outputDocNumberStart = argv['documentNumber'] || '';
const isHalfTemplate = argv['halfTemplate'] || false;

const templateDirPath = path.join(__dirname, templateFolder);
const inputDirPath = path.join(__dirname, inputFileDir);
const templateFileName = isHalfTemplate ? halfTemplateFileName : fullTemplateFileName;


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

    const fileList = fileService.getDirFileList(inputDirPath);
    const dateList = fileList.map(fileName => dateParser.parseString(fileName));

    const parsedFileList = fileList.map((fileName) => {
        const fileDate: string = dateParser.parseString(fileName);
        
        const data = fileService.getSingleFile(path.join(inputDirPath, fileName));
        
        const sheetData = XlsxImport.getJsonFromBuffer(data);
        
        return parseInputFile(toInterface(sheetData), fileDate);
    });

    // const parsedFileListClass = fileList.map((fileName) => {
    //     const fileDate: string = dateParser.parseString(fileName);
        
    //     const data = fileService.getSingleFile(path.join(inputDirPath, fileName));
        
    //     const sheetData = XlsxImport.getJsonFromBuffer(data);
        
    //     return invoiceModel.create(toInterface(sheetData), fileDate);
    // });

    const mainFileBase: IFileBase = parsedFileList.reduce((prev, curr: IFileBase): IFileBase => {
        return { ...prev, ...concatToSignleFilBse(prev, curr) };
    }, {});

    const templateFile = fileService.getDirFileList(templateDirPath).find(t => t === templateFileName);
    const templateBuffer = fileService.getSingleFile(path.join(templateDirPath, templateFile));

    const book = getWorkbookXlsx(templateBuffer);
    let updSheet = getSheetData(book);
    const dateCells = insertDataIntoRange(updSheet, dateRange, dateList);
    
    updSheet = { ...updSheet, ...addCellsStyles(updSheet, fullPageRange) }
    updSheet = { ...updSheet, ...addBordersMultiTable(updSheet, [headerTableRange, bodyTableRange]) }
    updSheet = { ...updSheet, ...addRotateStyles(updSheet, [subjectNameRange, dateRange, totalItemsRange, dateSignRange]) }

    
    exportListToExcel({
        book,
        data: mainFileBase,
        dateList: dateCells,
        fileSuffix: outputFileName,
        documentNumberStart: outputDocNumberStart,
        isHalfTemplate: isHalfTemplate
    });

} catch (error) {
    console.log(error);
}
