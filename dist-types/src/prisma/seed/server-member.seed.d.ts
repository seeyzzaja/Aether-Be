type SeedServerMemberInput = {
    serverId: string;
    userId: string;
    roleId: string;
};
export declare function seedServerMember({ serverId, userId, roleId, }: SeedServerMemberInput): Promise<{
    createdAt: Date;
    id: string;
    roleId: string;
    serverId: string;
    userId: string;
}>;
export {};
//# sourceMappingURL=server-member.seed.d.ts.map