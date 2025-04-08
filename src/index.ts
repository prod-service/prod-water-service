import * as fs from 'fs';
// import * as fs from 'fs/promises';
import * as path from 'path';
import yargs from "yargs";
import { getSheetData, getWorkbookXlsx } from './xls-sheet/import';
import { addBordersMultiTable, addCellsStyles, addRotateStyles, insertDataIntoRange } from './xls-sheet/xlsHelpers';
import { exportListToExcel } from './xls-sheet/export';
import { bodyTableRange, dateRange, dateRegex, dateSeparator, dateSignRange, defaultOutputFileName, fullPageRange, fullTemplateFileName, halfTemplateFileName, headerTableRange, inputFileDir, locationSign, nameSign, subjectNameRange, templateFolder, totalItemsRange } from './consts';
import { toInterface } from './helpers';
import FileReaderService from './services/file-reader';
import { OutputDateParser } from './services/output-date-parser';
import { XlsxImport } from './services/xlsx-import';
import { LocationListService } from './services/LocationListService';
import LocationFactory from './factories/LocationFactory';
import LocationService from './services/LocationService';
import { LocationMerger } from './strategies/LocationMerge';
import MergeByPersonNameStrategy from './strategies/MergeByPersonNameStrategy';
import { ILocationItem } from './entities/Location';

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

try {
    const fileService = new FileReaderService({ fileService: fs});
    const dateParser = new OutputDateParser(dateRegex, dateSeparator);
    const locationMerger = new LocationMerger(new MergeByPersonNameStrategy())
    const invoiceModel = new LocationListService({
        locationSign: locationSign,
        nameSign: nameSign,
        locationFactory: new LocationFactory(),
        locationService: new LocationService()
    });

    const fileList = fileService.getDirFileList(inputDirPath);
    const dateList = fileList.map(fileName => dateParser.parseString(fileName));

    const locationsList: ILocationItem[][] = fileList.map((fileName) => {
        const fileDate: string = dateParser.parseString(fileName);
        const data = fileService.getSingleFile(path.join(inputDirPath, fileName));
        const sheetData = XlsxImport.getJsonFromBuffer(data);
        
        return invoiceModel.create(toInterface(sheetData), fileDate);
    });

    const mainFileBase: ILocationItem[] = locationMerger.merge(locationsList);
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
