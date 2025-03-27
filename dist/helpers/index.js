"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueByKey = exports.numRound = exports.parseToNum = exports.replaceAllNumbers = exports.getNumberFromStr = exports.toInterface = exports.reverseDateFromFileName = exports.getDateFromFileName = void 0;
const consts_1 = require("../consts");
const getDateFromFileName = (fileName) => {
    const dateMatch = fileName.match(consts_1.dateRegex);
    return dateMatch?.length ? dateMatch[0] : '';
};
exports.getDateFromFileName = getDateFromFileName;
const reverseDateFromFileName = (fileDate) => {
    return fileDate.split(consts_1.dateSeparator).reverse().join(consts_1.dateSeparator);
};
exports.reverseDateFromFileName = reverseDateFromFileName;
const toInterface = (inp) => {
    return inp.map((item) => item);
};
exports.toInterface = toInterface;
const getNumberFromStr = (input) => {
    const match = input.match(/\d+/); // find numbers
    return match ? parseInt(match[0], 10) : null;
};
exports.getNumberFromStr = getNumberFromStr;
const replaceAllNumbers = (input, newNumber) => {
    return input.replace(/\d+/g, newNumber.toString()); // change all numbers
};
exports.replaceAllNumbers = replaceAllNumbers;
const parseToNum = (str) => {
    if (typeof str === 'number')
        return str;
    return Number(str.replaceAll(',', '.'));
};
exports.parseToNum = parseToNum;
const numRound = (num, decimal = 4) => {
    return parseFloat(num.toFixed(decimal));
};
exports.numRound = numRound;
const getValueByKey = (key, someObj) => {
    if (!someObj)
        return null;
    return someObj[key];
};
exports.getValueByKey = getValueByKey;
//# sourceMappingURL=index.js.map