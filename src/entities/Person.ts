import { IPerson } from "../interface";

export interface IPersonItem extends IPerson {
    name: string,
    date: string[],
    get personInfo(): IPerson,
    addDate: (newDate: string) => void
}

export class PersonItem implements IPersonItem {
    public name: string;
    public date: string[];

    constructor({ name, date }: IPerson) { // IPersonParams
        this.name = name;
        this.date = date;
    }

    get personInfo() { return { name: this.name, date: this.date }}

    addDate = (newDate: string): void => {
        this.date.push(newDate);
    }
}