"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModel = exports.RouteModel = exports.LocalityModel = exports.ZoneModel = exports.CityModel = exports.City = exports.Route = exports.Zone = exports.Locality = exports.Vehicle = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const employee_model_1 = require("./employee.model");
// Vehicle Model
let Vehicle = class Vehicle {
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "VehicleName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "Classification", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "VehicleNumber", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "VehicleModelType", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "DriverName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "DriverNumber", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "UpdatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "Status", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Vehicle.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Vehicle.prototype, "UpdatedAt", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typegoose_1.pre)('save', function () {
        this.UpdatedAt = new Date();
    })
], Vehicle);
const VehicleModel = (0, typegoose_1.getModelForClass)(Vehicle);
exports.VehicleModel = VehicleModel;
// Locality Model
let Locality = class Locality {
};
exports.Locality = Locality;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Locality.prototype, "LocalityName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Locality.prototype, "Pin", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Locality.prototype, "Serviceable", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Locality.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Locality.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], Locality.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], Locality.prototype, "UpdatedBy", void 0);
exports.Locality = Locality = __decorate([
    (0, typegoose_1.pre)('save', function () {
        this.UpdatedAt = new Date();
    })
], Locality);
const LocalityModel = (0, typegoose_1.getModelForClass)(Locality);
exports.LocalityModel = LocalityModel;
// Zone Model
let Zone = class Zone {
};
exports.Zone = Zone;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Zone.prototype, "ZoneName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Zone.prototype, "Serviceable", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Zone.prototype, "DeliveryCost", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Locality, required: true }),
    __metadata("design:type", Array)
], Zone.prototype, "Localities", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Zone.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Zone.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], Zone.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], Zone.prototype, "UpdatedBy", void 0);
exports.Zone = Zone = __decorate([
    (0, typegoose_1.pre)('save', function () {
        this.UpdatedAt = new Date();
    })
], Zone);
const ZoneModel = (0, typegoose_1.getModelForClass)(Zone);
exports.ZoneModel = ZoneModel;
// Route model Stared
class ZoneInfo {
}
__decorate([
    (0, typegoose_1.prop)({ ref: () => Zone, required: true }),
    __metadata("design:type", Object)
], ZoneInfo.prototype, "ZoneId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], ZoneInfo.prototype, "DeliverySequence", void 0);
// Route Model
let Route = class Route {
};
exports.Route = Route;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Route.prototype, "RouteName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Route.prototype, "Status", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [ZoneInfo], default: [] }),
    __metadata("design:type", Array)
], Route.prototype, "ZonesIncluded", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Vehicle }),
    __metadata("design:type", Object)
], Route.prototype, "VehicleTagged", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Route.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Route.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], Route.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], Route.prototype, "UpdatedBy", void 0);
exports.Route = Route = __decorate([
    (0, typegoose_1.pre)('save', function () {
        this.UpdatedAt = new Date();
    })
], Route);
const RouteModel = (0, typegoose_1.getModelForClass)(Route);
exports.RouteModel = RouteModel;
// City Model
let City = class City {
};
exports.City = City;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], City.prototype, "CityName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], City.prototype, "Serviceable", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], City.prototype, "SortOrder", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], City.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], City.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], City.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: true }),
    __metadata("design:type", Object)
], City.prototype, "UpdatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Zone }),
    __metadata("design:type", Array)
], City.prototype, "ZoneIncluded", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Route }),
    __metadata("design:type", Array)
], City.prototype, "RouteIncluded", void 0);
exports.City = City = __decorate([
    (0, typegoose_1.pre)('save', function () {
        this.UpdatedAt = new Date();
    })
], City);
const CityModel = (0, typegoose_1.getModelForClass)(City);
exports.CityModel = CityModel;
