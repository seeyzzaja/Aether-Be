import "dotenv/config";
export declare function seedUser(): Promise<{
    owner1: {
        email: string;
        id: string;
        username: string;
    } | undefined;
    owner2: {
        email: string;
        id: string;
        username: string;
    } | undefined;
    member: {
        email: string;
        id: string;
        username: string;
    } | undefined;
    password: string;
}>;
//# sourceMappingURL=user.seed.d.ts.map