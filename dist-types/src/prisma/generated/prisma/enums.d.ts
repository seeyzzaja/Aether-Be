export declare const AuthTokenType: {
    readonly EMAIL_VERIFICATION: 'EMAIL_VERIFICATION';
    readonly PASSWORD_RESET: 'PASSWORD_RESET';
};
export type AuthTokenType = (typeof AuthTokenType)[keyof typeof AuthTokenType];
export declare const ChannelType: {
    readonly TEXT: 'TEXT';
    readonly VOICE: 'VOICE';
    readonly VIDEO: 'VIDEO';
    readonly FORUM: 'FORUM';
    readonly ANNOUNCEMENT: 'ANNOUNCEMENT';
    readonly DM: 'DM';
    readonly GROUP_DM: 'GROUP_DM';
};
export type ChannelType = (typeof ChannelType)[keyof typeof ChannelType];
export declare const OAuthProvider: {
    readonly GOOGLE: 'GOOGLE';
    readonly GITHUB: 'GITHUB';
    readonly FACEBOOK: 'FACEBOOK';
};
export type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];
//# sourceMappingURL=enums.d.ts.map