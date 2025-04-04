import { WorkBook } from "xlsx-js-style"
import { numb, IPN, nameSign, locationSign } from "../consts"

export interface IInuptData {
    [numb]: number,
    [IPN]: string,
    [nameSign]: string,
    [locationSign]: string,
};

export interface IPerson {
    name: string,
    date: string[],
};

export interface IDataCell {
    value: string,
    colIndex: number,
    rowIndex: number
};

export interface IFileBase {
    [key: string]: IPerson[]
};

export interface ICalcTotalWatePerDay {
    totalColArr: number[],
    total: number
};

export interface IExportToExcelArgs {
    book: WorkBook,
    data: IFileBase,
    dateList: IDataCell[],
    fileSuffix: string,
    documentNumberStart?: string | number,
    isHalfTemplate?: boolean
};

export interface ITotalFile {
    location: string,
    total: number | string
};

export interface IStringParser {
    parseString: (inputStr: string) => string
};