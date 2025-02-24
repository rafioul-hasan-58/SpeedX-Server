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
        var _a, _b, _c, _d;
        const filterByBrand = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.filterBybrand;
        const filterByColor = (_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.filterBycolor;
        const maxprice = (_c = this === null || this === void 0 ? void 0 : this.query) === null || _c === void 0 ? void 0 : _c.maxPrice;
        const minprice = (_d = this === null || this === void 0 ? void 0 : this.query) === null || _d === void 0 ? void 0 : _d.minPrice;
        // console.log(minprice, maxprice);
        if (maxprice) {
            this.modelQuery = this.modelQuery.find({
                price: { $lte: maxprice }
            });
        }
        if (minprice) {
            this.modelQuery = this.modelQuery.find({
                price: { $gte: minprice }
            });
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
            });
        }
        else if (filterByBrand) {
            this.modelQuery = this.modelQuery.find({
                brandName: filterByBrand
            });
        }
        else if (filterByColor) {
            this.modelQuery = this.modelQuery.find({
                color: filterByColor
            });
        }
        return this;
    }
}
exports.default = QueryBuilder;
