import * as XLSX from 'xlsx-js-style';
import { defaultFont, leftCenterAlignHV, centerAlignVH, defaultBorderStyle, defultStyles, textRotation, waterConst, headerTitleCellAddress, documentNumberCellAddress, registNumberCellAddress, emptyCellSign } from '../consts';
import { ICalcTotalWatePerDay, IDataCell, IPerson } from '../interface';
import { addOneDayToDateStr, formatDate, parseToNum, reverseDateFromFileName } from '../helpers';
import { headerTitle } from './dictionary';

export const getCellsArrFromRange = (worksheet: XLSX.WorkSheet, range: string): IDataCell[] => {
    const rangeRef = XLSX.utils.decode_range(range);
    let result = [];

    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
    
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: '' };

            result.push({ value: worksheet[cellAddress].v, colIndex: col, rowIndex: row });
        }
    };

    return result;
};

export const insertListIntoColumn = (worksheet: XLSX.WorkSheet, list: string[], colName: string, colStart: number): void => {
    list.forEach((item, idx) => {
        const cell = `${colName}${colStart + idx}`;
        worksheet[cell] = {
            v: item,
            s: { font: defaultFont, alignment: leftCenterAlignHV }
        }
    });
};

export const insertStaticFormattedCells = (worksheet: XLSX.WorkSheet, formattedCells: any[]) => {
    formattedCells.forEach(({ cell, value, style }) => {
        if (!worksheet[cell]) worksheet[cell] = {};
        XLSX.utils.sheet_add_aoa(worksheet, [[value]], { origin: cell, cellStyles: true });
        worksheet[cell].s = style;
    });
};

export const addCellsStyles = (worksheet: XLSX.WorkSheet, range: string, styles: object = defultStyles): XLSX.WorkSheet => {
    const rangeRef = XLSX.utils.decode_range(range);
    
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
    
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    
            if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: '' }; // Якщо комірка порожня, створюємо її
            
            worksheet[cellAddress].s = {
                ...worksheet[cellAddress].s,
                ...styles
            };
        }
    };

    return worksheet;
};

export const addBorderdsTable = (worksheet: XLSX.WorkSheet, range: string) => {
    const rangeRef = XLSX.utils.decode_range(range);
    
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {

        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

            if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: '' }; // Якщо комірка порожня, створюємо її
            worksheet[cellAddress].v = worksheet[cellAddress].v || '';
            worksheet[cellAddress].t = 's';
            worksheet[cellAddress].s = {
                ...worksheet[cellAddress].s,
                border: {
                    top: defaultBorderStyle,
                    bottom: defaultBorderStyle,
                    left: defaultBorderStyle,
                    right: defaultBorderStyle,
                },
            };
        }
    }
};

export const addBordersMultiTable = (worksheet: XLSX.WorkSheet, range: string[]): XLSX.WorkSheet => {
    range.forEach((rangeItem) => { addBorderdsTable(worksheet, rangeItem) });

    return worksheet;
};

export const addRotateStyles = (worksheet: XLSX.WorkSheet, range: string[]): XLSX.WorkSheet => {
    range.forEach((rangeItem) => {
        addCellsStyles(worksheet, rangeItem, { alignment: { textRotation, ...centerAlignVH } })
    });

    return worksheet;
};

export const insertDataIntoRange = (worksheet: XLSX.WorkSheet, range: string, data: string[]): IDataCell[] => {
    const rangeRef = XLSX.utils.decode_range(range);
    let result = [];
    
    let dataIndex = 0;

    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {
    
        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const value = data[dataIndex] || '';
            
            if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: value }; // Якщо комірка порожня, створюємо її
            else { worksheet[cellAddress] = { ...worksheet[cellAddress], v: value } }
            
            if (value) result.push({ value, colIndex: col, rowIndex: row });
            dataIndex++;
        }
    };

    return result;
};

// TODO: immutable
export const setDailyWaterIntale = (booksheet: XLSX.WorkSheet, nameCells: IDataCell[], dateList: IDataCell[], personList: IPerson[]):XLSX.WorkSheet => {
    let localSheet = { ...booksheet };

    nameCells.forEach((nameCell) => {
        const currPersone = personList.find(({ name }) => name === nameCell.value);

        const cossCoordinates = currPersone.date.map((currDate) => {
            const crossDate = dateList.find((d) => d.value === currDate);
            if (!crossDate) return '';

            return { c: crossDate.colIndex, r: nameCell.rowIndex };
        });

        cossCoordinates.forEach((coordinateItem) => {
            if (coordinateItem) {
                const cellAddress = XLSX.utils.encode_cell(coordinateItem);
                localSheet[cellAddress] = { ...localSheet[cellAddress], v: waterConst }
            }
        });

    });

    return localSheet;
};

export const setCellTypeForRange = (worksheet: XLSX.WorkSheet, range: string, cellType: string) => {
    const rangeRef = XLSX.utils.decode_range(range);
    
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {

        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

            if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: '' }; // Якщо комірка порожня, створюємо її
            worksheet[cellAddress].t = cellType;
        }
    }  
};

// export const calcSumCellValue = (): number => {

// };

export const calcTotalWaterPerDay = (worksheet: XLSX.WorkSheet, valuesRange: string): ICalcTotalWatePerDay => {
    const waterValues: XLSX.Range = XLSX.utils.decode_range(valuesRange);
    const values: number[] = [];

    for (let col = waterValues.s.c; col <= waterValues.e.c; col++) {
        const colSum: string[] = [];

        for (let row = waterValues.s.r; row <= waterValues.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

            if (worksheet[cellAddress]) {
                colSum.push(worksheet[cellAddress].v);
            }
        };

        values.push(
            colSum.reduce((prev, curr) => {
                return prev + parseToNum(curr);
            }, 0)
        );
    };

    return {
        totalColArr: values,
        total: values.reduce((prev, curr) => (prev + curr), 0)
    }
    
};

export const parseDateForOutpu = (dateStr: string): string => {
    const reversed = reverseDateFromFileName(dateStr);
    const formated = formatDate(reversed);
    return addOneDayToDateStr(formated);
};

export const setDocumentNumber = (worksheet: XLSX.WorkSheet, numberValue: string | number): void => {
    [registNumberCellAddress, documentNumberCellAddress]
        .forEach((cellAddress) => {
            worksheet[cellAddress] = { ...worksheet[cellAddress], v: numberValue }
        });

    worksheet[headerTitleCellAddress] = {
        ...worksheet[headerTitleCellAddress],
        v: headerTitle(numberValue)
    }
};

export const fillEmptyCellsInRange = (worksheet: XLSX.WorkSheet, range: string): XLSX.WorkSheet => {
    let localSheet = { ...worksheet };
    const rangeRef = XLSX.utils.decode_range(range);
    
    for (let row = rangeRef.s.r; row <= rangeRef.e.r; row++) {

        for (let col = rangeRef.s.c; col <= rangeRef.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            
            if (!worksheet[cellAddress] || !worksheet[cellAddress].v) {
                worksheet[cellAddress] = { ...worksheet[cellAddress], v: emptyCellSign }; // Якщо комірка порожня, створюємо її
            }
        };
    };

    return localSheet;
};