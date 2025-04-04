import { IFileBase, IInuptData } from "./interface";
import { IInvoiceBase, InvoiceBase } from "./invoice-base";
import { PersonItem } from "./person-model";

export interface IInvoiceModelParams {
    locationSign: string,
    nameSign: string,
};

export interface IInvoiceModel {
    locationSign: string,
    nameSign: string,
    create: (inputObj: IInuptData[], date: string) => IInvoiceBase,
    // concat: (prevObj: IFileBase, currentObj: IFileBase) => IFileBase
};

// Fabric ?
export class InvoiceModel implements IInvoiceModel {
    locationSign: string;
    nameSign: string;
    
    constructor({ locationSign, nameSign }: IInvoiceModelParams) {
        this.locationSign = locationSign;
        this.nameSign = nameSign;
    }

    create = (inputObj: IInuptData[], date: string): IInvoiceBase => {
        const invoice = new InvoiceBase({});

        inputObj.forEach((currInput) => {
            const currentLocation = currInput[this.locationSign];
            const currentName = currInput[this.nameSign];
            const person = new PersonItem({ name: currentName, date: [date] })

            invoice.insertPersonByLocation(currentLocation, person);
            // const prevNameListByLocation = prev[currentLocation];
    
            // if (prevNameListByLocation) {
            //     prevNameListByLocation.push({ name: currentName, date: [date] });
            //     return { ...prev };
            // }
    
            // return {
            //     ...prev,
            //     [currInput[this.locationSign]]: [{ name: currentName, date: [date] }]
            // };
    
        }, {});

        return invoice;
    };

    // concat = (prevObj: IFileBase, currentObj: IFileBase): IFileBase => {
    //     return Object.keys(currentObj).reduce((prev, currLoc) => {
    //         const prevLocation = prevObj[currLoc];
    //         const currLocation = currentObj[currLoc];
    
    //         if (!prevLocation && currLocation) return { ...prev, [currLoc]: currLocation }
    
    //         const up = concatPersonLists(prevLocation, currLocation);
            
    //         const newSing = {
    //             ...prev,
    //             [currLoc]: up
    //         }
    
    //         return newSing;        
    //     }, {})
    // };
}