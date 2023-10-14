import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType, ID, Float } from "type-graphql";
import ProductDetails from "./productDetails";
import ProductCustomizationOption from "./productCustomizationOption";
import Service from "./service";
import Project from "./project";
import DynamicContent from "./dynamicContent";
import Product from "./product";
import Form from "./form";
import FormSection from "./formSection";
import InputOption from "./inputOption";
import SmartProCard from "./smartProCard";
import FormSettings from "./formSettings";
import FormEndScreen from "./formEndScreen";
import EmailSettings from "./emailSettings";
import Blog from "./blog";

@ObjectType()
@Entity()
class MediaLibrary extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({ type: "text", nullable: true })
    description: string;

    @Field()
    @Column({ type: "varchar", length: 50 })
    type: string;

    @Field()
    @Column({ type: "varchar", length: 255 })
    s3Key: string;

    @Field()
    @Column({ type: "varchar", length: 50 })
    dir: string;

    @ManyToOne((type) => ProductCustomizationOption, (pco) => pco.image)
    productCustomizationOptions: ProductCustomizationOption[];

    // Products
    @OneToMany((type) => Product, (p) => p.thumbnail, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    productThumbnail: Product[];

    @ManyToMany((type) => Product, (p) => p.showcase, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    @JoinTable()
    productShowcase: Product[];

    // Services Relations
    @OneToMany((type) => Service, (service) => service.cover)
    serviceCover: Service[];

    @OneToMany((type) => Service, (service) => service.banner)
    serviceBanner: Service[];

    @ManyToMany((type) => Service, (service) => service.gallery)
    @JoinTable()
    serviceGallery: Service[];

    // ------------------------ Blog
    @OneToMany((type) => Blog, (blog) => blog.cover)
    blogCover: Blog[];

    @ManyToMany((type) => Blog, (blog) => blog.gallery)
    @JoinTable()
    blogGallery: Blog[];

    // Smart Pro Card
    @OneToMany((type) => SmartProCard, (smartProCard) => smartProCard.frontCard)
    frontSmartProCard: SmartProCard[];

    @OneToMany((type) => SmartProCard, (smartProCard) => smartProCard.backCard)
    backSmartProCard: SmartProCard[];

    // Projects Relations
    @OneToMany((type) => Project, (project) => project.cover)
    projectCover: Project[];

    @OneToMany((type) => Project, (project) => project.banner)
    projectBanner: Project[];

    @ManyToMany((type) => Project, (project) => project.gallery)
    @JoinTable()
    projectGallery: Project[];

    // Dynamic Content
    @OneToMany(
        (type) => DynamicContent,
        (dynamicContent) => dynamicContent.banner
    )
    dynamicContentBanner: DynamicContent[];

    @ManyToMany(
        (type) => DynamicContent,
        (dynamicContent) => dynamicContent.gallery
    )
    @JoinTable()
    dynamicContentGallery: DynamicContent[];

    @OneToMany(() => Form, (form) => form.image, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    forms: Form[];

    @OneToMany(() => Form, (form) => form.image, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    formsBanner: Form[];

    @OneToMany(() => FormSection, (section) => section.image, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    formSections: FormSection[];

    @OneToMany(() => InputOption, (option) => option.image, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    inputOptions: InputOption[];

    @OneToMany(() => FormEndScreen, (endScreen) => endScreen.image, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    formEndScreen: FormEndScreen[];

    @OneToMany(() => EmailSettings, (es) => es.banner, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    emailSettings: EmailSettings[];

    @OneToOne(() => FormSettings, (formSettings) => formSettings.image)
    formSettings: FormSettings;

    @Field(() => Float)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Float)
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => ProductDetails)
    @JoinColumn()
    productDetails: ProductDetails;
}

export default MediaLibrary;
