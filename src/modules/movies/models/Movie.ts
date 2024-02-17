import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Producer } from './Producer'

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

    @ManyToMany(() => Producer, producer => producer.movies, {
        cascade: true,
    })
    @JoinTable({ name: 'producer_movies' })
    producers!: Producer[]

    @Column({ default: false })
    winner!: boolean
}
