type SeedServerInput = {
    ownerId: string;
    name: string;
};
export declare function seedServer({ ownerId, name }: SeedServerInput): Promise<{
    id: string;
    name: string;
    ownerId: string;
}>;
export {};
//# sourceMappingURL=server.seed.d.ts.map