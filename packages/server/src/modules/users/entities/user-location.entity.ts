import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_location")
export class UserLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column()
  city: string;
}
