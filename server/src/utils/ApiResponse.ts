class ApiResponse {

    public success: boolean;
    public statusCode: number;
    public message: string;
    public response: any | null;

    constructor(
        statusCode: number,
        message: string = "Success",
        data: any | null = null
    ) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.response = data;
    }
}

export default ApiResponse;