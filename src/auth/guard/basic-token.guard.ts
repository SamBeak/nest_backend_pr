import { CanActivate, ExecutionContext } from "@nestjs/common";

export class BasicTokenGuard implements CanActivate {
	
	async canActivate(context: ExecutionContext): Promise<boolean>{
		const request = context.switchToHttp().getRequest();
	}
}