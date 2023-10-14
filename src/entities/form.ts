import { Field, Float, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Booking from "./booking";
import FormEndingScreen from "./formEndScreen";
import FormSection from "./formSection";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
class Form extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column({ default: "" })
    ar_name: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    ar_description: string;

    @Field(() => Int, { nullable: true })
    @Column({ default: 0, nullable: true })
    order: number;

    @Field(() => MediaLibrary, { nullable: true })
    @ManyToOne(() => MediaLibrary, (mediaLibrary) => mediaLibrary.forms)
    image: MediaLibrary;

    @Field(() => MediaLibrary, { nullable: true })
    @ManyToOne(() => MediaLibrary, (mediaLibrary) => mediaLibrary.formsBanner)
    banner: MediaLibrary;

    @Field(() => [FormSection!]!)
    @OneToMany(() => FormSection, (section) => section.form)
    sections: FormSection[];

    @Field(() => [Booking!]!)
    @OneToMany(() => Booking, (b) => b.form)
    bookings: Booking[];

    @Field({ nullable: true })
    @Column({ nullable: true, default: false })
    isHidden: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true, default: false })
    isSmartProCard: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true, default: false })
    isEndScreen: boolean;

    @Field(() => FormEndingScreen, { nullable: true })
    @OneToOne(() => FormEndingScreen, (es) => es.form, {
        nullable: true,
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    endScreen: FormEndingScreen | null;

    @Field(() => Float)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Float)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default Form;
