// import { Entity, PrimaryGeneratedColumn, Column,ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
// import { Costumer } from "./Costumer";

// export enum AddressType {
//     DELIVERY = "DELIVERY",
//     BILLING = "BILLING"
// }

// @Entity("addresses")
// export class Address {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     residenceType: string;

//     @Column()
//     streetType: string;

//     @Column()
//     street: string;

//     @Column()
//     number: string;

//     @Column()
//     complement: string;

//     @Column()
//     neighborhood: string;

//     @Column()
//     city: string;

//     @Column()
//     state: string;

//     @Column()
//     zipCode: string;

//     @Column()
//     observations: string;

//     @Column({
//         type: "enum",
//         enum: AddressType
//     })
//     type: AddressType;

//     @CreateDateColumn()
//     created_at!: Date;

//     @UpdateDateColumn()
//     updated_at!: Date;

//     @ManyToOne(() => Costumer, (client) => client.addresses, { onDelete: "CASCADE" })
//     costumer: Costumer;

// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Costumer } from "./Costumer";

export type AddressType = "BILLING" | "DELIVERY";

@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 20 })
  type!: AddressType; // ex: 'BILLING' | 'DELIVERY'

  @Column()
  residenceType!: string;

  @Column()
  streetType!: string;

  @Column()
  street!: string;

  @Column()
  number!: string;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  neighborhood!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  zipCode!: string;

  @Column({ type: "text", nullable: true })
  observations?: string;

  @ManyToOne(() => Costumer, (c) => c.addresses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "costumer_id" })
  costumer!: Costumer;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
