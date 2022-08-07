import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

interface ClassConstructor {
    new (...args: any[]): {};
}

// here we use ClassConstructor so that we cannot pass any other things other than class
export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        /* Run something before a request is handled 
        by the request handler */
        
        return handler.handle().pipe(
            map((data: any) => {
                // Run something before the respose is sent out
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        );
    }
}