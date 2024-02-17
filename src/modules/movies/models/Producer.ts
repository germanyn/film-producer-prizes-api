import { BaseEntity, Brackets, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm'
import { Movie } from './Movie'
import { AppDataSource } from '../../../infra/database'

@Entity()
export class Producer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @ManyToMany(() => Movie, movie => movie.producers)
    @JoinTable({ name: 'producer_movies' })
    movies!: Movie[]

    // static findConsecutivePrizes() {
    //     const piSubquery = AppDataSource
    //         .getRepository(Movie)
    //         .createQueryBuilder("m")
    //         .select(["p.name AS producer", "LAG(m.year) OVER (PARTITION BY pm.producerId ORDER BY m.year) AS previousWin", "m.year AS followingWin"])
    //         .innerJoin("producer_movies", "pm", "pm.movieId = m.id")
    //         .innerJoin("producer", "p", "p.id = pm.producerId")
    //         .where("m.winner = true")
    //         .orderBy("m.year")
    //         .getQuery();

    //     const query = AppDataSource
    //         .createQueryBuilder()
    //         .select(["pi.producer", "pi.previousWin", "pi.followingWin", "pi.followingWin - pi.previousWin AS interval"])
    //         .from(`(${piSubquery})`, "pi")
    //         .where("pi.interval IS NOT NULL")
    //         .andWhere("pi.previousWin IS NOT NULL")
    //         .orderBy("interval", "DESC")
    //         .limit(1);

    //     return query.getRawOne();
    // }

    static findLongestConsecutivePrizes() {
        return this.findConsecutivePrizes('max')
    }

    static findShortestConsecutivePrizes() {
        return this.findConsecutivePrizes('min')
    }

    private static findConsecutivePrizes(intervalAmount: 'min' | 'max') {
        const subQuery = AppDataSource.createQueryBuilder().select([
            'pi.producer',
            'pi.previousWin',
            'pi.followingWin'
        ])
        .addSelect("pi.followingWin - pi.previousWin", "interval")
        .from(subQuery => {
            return subQuery
                .select("p.name", "producer")
                .addSelect("LAG(m.year) OVER (PARTITION BY p.id ORDER BY m.year)", "previousWin")
                .addSelect("m.year", "followingWin")
                .from(Movie, "m")
                .innerJoinAndSelect("m.producers", "p")
                .where("m.winner = true")
                .orderBy("m.year");
        }, "pi")
        .where("interval IS NOT NULL")
        .andWhere("pi.previousWin IS NOT NULL");

        return AppDataSource
            .createQueryBuilder()
            .addCommonTableExpression(subQuery, 'pi')
            .select('pi.*')
            .from('pi', 'pi')
            .where(`interval=(${
                    AppDataSource
                        .createQueryBuilder()
                        .select(`${intervalAmount}(pi.interval)`)
                        .from('pi', 'pi')
                        .getSql()
                })`
            )
            .getRawMany()
    }
}
