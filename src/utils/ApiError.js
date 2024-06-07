class ApiError {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = ""){
        this.statusCode = statusCode;
        this.message = message; 
        this.errors = errors;
        this.success = false;
    }
}

export { ApiError };