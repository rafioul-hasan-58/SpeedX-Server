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
            filterByBikeType
        } = this.query;

        const filterConditions: FilterQuery<T>[] = [];

        if (filterBybrand) {
            filterConditions.push({ brandName: filterBybrand });
        }

        if (filterBycolor) {
            filterConditions.push({ color: filterBycolor });
        }

        if (filterBytype) {
            filterConditions.push({ type: filterBytype });
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
    // filter() {
    //     const filterByBrand = this?.query?.filterBybrand as string;
    //     const filterByColor = this?.query?.filterBycolor as string;
    //     const maxprice = this?.query?.maxPrice as number;
    //     const minprice = this?.query?.minPrice as number;
    //     const type = this?.query?.filterBytype as string;
    //     console.log(type);
    //     if (maxprice) {
    //         this.modelQuery = this.modelQuery.find({
    //             price: { $lte: maxprice }
    //         })
    //     }
    //     if (minprice) {
    //         this.modelQuery = this.modelQuery.find({
    //             price: { $gte: minprice }
    //         })
    //     }
    //     if (filterByBrand && filterByColor) {
    //         this.modelQuery = this.modelQuery.find({
    //             $and: [
    //                 {
    //                     brandName: filterByBrand
    //                 },
    //                 {
    //                     color: filterByColor
    //                 }
    //             ]
    //         })
    //     }
    //     else if (filterByBrand) {
    //         this.modelQuery = this.modelQuery.find({
    //             brandName: filterByBrand
    //         })
    //     } else if (filterByColor) {
    //         this.modelQuery = this.modelQuery.find({
    //             color: filterByColor
    //         })
    //     }
    //     return this
    // }

}

export default QueryBuilder