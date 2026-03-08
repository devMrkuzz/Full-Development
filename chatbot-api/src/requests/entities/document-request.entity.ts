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
  requesterName!: string;

  @Column()
  contactNumber!: string;

  @Column()
  documentType!: string;

  @Column({type: 'text'})
  purpose!: string;

  @Column({ default: 'PENDING' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}