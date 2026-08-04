export declare class MembershipService {
    join(serverId: string, userId: string): Promise<{
        createdAt: Date;
        id: string;
        role: {
            color: string | null;
            id: string;
            isDefault: boolean;
            name: string;
            position: number;
        };
        roleId: string;
        serverId: string;
        user: {
            email: string;
            id: string;
            username: string;
        };
        userId: string;
    }>;
    leave(serverId: string, userId: string): Promise<void>;
}
export declare const membershipService: MembershipService;
//# sourceMappingURL=membership.service.d.ts.map