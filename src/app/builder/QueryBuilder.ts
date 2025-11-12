import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>
    public query: Record<string, unknown>
    constructor(modelQuery: Query<T[], T>, query: Record<string, any>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    // search method
    search(searchAbleFields: string[]) {
        const search = this?.query?.searchTerm || '';
        // console.log(search);
        if (search) {
            this.modelQuery = this.modelQuery.find({
                $or: searchAbleFields.map((field) => ({
                    [field]: { $regex: search, $options: "i" }
                }) as FilterQuery<T>
                )
            })

        }
        return this
    }
    // sort method
    // sort() {
    //     const sortOrder = this?.query?.sortOrder || 'desc';
    //     if (sortOrder && sortOrder === 'asc') {
    //         const sort = this?.query?.sort || 'createdAt';
    //         this.modelQuery = this.modelQuery.sort(sort as string);
    //         return this;
    //     } else if (sortOrder && sortOrder === 'desc') {
    //         const sort = this?.query?.sort || '-createdAt';
    //         this.modelQuery = this.modelQuery.sort(sort as string);
    //         return this;
    //     }
    //     return this
    // }
    // filter method
    filter() {
        const {
            filterBybrand,
            filterBycolor,
            filterBytype,
            maxPrice,
            minPrice,
            filterByBikeType,
            addedBy
        } = this.query;
        console.log(addedBy);

        const filterConditions: FilterQuery<T>[] = [];
        console.log(filterBybrand);
        if (filterBybrand) {
            filterConditions.push({ brandName: filterBybrand });
        }

        if (filterBycolor) {
            filterConditions.push({ color: filterBycolor });
        }

        if (filterBytype) {
            filterConditions.push({ type: filterBytype });
        }
        if (addedBy) {
            filterConditions.push({ addedBy })
        }
        if (filterByBikeType) {
            filterConditions.push({ bikeType: filterByBikeType });
        }
        if (minPrice || maxPrice) {
            const priceCondition: any = {};
            if (minPrice) priceCondition.$gte = Number(minPrice);
            if (maxPrice) priceCondition.$lte = Number(maxPrice);
            filterConditions.push({ price: priceCondition });
        }
        // console.log(filterConditions);
        if (filterConditions.length > 0) {
            this.modelQuery = this.modelQuery.find({
                $and: filterConditions,
            });
        }
        return this
    }

}

export default QueryBuilder