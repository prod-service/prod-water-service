import { IInuptData } from "../interface";
import { PersonItem } from "../entities/Person";
import { ILocationItem } from "../entities/Location";
import LocationFactory from "../factories/LocationFactory";
import LocationService from "./LocationService";

export interface ILocationListServiceParams {
    locationSign: string;
    nameSign: string;
    locationFactory: LocationFactory;
    locationService: LocationService;
};

export interface ILocationListService {
    create: (inputObj: IInuptData[], date: string) => ILocationItem[]
};

export class LocationListService implements ILocationListService {
    private locationSign: string;
    private nameSign: string;
    private locationFactory: LocationFactory;
    private locationService: LocationService;
    
    constructor({ locationSign, nameSign, locationFactory, locationService }: ILocationListServiceParams) {
        this.locationSign = locationSign;
        this.nameSign = nameSign;
        this.locationFactory = locationFactory;
        this.locationService = locationService;
    }

    create(inputObj: IInuptData[], date: string): ILocationItem[] {
        const map = new Map<string, ILocationItem>();

        inputObj.forEach((currInput) => {
            const currentLocation: string = currInput[this.locationSign];
            const currentPersonName: string = currInput[this.nameSign];
            const person = new PersonItem({ name: currentPersonName, date: [date] })

            if (!map.has(currentLocation)) {
                map.set(currentLocation, this.locationFactory.createLocation(currentLocation, [person]));
            } else {
                const existingLocation = map.get(currentLocation);
                this.locationService.addPerson(existingLocation, person);
            }

    
        }, {});

        return Array.from(map.values());
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