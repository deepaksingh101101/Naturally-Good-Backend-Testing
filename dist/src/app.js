"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import the CORS middleware
const config_1 = require("./config");
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const superadmin_routes_1 = __importDefault(require("./routes/superadmin.routes"));
const permissions_routes_1 = __importDefault(require("./routes/permissions.routes"));
const complain_routes_1 = __importDefault(require("./routes/complain.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const coupons_routes_1 = __importDefault(require("./routes/coupons.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const bag_routes_1 = __importDefault(require("./routes/bag.routes"));
const route_routes_1 = __importDefault(require("./routes/route.routes"));
const plans_routes_1 = __importDefault(require("./routes/plans.routes"));
const dropdown_routes_1 = __importDefault(require("./routes/dropdown.routes"));
const swaggerConfig_1 = require("./swaggerConfig"); // Import the Swagger configuration
dotenv_1.default.config();
class Application {
    constructor() {
        this.app = (0, express_1.default)();
        this.middlewares();
        this.routes();
        (0, swaggerConfig_1.setupSwagger)(this.app);
    }
    middlewares() {
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)()); // Enable CORS
    }
    routes() {
        this.app.use("/tasks", tasks_routes_1.default);
        this.app.use("/auth", auth_routes_1.default);
        this.app.use("/admin", admin_routes_1.default);
        this.app.use("/superadmin", superadmin_routes_1.default);
        this.app.use("/permission", permissions_routes_1.default);
        this.app.use("/product", product_routes_1.default);
        this.app.use("/bag", bag_routes_1.default);
        this.app.use("/coupons", coupons_routes_1.default);
        this.app.use("/subscription", subscription_routes_1.default);
        this.app.use("/order", order_routes_1.default);
        this.app.use("/plan", plans_routes_1.default);
        this.app.use("/dropDown", dropdown_routes_1.default);
        this.app.use("/complain", complain_routes_1.default);
        this.app.use("/route", route_routes_1.default);
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
    }
    start() {
        this.app.listen(config_1.PORT, () => {
            console.log("Server is running at", config_1.PORT);
        });
    }
}
exports.Application = Application;
