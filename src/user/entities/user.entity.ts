// src/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: true })
    status: boolean;


    @OneToMany(() => Loan, loan => loan.user)
    loans: Loan[];
}
