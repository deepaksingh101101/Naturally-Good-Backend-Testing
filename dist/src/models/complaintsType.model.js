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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintsType = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const employee_model_1 = require("./employee.model");
let ComplaintsType = class ComplaintsType {
};
exports.ComplaintsType = ComplaintsType;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ComplaintsType.prototype, "ComplaintType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: false, default: true }),
    __metadata("design:type", Boolean)
], ComplaintsType.prototype, "Status", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], ComplaintsType.prototype, "Description", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ComplaintsType.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ComplaintsType.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], ComplaintsType.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], ComplaintsType.prototype, "UpdatedBy", void 0);
exports.ComplaintsType = ComplaintsType = __decorate([
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    })
], ComplaintsType);
const ComplaintsTypeModel = (0, typegoose_1.getModelForClass)(ComplaintsType);
exports.default = ComplaintsTypeModel;
