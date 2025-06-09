import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const QueryRunner = createParamDecorator((data, context: ExecutionContext) => {
	const req = context.switchToHttp().getRequest();
	
	if (!req.queryRunner) {
		throw new InternalServerErrorException("QueryRunner decorator는 TransactionInterceptor와 함께 사용해야합니다.");
	}
	
	return req.queryRunner;
})