import type { NextFunction, Request, Response } from "express";
export declare class VoiceController {
    private getChannelId;
    private getUserId;
    createToken(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const voiceController: VoiceController;
//# sourceMappingURL=voice.controller.d.ts.map