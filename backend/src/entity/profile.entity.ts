import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  bio: string;

  @Field()
  @Column("text", { default: "/images/logo.png" })
  avatar: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
