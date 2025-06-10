import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { Program } from "src/modules/programs/entities/program.entity";

@Entity({ name: "skills" })
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.skills)
  users: User[];

  @ManyToMany(() => Program, (program) => program.skills)
  programs: Program[];
}
