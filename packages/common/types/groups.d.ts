import { Contact } from './contacts';
export interface Group {
    id: string;
    name: string;
    tag?: string;
    description?: string;
    color1?: string;
    color2?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    contacts?: Contact[];
}
//# sourceMappingURL=groups.d.ts.map