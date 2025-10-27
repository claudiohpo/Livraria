import { EntityRepository, Repository } from 'typeorm';
import { Exchange } from '../entities/Exchange';

@EntityRepository(Exchange)
class ExchangesRepositories extends Repository<Exchange> {

}

export { ExchangesRepositories }