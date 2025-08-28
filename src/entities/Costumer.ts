// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
// import { Address } from "./Address";
// import { CreditCard } from "./CreditCard";

// @Entity("costumers")
// export class Costumer {
//     @PrimaryGeneratedColumn()
//     id!: number;

//     @Column({ length: 100 })
//     name!: string;

//     @Column({ length: 100, unique: true })
//     email!: string;

//     @Column()
//     password!: string;

//     @Column({ length: 14, unique: true }) //ver se será 11 ou 14
//     cpf!: string;

//     @Column({ length: 20 })
//     phone!: string;

//     @Column({ type: "date" })
//     birthdaydate!: Date;

//     @Column({ length: 10 })
//     gender!: string;

//     // um customer tem vários endereços (1:N)
//   @OneToMany(() => Address, (address) => address.costumer, { cascade: true, eager: true })
//   addresses!: Address[];

//   // um customer pode ter vários cartões
//   @OneToMany(() => CreditCard, (card) => card.costumer, { cascade: true, eager: true })
//   creditCards!: CreditCard[];

//   // ranking (RN0027)
//   @Column({ type: "int", default: 0 })
//   ranking!: number;

//   // opcional: clientCode (RF0035) - se for usar, adicione coluna e migration
//   @Column({ length: 20, unique: true, nullable: true })
//   clientCode?: string;

//   @CreateDateColumn()
//   created_at!: Date;

//   @UpdateDateColumn()
//   updated_at!: Date;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Address } from "./Address";
import { CreditCard } from "./CreditCard";

@Entity("costumers")
export class Costumer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  // senha criptografada
  @Column()
  password!: string;

  @Column({ length: 14, unique: true })
  cpf!: string;

  @Column({ length: 30 })
  phone!: string;

  @Column({ type: "date" })
  birthdaydate!: Date;

  @Column({ length: 10 })
  gender!: string;

  // 1:N com Address
  @OneToMany(() => Address, (address) => address.costumer, { cascade: true, eager: true })
  addresses!: Address[];

  // 1:N com CreditCard
  @OneToMany(() => CreditCard, (card) => card.costumer, { cascade: true, eager: true })
  creditCards!: CreditCard[];

  // ranking (padrão 0)
  @Column({ type: "int", default: 0 })
  ranking!: number;

  // código opcional (se quiser implementar RF0035 crie migration)
  @Column({ length: 20, unique: true, nullable: true })
  clientCode?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
