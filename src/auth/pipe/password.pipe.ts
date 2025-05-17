import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";

@Injectable()
export class PasswordPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (typeof value !== "string") {
			throw new BadRequestException("문자열이 아닙니다.");
		}
		
		if (metadata.type === "param") {
			if (value.length > 8) {
				throw new BadRequestException("비밀번호는 8자 이하로 입력해주세요.");
			}
		}
		
		return value;
	}
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
	constructor(private readonly length: number) {}
	transform(value: any, metadata: ArgumentMetadata) {
		if (typeof value !== "string") {
			throw new BadRequestException("문자열이 아닙니다.");
		}
		
		if (metadata.type === "param") {
			if (value.length > this.length) {
				throw new BadRequestException(`최대 ${this.length}자 이하로 입력해주세요.`);
			}
		}
		
		return value;
	}
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
	constructor(private readonly length: number) {}
	
	transform(value: any, metadata: ArgumentMetadata) {
		if (typeof value !== "string") {
			throw new BadRequestException("문자열이 아닙니다.");
		}
		
		if (metadata.type === "param") {
			if (value.length < this.length) {
				throw new BadRequestException(`최소 ${this.length}자 이상으로 입력해주세요.`);
			}
		}
		
		return value;
	}
}