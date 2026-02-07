import { Vehicle } from "./vehicles";
export type VehicleTransactionInput = {
    vehicleUserId: string;
    targetId: string;
    rewardAmount: number;
    isMoney: boolean;
    isDirtyMoney: boolean;
    itemId: string | null;
};
export interface VehicleTransaction {
    id: string;
    vehicle: Vehicle;
}
//# sourceMappingURL=vehicleTransactions.d.ts.map