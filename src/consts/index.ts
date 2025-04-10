import { IFileBase } from "../interface";

interface IMealDishes {
    [key: string]: symbol
};


export const breakfast = 'сніданок';
export const lunch = 'обід';
export const dinner = 'вечеря';
export const egg = 'яйце';
export const vit = 'гексавіт';

export const fileNamePrefix = 'namesCombined';
export const fullTemplateFileName = 'Роздавальна відомість (чиста).xlsx';
export const halfTemplateFileName = 'Роздавальна відомість (половина).xlsx';

export const mealNames = [breakfast, lunch, dinner];
export const countByItems = [egg, vit]

export const totalPerTeam = Symbol('разом на команду');
export const totalPerPerson = Symbol('разом на особу');

export const breakfastDishes = Symbol('сніданок');
export const lunchDishes = Symbol('обід');
export const dinnerDishes = Symbol('вечеря');

export const mealDishesSymbols: IMealDishes = {
    'сніданок': breakfastDishes,
    'обід': lunchDishes,
    'вечеря': dinnerDishes,
};

// export const dateRegex = /\d{1,2}\.\d{1,2}\.\d{2,4}/;

export const warningMessage: string = `Увага! Перед загрузкою розкладки, очистіть клітинки які містять прізвища, посади і звання всіх відповідальних осіб. Також очистіть шапку із затвердженням командира в/ч.`;

export const outputFolder = '../../output-files';
export const inputFileDir = '../input-files';
export const templateFolder = '../template-file';
export const outputTotalFileName = 'total';

export const numb = '№';
export const IPN = 'ІПН';
export const nameSign = 'ПІБ';
export const locationSign = 'Об\'єкт';
export const dateSeparator = '-';
export const waterConst = '1,5';
export const maxNameListLength = 40;
export const dateRegex = new RegExp(`\\d{2,4}\\${dateSeparator}\\d{1,2}\\${dateSeparator}\\d{1,2}`);
export const defaultOutputFileName = 'вода';
export const emptyCellSign = '-';

// Excel's
export const defaultFontName = 'Times New Roman';
export const defaultFont = { sz: 12, name: defaultFontName };
export const lgFont = { ...defaultFont, sz: 13 };
export const smFont = { ...defaultFont, sz: 11 };
export const xsmFont = { ...defaultFont, sz: 10 };
export const centerAlignH = { horizontal: 'center', wrapText: true };
export const centerAlignVH = { vertical: 'center', horizontal: 'center', wrapText: true };
export const leftAlignH = { horizontal: 'left', wrapText: true };
export const leftCenterAlignHV = { horizontal: 'left', vertical: 'center', wrapText: true };
export const defaultBorderStyle = { style: 'thin', color: { rgb: '000000' } };
export const defultStyles = { font: defaultFont, alignment: centerAlignVH };
export const textRotation = 90;
export const dateRange = 'C14:AG14';
export const fullPageRange = 'A1:AI69';
export const headerTableRange = 'A4:AI5';
export const bodyTableRange = 'A7:AI59';
export const subjectNameRange = 'C8:AG8';
export const totalItemsRange = 'AH8:AH16';
export const dateSignRange = 'AI8:AI16';
export const namesRange = 'B18:B57';
export const waterValuesRange = 'C18:AG57';
export const totalDayWaterRange = 'C58:AG58';
export const mainTotalWaterValueCell = 'AH58';
export const headerTitleCellAddress = 'A1';
export const registNumberCellAddress = 'A5';
export const documentNumberCellAddress = 'E5';
// data for half template
export const totalDayWaterRangeHalfTempl = 'C58:R58';
export const mainTotalWaterValueCellHalfTempl = 'S58';
export const waterValuesRangeHalfTempl = 'C18:R57';

// TODO: handle half template
export const getTemplateMetaData = (isHalf: boolean = false): object => {
    return {
        fullPageRange: isHalf ? 'A1:T69' : 'A1:AI69',
        dateRange: isHalf ? 'C14:R14' : 'C14:AG14',
        headerTableRange: isHalf ? 'A4:T5' : 'A4:AI5',
        bodyTableRange: isHalf ? 'A7:T59' : 'A7:AI59',

    };
};

const resultExample: IFileBase = {
    'kotlove': [
        {
            name: 'Прізвище Імя побатькові',
            date: ['2025-03-22']
        }
    ]
};