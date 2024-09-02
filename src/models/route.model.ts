import { prop, getModelForClass, Ref, pre } from '@typegoose/typegoose';
import { Employee } from './employee.model';


// Vehicle Model
@pre<Vehicle>('save', function () {
  this.UpdatedAt = new Date();
})
export class Vehicle {
  @prop({ required: true })
  public VehicleName!: string;

  @prop({ required: true })
  public Classification!: string;

  @prop({ required: true })
  public VehicleNumber!: string;

  @prop({ required: true })
  public VehicleModelType!: string;

  @prop({ required: true })
  public DriverName!: string;

  @prop({ required: true })
  public DriverNumber!: number;

  @prop({ ref: () => Employee, required: true })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: true })
  public UpdatedBy!: Ref<Employee>;

  @prop({ type: Boolean, default: true })
  public Status!: boolean;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

const VehicleModel = getModelForClass(Vehicle);

// Locality Model
@pre<Locality>('save', function () {
  this.UpdatedAt = new Date();
})
export class Locality {
  @prop({ type: String, required: true })
  public LocalityName!: string;

  @prop({ type: [String], default: [] })
  public Pin!: string[];

  @prop({ type: Boolean, default: false })
  public Serviceable!: boolean;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ ref: () => Employee, required: true })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: true })
  public UpdatedBy!: Ref<Employee>;
}

const LocalityModel = getModelForClass(Locality);

// Zone Model
@pre<Zone>('save', function () {
  this.UpdatedAt = new Date();
})
export class Zone {
  @prop({ type: String, required: true })
  public ZoneName!: string;

  @prop({ type: Boolean, default: true })
  public Serviceable!: boolean;

  // @prop({ required: true })   //Moved to routes model
  // public DeliverySequence!: number;

  @prop({ type: Number, required: true})
  public DeliveryCost?: number;

  @prop(  { ref: () => Locality , required:true} )
  public Localities!: Ref<Locality>[];

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ ref: () => Employee, required: true })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: true })
  public UpdatedBy!: Ref<Employee>;
}

const ZoneModel = getModelForClass(Zone);

// Route Model
@pre<Route>('save', function () {
  this.UpdatedAt = new Date();
})
export class Route {
  @prop({ type: String, required: true })
  public RouteName!: string;

  @prop({ type: Boolean, default: true })
  public Status!: boolean;


  @prop({
    type: () => [Object], 
    default: [], 
})
  public ZonesIncluded!: {
    ZoneId: Ref<Zone>;  // Use Ref<Zone> to reference the Zone model
    DeliverySequence: number;
  }[];


  
  @prop({ ref: () => Vehicle })
  public VehicleTagged?: Ref<Vehicle[]>;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ ref: () => Employee, required: true })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: true })
  public UpdatedBy!: Ref<Employee>;
}

const RouteModel = getModelForClass(Route);


// City Model
@pre<City>('save', function () {
  this.UpdatedAt = new Date();
})
export class City {
  @prop({ type: String, required: true })
  public CityName!: string;

  @prop({ type: Boolean, default: false })
  public Serviceable!: boolean;

  @prop({ required: true })
  public SortOrder!: number;

  @prop({ type: Number, default: 0 })
  public SectorCount?: number;

  @prop({ ref: () => Zone })
  public Zone?: Ref<Zone>;

  @prop({ ref: () => Route })
  public Route?: Ref<Route>;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ ref: () => Employee, required: true })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: true })
  public UpdatedBy!: Ref<Employee>;
}

const CityModel = getModelForClass(City);

export {
  CityModel,
  ZoneModel,
  LocalityModel,
  RouteModel,
  VehicleModel,
};
