import { ValidationArguments } from "class-validator";

export const emailValidationMessage = (args: ValidationArguments) => {
	return `${args.property}는 이메일로 입력해주세요.`;
}