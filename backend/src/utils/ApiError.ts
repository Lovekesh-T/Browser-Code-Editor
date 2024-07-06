export class ApiError extends Error{
    public statusCode:number;
    public success:boolean;
    constructor(message:string,statusCode:number){
        super(message)
        this.statusCode = statusCode;
        this.success = false;
    }
}