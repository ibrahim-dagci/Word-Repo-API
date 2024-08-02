import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpError } from 'http-errors';
import { JwtPayload } from 'jsonwebtoken';

export interface Person extends JwtPayload {
    userName: string,
    _id: string,
}

interface CustomRequest extends Request {
    admin: Person
    user: Person
    file: any
}


export type CustomMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => void;

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;


export type ErrorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => void;
