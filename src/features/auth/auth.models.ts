/** Wire models for the Persu auth API. */

export interface IUser {
    id: string;
    phone: string;
    nickName?: string;
    avatar?: string;
}

export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthResponse extends ITokenPair {
    user: IUser;
}

export interface ICheckResponse {
    exists: boolean;
}

export interface ISuccessResponse {
    success: boolean;
}

export interface ISessionResponse {
    user: IUser;
}

export interface IErrorResponse {
    error: {
        code: string;
        message: string;
    };
}
