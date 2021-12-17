import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Profile } from "./profile.entity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true })
  email: string;

  @Field()
  @Column("text", { unique: true })
  username: string;

  @Column()
  password: string;

  @Field()
  @Column("timestamp with time zone", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("boolean", { default: false })
  confirmedEmail: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile;
}
