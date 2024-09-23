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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdmin = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
let SuperAdmin = class SuperAdmin {
    validatePassword(inputPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(inputPassword, this.Password);
        });
    }
};
exports.SuperAdmin = SuperAdmin;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], SuperAdmin.prototype, "Email", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SuperAdmin.prototype, "Password", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SuperAdmin.prototype, "Role", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], SuperAdmin.prototype, "isActive", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: false }),
    __metadata("design:type", Date)
], SuperAdmin.prototype, "updatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: false }),
    __metadata("design:type", Date)
], SuperAdmin.prototype, "createdAt", void 0);
exports.SuperAdmin = SuperAdmin = __decorate([
    (0, typegoose_1.ModelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    }),
    (0, typegoose_1.pre)('save', function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isModified('Password')) {
                return next();
            }
            const salt = yield bcrypt_1.default.genSalt(10);
            this.Password = yield bcrypt_1.default.hash(this.Password, salt);
            next();
        });
    })
], SuperAdmin);
const SuperAdminModel = (0, typegoose_1.getModelForClass)(SuperAdmin);
exports.default = SuperAdminModel;
