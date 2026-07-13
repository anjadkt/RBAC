class ApiError extends Error {

    public readonly statusCode: number;
    public readonly success: boolean;
    public readonly errors: unknown[];
    public readonly ok: boolean;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: unknown[] = []
    ) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.ok = false
    }
}

export default ApiError;