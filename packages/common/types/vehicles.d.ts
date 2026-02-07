import { User } from "./user";
export interface VehicleUser {
    id: string;
    found: boolean;
    vehicle?: Vehicle;
    user?: User;
}
export interface Vehicle {
    id: string;
    name: string;
    front: string;
    back: string;
}
//# sourceMappingURL=vehicles.d.ts.map