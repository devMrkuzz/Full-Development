import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export enum UserRole {
    STUDENT = 'STUDENT',
    STAFF = 'STAFF',
    ADMIN = 'ADMIN',
  }
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({select: false})
    password: string;
  
    @Column()
    fullName: string;
  
    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.STUDENT,
    })
    role: UserRole;
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }