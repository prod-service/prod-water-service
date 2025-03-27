"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainTotalWaterValueCell = exports.totalDayWaterRange = exports.waterValuesRange = exports.namesRange = exports.dateSignRange = exports.totalItemsRange = exports.subjectNameRange = exports.bodyTableRange = exports.headerTableRange = exports.fullPageRange = exports.dateRange = exports.textRotation = exports.defultStyles = exports.defaultBorderStyle = exports.leftCenterAlignHV = exports.leftAlignH = exports.centerAlignVH = exports.centerAlignH = exports.xsmFont = exports.smFont = exports.lgFont = exports.defaultFont = exports.defaultFontName = exports.dateRegex = exports.maxNameListLength = exports.waterConst = exports.dateSeparator = exports.locationSign = exports.nameSign = exports.IPN = exports.numb = exports.templateFolder = exports.inputFileDir = exports.outputFolder = exports.warningMessage = exports.mealDishesSymbols = exports.dinnerDishes = exports.lunchDishes = exports.breakfastDishes = exports.totalPerPerson = exports.totalPerTeam = exports.countByItems = exports.mealNames = exports.templateFileName = exports.fileNamePrefix = exports.vit = exports.egg = exports.dinner = exports.lunch = exports.breakfast = void 0;
;
exports.breakfast = 'сніданок';
exports.lunch = 'обід';
exports.dinner = 'вечеря';
exports.egg = 'яйце';
exports.vit = 'гексавіт';
exports.fileNamePrefix = 'namesCombined';
exports.templateFileName = 'Роздавальна відомість (чиста).xlsx';
exports.mealNames = [exports.breakfast, exports.lunch, exports.dinner];
exports.countByItems = [exports.egg, exports.vit];
exports.totalPerTeam = Symbol('разом на команду');
exports.totalPerPerson = Symbol('разом на особу');
exports.breakfastDishes = Symbol('сніданок');
exports.lunchDishes = Symbol('обід');
exports.dinnerDishes = Symbol('вечеря');
exports.mealDishesSymbols = {
    'сніданок': exports.breakfastDishes,
    'обід': exports.lunchDishes,
    'вечеря': exports.dinnerDishes,
};
// export const dateRegex = /\d{1,2}\.\d{1,2}\.\d{2,4}/;
exports.warningMessage = `Увага! Перед загрузкою розкладки, очистіть клітинки які містять прізвища, посади і звання всіх відповідальних осіб. Також очистіть шапку із затвердженням командира в/ч.`;
exports.outputFolder = '../../output-files';
exports.inputFileDir = '../input-files';
exports.templateFolder = '../template-file';
exports.numb = '№';
exports.IPN = 'ІПН';
exports.nameSign = 'ПІБ';
exports.locationSign = 'Об\'єкт';
exports.dateSeparator = '-';
exports.waterConst = '1,5';
exports.maxNameListLength = 40;
exports.dateRegex = new RegExp(`\\d{2,4}\\${exports.dateSeparator}\\d{1,2}\\${exports.dateSeparator}\\d{1,2}`);
// Excel's
exports.defaultFontName = 'Times New Roman';
exports.defaultFont = { sz: 12, name: exports.defaultFontName };
exports.lgFont = { ...exports.defaultFont, sz: 13 };
exports.smFont = { ...exports.defaultFont, sz: 11 };
exports.xsmFont = { ...exports.defaultFont, sz: 10 };
exports.centerAlignH = { horizontal: 'center', wrapText: true };
exports.centerAlignVH = { vertical: 'center', horizontal: 'center', wrapText: true };
exports.leftAlignH = { horizontal: 'left', wrapText: true };
exports.leftCenterAlignHV = { horizontal: 'left', vertical: 'center', wrapText: true };
exports.defaultBorderStyle = { style: 'thin', color: { rgb: '000000' } };
exports.defultStyles = { font: exports.defaultFont, alignment: exports.centerAlignVH };
exports.textRotation = 90;
exports.dateRange = 'C14:AG14';
exports.fullPageRange = 'A1:AI69';
exports.headerTableRange = 'A4:AI5';
exports.bodyTableRange = 'A7:AI59';
exports.subjectNameRange = 'C8:AG8';
exports.totalItemsRange = 'AH8:AH16';
exports.dateSignRange = 'AI8:AI16';
exports.namesRange = 'B18:B57';
exports.waterValuesRange = 'C18:AG57';
exports.totalDayWaterRange = 'C58:AG58';
exports.mainTotalWaterValueCell = 'AH58';
const resultExample = {
    'kotlove': [
        {
            name: 'Прізвище Імя побатькові',
            date: ['2025-03-22']
        }
    ]
};
//# sourceMappingURL=index.js.map