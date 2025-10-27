import { EntityRepository, Repository } from 'typeorm';
import { Refund } from '../entities/Refund';

@EntityRepository(Refund)
class RefundsRepositories extends Repository<Refund> {

}

export { RefundsRepositories }
