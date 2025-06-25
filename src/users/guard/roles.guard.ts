import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Roles Annotation의 메타데이터 조회
        const requiredRoles = await this.reflector.getAllAndOverride(
            ROLES_KEY,
            [
                // 이 가드가 적용되고 있는 문맥상에서 이 key값을 기준으로 메타데이터를 조회
                context.getHandler(), // 컨트롤러의 메소드
                context.getClass(), // 컨트롤러의 클래스
                // 컨트롤러의 메소드나 클래스에 Roles Annotation이 없으면 undefined를 반환
            ]
        );
        
        // Roles Annotation이 없으면 모든 사용자가 접근 가능
        if (!requiredRoles) {
            return true;
        }
        
        const { user } = context.switchToHttp().getRequest();
        
        if (!user) {
            throw new UnauthorizedException(`토큰을 제공해주세요.`);
        }
        
        if (user.role !== requiredRoles) {
            throw new ForbiddenException(`권한이 없습니다. ${requiredRoles} 권한이 필요합니다.`);
        }
        
        return true;
    }
}