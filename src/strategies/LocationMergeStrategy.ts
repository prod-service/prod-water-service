import { ILocationItem } from "../entities/Location";

export interface LocationMergeStrategy {
    merge(lists: ILocationItem[][]): ILocationItem[];
};
