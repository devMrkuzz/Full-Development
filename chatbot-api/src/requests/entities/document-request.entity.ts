import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DocumentRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  trackingCode!: string;

  @Column()
  requesterRole!: string;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  studentOrEmployeeId?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  contactNumber?: string;

  @Column()
  documentType!: string;

  @Column({ type: 'text', nullable: true })
  purpose?: string;

  @Column({ default: 'PENDING' })
  status!: 'PENDING' | 'ON_PROCESS' | 'RELEASED' | 'REJECTED';

  @CreateDateColumn()
  createdAt!: Date;
}