export interface IDateParser {
    dateRegex: RegExp,
    dateSeparator: string,
    getDateFromFileName: (fileName: string) => string,
    reverseDateFromFileName: (filefileDateName: string) => string,
    formatDate: (fileDate: string) => string,
    addOneDayToDateStr: (dateStr: string) => string,
};

export class DateParser implements IDateParser {
    dateRegex: RegExp
    dateSeparator: string

    constructor(dateRegex: RegExp, dateSeparator: string) {
        this.dateRegex = dateRegex;
        this.dateSeparator = dateSeparator;
    };

    getDateFromFileName = (fileName: string): string => {
        const dateMatch = fileName.match(this.dateRegex);
    
        return dateMatch?.length ? dateMatch[0] : '';
    };
    
    reverseDateFromFileName = (fileDate: string): string => {
        return fileDate.split(this.dateSeparator).reverse().join(this.dateSeparator);
    };
    
    formatDate = (fileDate: string): string => {
        const parts = fileDate.split(this.dateSeparator);
        return `${parts[0]}.${parts[1]}.${parts[2].slice(2)}.`;
    };
    
    addOneDayToDateStr = (dateStr: string): string => {
        const [day, month, year] = dateStr.split(".").map(Number);
        const date = new Date(2000 + year, month - 1, day);
    
        date.setDate(date.getDate() + 1);
    
        const newDay = String(date.getDate()).padStart(2, "0");
        const newMonth = String(date.getMonth() + 1).padStart(2, "0");
        const newYear = String(date.getFullYear()).slice(2); // Обрізаємо "20"
    
        return `${newDay}.${newMonth}.${newYear}`;
    };
};