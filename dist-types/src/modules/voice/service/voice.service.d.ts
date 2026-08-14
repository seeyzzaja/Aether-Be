export declare class VoiceService {
    private getActorPermissions;
    createVoiceToken(channelId: string, userId: string, withVideo: boolean): Promise<{
        livekitUrl: string;
        token: string;
        roomName: string;
    }>;
}
export declare const voiceService: VoiceService;
//# sourceMappingURL=voice.service.d.ts.map