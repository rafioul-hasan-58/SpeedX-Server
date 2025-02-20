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
        console.log(search);
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
        const filterByBrand = this?.query?.filterBybrand as string;
        const filterByColor = this?.query?.filterBycolor as string;
        const maxprice = this?.query?.maxPrice as number;
        const minprice = this?.query?.minPrice as number;
        // console.log(minprice, maxprice);
        if (maxprice) {
            this.modelQuery = this.modelQuery.find({
                price: { $lte: maxprice }
            })
        }
        if (minprice) {
            this.modelQuery = this.modelQuery.find({
                price: { $gte: minprice }
            })
        }
        if (filterByBrand && filterByColor) {
            this.modelQuery = this.modelQuery.find({
                $and: [
                    {
                        brandName: filterByBrand
                    },
                    {
                        color: filterByColor
                    }
                ]
            })
        }
        else if (filterByBrand) {
            this.modelQuery = this.modelQuery.find({
                brandName: filterByBrand
            })
        } else if (filterByColor) {
            this.modelQuery = this.modelQuery.find({
                color: filterByColor
            })
        }
        return this
    }

}

export default QueryBuilder