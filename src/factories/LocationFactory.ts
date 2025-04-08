import LocationItem, { ILocationItem } from "../entities/Location";
import { IPersonItem } from "../entities/Person";

export default class LocationFactory {
    createLocation(name: string, personList: IPersonItem[]): ILocationItem {
        return new LocationItem({ name, personList });
    }
}