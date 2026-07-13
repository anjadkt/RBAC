import { type ZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

export const validate =
    (schema: ZodObject) =>
        (req: Request, _res: Response, next: NextFunction) => {
            try {
                const validated = schema.parse({
                    body: req.body,
                    params: req.params,
                    query: req.query,
                });

                req.body = validated.body;
                req.params = validated.params as typeof req.params;
                req.query = validated.query as typeof req.query;

                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    const firstError = error.issues[0];

                    return next(
                        new ApiError(
                            400,
                            firstError.message,
                            [
                                {
                                    field: firstError.path.join("."),
                                    code: firstError.code,
                                },
                            ]
                        )
                    );
                }

                next(error);
            }
        };