import { Response, Request } from 'express';

export const sendJwtToClient = async (user: any, res: Response) => {
    const token = await user.generateToken();
    const { JWT_COOKIE, NODE_ENV } = process.env;
    return res.status(200).cookie("acces_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
        secure: NODE_ENV === "development" ? false : true
    }).send({ user, token });
};

export const isTokenIncluded = (req: Request) => {
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer");
};

export const getAccesTokenFromHeader = (req: Request) => {
    const authorization = req.headers.authorization
    const acces_token = authorization.replace("Bearer ", "");
    return acces_token;
}