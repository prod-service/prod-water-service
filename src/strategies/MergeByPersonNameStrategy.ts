import LocationItem from "../entities/Location";
import { PersonItem } from "../entities/Person";
import { LocationMergeStrategy } from "./LocationMergeStrategy";

export default class MergeByPersonNameStrategy implements LocationMergeStrategy {
    public merge(lists: LocationItem[][]): LocationItem[] {
        const map = new Map<string, LocationItem>();

        lists.forEach((list: LocationItem[]) => {
            list.forEach((location: LocationItem) => {
                const locationName = location.name;

                if (!map.has(locationName)) {
                    map.set(location.name, new LocationItem({ name: locationName, personList: [...location.personList] }))
                } else {
                    const existingLocation = map.get(locationName);

                    existingLocation.setPersonList(this.concatPersonLists(location.personList, existingLocation.personList));
                }
            });
        });

        return Array.from(map.values());
    }

    private concatPersonLists(baseItems: PersonItem[], nextItems: PersonItem[]): PersonItem[] {
        let resultArr = [...baseItems, ...nextItems];
    
        return resultArr.reduce((prev, curr) => {
            const prevPerson = prev.find(({ name:prevN }) => prevN === curr.name);
            if (prevPerson){
                prevPerson.date = prevPerson.date.concat(curr.date);
            } else {prev.push(curr);}
            
            return prev;
        }, []);
    };
}