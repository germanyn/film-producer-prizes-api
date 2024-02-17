import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Movie } from './Movie'

@Entity()
export class Producer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @ManyToMany(() => Movie, movie => movie.producers)
    @JoinTable({ name: 'producer_movies' })
    movies!: Movie[]
}
