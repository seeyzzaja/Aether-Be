export declare class MembershipService {
    join(serverId: string, userId: string): Promise<{
        roleId: string;
        role: {
            id: string;
        };
        createdAt: Date;
        id: string;
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