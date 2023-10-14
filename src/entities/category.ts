import { Field, ID, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import Product from "./product";

@ObjectType()
@Entity()
class Category extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column({ default: "" })
    ar_name: string;

    @Field({ nullable: true })
    @ManyToOne(() => Category, (category) => category.id)
    parent: Category;

    @OneToMany((type) => Product, (p) => p.category)
    productCategory: Product[];

    @Field(() => Int)
    @CreateDateColumn({ type: "timestamptz" })
    createdAt: number;

    @Field(() => Int)
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: number;
}

export default Category;
