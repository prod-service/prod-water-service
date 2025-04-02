import { dateRegex, dateSeparator } from "../consts";
import { IInuptData } from "../interface";

// export const getDateFromFileName = (fileName: string): string => {
//     const dateMatch = fileName.match(dateRegex);

//     return dateMatch?.length ? dateMatch[0] : '';
// };

// export const reverseDateFromFileName = (fileDate: string): string => {
//     return fileDate.split(dateSeparator).reverse().join(dateSeparator);
// };

// export const formatDate = (fileDate: string): string => {
//     const parts = fileDate.split(dateSeparator);
//     return `${parts[0]}.${parts[1]}.${parts[2].slice(2)}.`;
// };

// export const addOneDayToDateStr = (dateStr: string): string => {
//     const [day, month, year] = dateStr.split(".").map(Number);

//     const date = new Date(2000 + year, month - 1, day);

//     date.setDate(date.getDate() + 1);

//     const newDay = String(date.getDate()).padStart(2, "0");
//     const newMonth = String(date.getMonth() + 1).padStart(2, "0");
//     const newYear = String(date.getFullYear()).slice(2); // Обрізаємо "20"

//     return `${newDay}.${newMonth}.${newYear}`;
// };

export const toInterface = (inp: unknown[]): IInuptData[] => {
    return inp.map((item: IInuptData) => item);
};


export const getNumberFromStr = (input: string): number | null => {
    const match = input.match(/\d+/); // find numbers
    return match ? parseInt(match[0], 10) : null;
};

export const replaceAllNumbers = (input: string, newNumber: number): string => {
  return input.replace(/\d+/g, newNumber.toString()); // change all numbers
};

export const parseToNum = (str: string | number): number => {
    if (typeof str === 'number') return str;
    return Number(str.replaceAll(',', '.'));
};

export const numRound = (num: number, decimal: number = 4): number => {
    return parseFloat(num.toFixed(decimal));
};

export const getValueByKey = (key: string, someObj: object): any => {
    if (!someObj) return null;
    
    return someObj[key as keyof typeof someObj];
};

export const reaplaceStringSymbol = (inputStr: string, findSymbol: string, replaceSymbol: string): string => {
    return inputStr.replaceAll(findSymbol, replaceSymbol);
};