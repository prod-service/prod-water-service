import { IPersonItem } from "./Person";

export interface ILocationItem {
    name: string,
    personList: IPersonItem[]
}

export default class LocationItem implements ILocationItem {
    public name: string
    public personList: IPersonItem[]
    
    constructor({ name, personList }: {name: string, personList: IPersonItem[]}) {
        this.name = name;
        this.personList = personList;
    };

    setPersonList(list: IPersonItem[]): void {
        this.personList = list;
    };
}