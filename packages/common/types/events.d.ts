import { Contact } from "./contacts";
import { Group } from "./groups";
export interface Bet {
    id: string;
    eventId: string;
    contestantId: string;
    contact?: Contact;
    group?: Group;
    amount: number;
    createdAt: string;
    updatedAt: string;
    event?: Event;
}
export interface Participant {
    id: string;
    name: string;
    color: string;
}
export interface Event {
    id: string;
    name: string;
    startDate: string;
    notes?: string;
    bets: Bet[];
    participants: Participant[];
    createdAt: string;
    updatedAt: string;
    betsOpened: boolean;
    winner?: Participant;
}
//# sourceMappingURL=events.d.ts.map