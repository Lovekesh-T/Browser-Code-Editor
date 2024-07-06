export class ApiResponse{
    public success:boolean;
    constructor(public message:string, public statusCode:number,public data?:any){
        this.message = message;
        this.statusCode = statusCode;
        this.success = true;
        this.data = data || null;

    }
}