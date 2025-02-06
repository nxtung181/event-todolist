// export interface ICreateUserRequest{
//     name: string;
//     email: string;
//     password: string;
// }

// export interface ILoginUserRequest{
//     email: string;
//     password: string;
// }
export interface IUserForgotPass{
    email: string;
    otp: string;
}

export interface IUserRes{
    id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export interface IUserTest{
    user: IUserRes[],
    count: number
}
export interface IUserLoginRes{
    user: IUserRes
    token: IToken
}
export interface IToken {
    accessToken: string;
    refreshToken: string;
}