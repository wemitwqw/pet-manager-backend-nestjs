export interface AuthorizedRequest extends Request {
    user: UserInRequest;
}

interface UserInRequest {
    sub: number;
    username: string;
    iat: number;
    exp: number;
}