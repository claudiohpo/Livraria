import { EntityRepository, Repository } from 'typeorm';
import { ReturnRequest } from '../entities/ReturnRequest';

@EntityRepository(ReturnRequest)
class ReturnsRepositories extends Repository<ReturnRequest> {

}

export { ReturnsRepositories }
