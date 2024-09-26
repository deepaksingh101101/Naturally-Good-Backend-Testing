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
  public DriverNumber!: string;

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

  @prop({ type: String, required: true })
  public Pin!: string;

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


// Route model Stared
class ZoneInfo {
  @prop({ ref: () => Zone, required: true })
  public ZoneId!: Ref<Zone>;

  @prop({ required: true })
  public DeliverySequence!: number;
}
// Route Model
enum DaysOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}
@pre<Route>('save', function () {
  this.UpdatedAt = new Date();
})
export class Route {
  @prop({ type: String, required: true })
  public RouteName!: string;

  @prop({ type: Boolean, default: true })
  public Status!: boolean;


@prop({ type: () => [ZoneInfo], default: [] })
public ZonesIncluded!: ZoneInfo[];

@prop({ type: () => String, enum: DaysOfWeek, default: [] })
public Days!: DaysOfWeek[];

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

  @prop({ type: Boolean, default: true })
  public Serviceable!: boolean;

  @prop({ type: Number, required: true})
  public SortOrder!: number;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ ref: () => Employee, required: true })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: true })
  public UpdatedBy!: Ref<Employee>;
  
  @prop({ ref: () => Zone })
  public ZoneIncluded?: Ref<Zone>[];
  
  @prop({ ref: () => Route })
  public RouteIncluded?: Ref<Route>[];
}

const CityModel = getModelForClass(City);

export {
  CityModel,
  ZoneModel,
  LocalityModel,
  RouteModel,
  VehicleModel,
};
