import { IsIn, IsNumber, IsOptional } from "class-validator";

export class PaginatePostDto {
    // 이 프로퍼티에 입력된 ID 보다 높은 ID부터 값을 가져오기
    @IsNumber()
    @IsOptional()
    where__id_more_than?: number;
	
	@IsNumber()
	@IsOptional()
	where__id_less_than?: number;
    
    // 정렬
    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    order__createdAt?: 'ASC' | 'DESC' = 'ASC';
    
    // 가져올 응답 수
    @IsNumber()
    @IsOptional()
    take: number = 20;
}