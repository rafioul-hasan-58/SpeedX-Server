"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // search method
    search(searchAbleFields) {
        var _a;
        const search = ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm) || '';
        // console.log(search);
        if (search) {
            this.modelQuery = this.modelQuery.find({
                $or: searchAbleFields.map((field) => ({
                    [field]: { $regex: search, $options: "i" }
                }))
            });
        }
        return this;
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
        const { filterBybrand, filterBycolor, filterBytype, maxPrice, minPrice, filterByBikeType } = this.query;
        const filterConditions = [];
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
        if (filterByBikeType) {
            filterConditions.push({ bikeType: filterByBikeType });
        }
        if (minPrice || maxPrice) {
            const priceCondition = {};
            if (minPrice)
                priceCondition.$gte = Number(minPrice);
            if (maxPrice)
                priceCondition.$lte = Number(maxPrice);
            filterConditions.push({ price: priceCondition });
        }
        // console.log(filterConditions);
        if (filterConditions.length > 0) {
            this.modelQuery = this.modelQuery.find({
                $and: filterConditions,
            });
        }
        return this;
    }
}
exports.default = QueryBuilder;
