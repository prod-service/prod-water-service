import { IPerson } from "./interface";

export class PersonService {
    concatPersonLists = (baseItems: IPerson[], nextItems: IPerson[]): IPerson[] => {
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