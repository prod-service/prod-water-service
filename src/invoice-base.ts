import { IPersonItem } from "./person-model";

export interface IInvoiceBase {
    list: IInvoiceBaseParams[],
    insertPersonByLocation: (location: string, person: IPersonItem) => void
    createLocation: (location: string, personList?: IPersonItem[]) => void
    getLocation: (location: string) => IInvoiceBaseParams | undefined
};
export interface IInvoiceBaseParams {
    location?: string
    personList?: IPersonItem[]
};

export class InvoiceBase implements IInvoiceBase {
    list: IInvoiceBaseParams[]

    constructor({ location, personList }: IInvoiceBaseParams) {
        if (location && personList) this.list.push({ location, personList });
        else this.list = [];
    }

    insertPersonByLocation = (location: string, person: IPersonItem) => {
        const currentLocation = this.getLocation(location);
        if (currentLocation) currentLocation.personList.push(person);
        else this.createLocation(location, [person])
    }
    
    createLocation = (location: string, personList?: IPersonItem[]) => {
        this.list.push({ location, personList: personList || [] });
    }
    
    getLocation = (location: string): IInvoiceBaseParams | undefined => {
        return this.list.find((item) => item.location.toLocaleLowerCase().trim() === location.toLocaleLowerCase().trim());
    }
}