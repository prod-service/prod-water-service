import { ILocationItem } from "../entities/Location";
import { IPersonItem } from "../entities/Person";

export default class LocationService {
    addPerson(location: ILocationItem, person: IPersonItem): void {
        const existingPerson = this.findPerson(location, person);
        if (!existingPerson) location.personList.push(person);
    }

    removePerson(location: ILocationItem, person: IPersonItem): void {
        location.personList = location.personList.filter((pers) => {
            return pers.name.toLocaleLowerCase().trim() !== person.name.toLocaleLowerCase().trim()
        });
    }
    
    findPerson(location: ILocationItem, person: IPersonItem): IPersonItem | undefined {
        return location.personList.find((p) => p.name.toLocaleLowerCase().trim() === person.name.toLocaleLowerCase().trim());
    }
}