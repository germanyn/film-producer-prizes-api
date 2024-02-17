import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    year!: number

    @Column()
    title!: string

    @Column('simple-array')
    studios!: string[]

    @Column('simple-array')
    producers!: string[]

    @Column({ default: false })
    winner!: boolean
}
