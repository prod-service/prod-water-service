import { LocationMergeStrategy } from './LocationMergeStrategy';
import { ILocationItem } from '../entities/Location';

export class LocationMerger {
    constructor(private strategy: LocationMergeStrategy) {}

    merge(lists: ILocationItem[][]): ILocationItem[] {
        return this.strategy.merge(lists);
    }
}