"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterProducts = exports.deleteProduct = exports.toggleProductAvailability = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../../models/product.model"));
const send_response_1 = require("../../utils/send-response");
const dropdown_model_1 = require("../../models/dropdown.model");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        const { ProductName, Type, Season, Roster } = req.body;
        const isRosterExist = yield dropdown_model_1.RosterModel.findById(Roster);
        if (!isRosterExist) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Roster not found'
            });
        }
        const isTypeExist = yield dropdown_model_1.ProductTypeModel.findById(Type);
        if (!isTypeExist) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product Type not found'
            });
        }
        const isSeasonExist = yield dropdown_model_1.SeasonModel.findById({ _id: Season });
        if (!isSeasonExist) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Season  not found'
            });
        }
        const trimmedProductName = ProductName.trim(); // Trim whitespace from the input
        const existingProduct = yield product_model_1.default.findOne({
            ProductName: { $regex: new RegExp(`^${trimmedProductName}$`, 'i') }
        });
        if (existingProduct) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 409,
                message: 'Product name already exists'
            });
        }
        const product = new product_model_1.default(Object.assign(Object.assign({}, req.body), { CreatedBy: loggedInId, UpdatedBy: loggedInId }));
        yield product.save();
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Product created successfully',
            data: product
        });
    }
    catch (error) {
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.createProduct = createProduct;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        const products = yield product_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .populate('Type', 'Name')
            .populate('Season', 'Name')
            .populate('Roster', 'Name')
            .populate('CreatedBy', 'Email')
            .populate('UpdatedBy', 'Email');
        const total = yield product_model_1.default.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Products retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                products,
            }
        });
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid product ID format'
            });
        }
        const product = yield product_model_1.default.findById(id)
            .populate('Type', 'Name')
            .populate('Season', 'Name')
            .populate('Roster', 'Name')
            .populate('CreatedBy', 'Email FirstName LastName PhoneNumber')
            .populate('UpdatedBy', 'Email FirstName LastName PhoneNumber');
        if (!product) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product not found'
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Product retrieved successfully',
            data: product
        });
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid product ID format'
            });
        }
        const product = yield product_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { UpdatedBy: loggedInId, UpdatedAt: new Date().toISOString() }), { new: true, runValidators: true });
        if (!product) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product not found'
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Product updated successfully',
            data: product
        });
    }
    catch (error) {
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.updateProduct = updateProduct;
const toggleProductAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { Available } = req.body;
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid product ID format'
            });
        }
        if (typeof Available !== 'boolean') {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid value for Available. It must be true or false.'
            });
        }
        const product = yield product_model_1.default.findByIdAndUpdate(id, { Available, UpdatedBy: loggedInId, UpdatedAt: new Date() }, { new: true, runValidators: true });
        if (!product) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product not found'
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Product availability toggled successfully',
            data: product
        });
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.toggleProductAvailability = toggleProductAvailability;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid product ID format'
            });
        }
        const product = yield product_model_1.default.findByIdAndDelete(id);
        if (!product) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product not found'
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.deleteProduct = deleteProduct;
const filterProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query;
        const pipeline = [];
        // Pagination setup
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // ProductName filter using regex for case-insensitive match
        if (filters.ProductName) {
            pipeline.push({
                $match: {
                    ProductName: { $regex: new RegExp(filters.ProductName, 'i') },
                },
            });
        }
        // Type filter based on ProductType name
        if (filters.Type) {
            pipeline.push({
                $lookup: {
                    from: 'producttypes',
                    localField: 'Type',
                    foreignField: '_id',
                    as: 'TypeInfo',
                },
            });
        }
        // Season filter based on Season name
        if (filters.Season) {
            pipeline.push({
                $lookup: {
                    from: 'seasons',
                    localField: 'Season',
                    foreignField: '_id',
                    as: 'SeasonInfo',
                },
            });
        }
        // Roster filter based on Roster name
        if (filters.Roster) {
            pipeline.push({
                $lookup: {
                    from: 'rosters',
                    localField: 'Roster',
                    foreignField: '_id',
                    as: 'RosterInfo',
                },
            });
        }
        // Add a single match stage after all lookups
        const matchConditions = {};
        if (filters.Type) {
            matchConditions['TypeInfo.Name'] = filters.Type;
        }
        if (filters.Season) {
            matchConditions['SeasonInfo.Name'] = filters.Season;
        }
        if (filters.Roster) {
            matchConditions['RosterInfo.Name'] = filters.Roster;
        }
        if (filters.Group) {
            matchConditions.Group = filters.Group;
        }
        if (Object.keys(matchConditions).length > 0) {
            pipeline.push({ $match: matchConditions });
        }
        // Add pagination to the pipeline
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        // Execute the aggregation pipeline
        const products = yield product_model_1.default.aggregate(pipeline);
        const total = yield product_model_1.default.countDocuments(); // Total documents count for pagination
        const totalPages = Math.ceil(total / limit); // Total number of pages
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        if (products.length === 0) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No products found matching the criteria.',
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Products retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                products,
            }
        });
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
exports.filterProducts = filterProducts;
// export const updateProductCategory = async (req: Request, res: Response) => {
//     try {
//         const {productId}=req.query;
//       const {  newCategory } = req.body;
//       // Validate the new category
//       if (!Object.values(CategoryType).includes(newCategory)) {
//         return res.status(400).json({ message: 'Invalid category type' });
//       }
//       // Find the product by ID
//       const product = await ProductModel.findById(productId);
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }
//       // Update the product's category
//       product.Category = newCategory;
//       await product.save();
//       // Return a success response
//       return res.status(200).json({ message: 'Product category updated successfully', product });
//     } catch (error) {
//       return res.status(500).json({ message: 'Internal server error', error });
//     }
//   };
