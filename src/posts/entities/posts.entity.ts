import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class PostsModel extends BaseModel {
    @Column()
    title: string;
    
    @Column()
    content: string;
}