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