import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConfig } from "src/conf/jwt.config";
import { Request } from 'express'
import { Injectable } from "@nestjs/common";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: `${jwtConfig.refreshSecret}`,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const refreshToken = this.extractTokenFromHeader(req);
        return {
            ...payload,
            refreshToken
        };
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}