import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => { // data is the parameter passed inside the decorater. Since we never use this, its type is never
        const request = context.switchToHttp().getRequest();
        return request.CurrentUser;
    }
)