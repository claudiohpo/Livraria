import {EntityRepository, Repository} from "typeorm";
import { Payment } from "../entities/Payment";

@EntityRepository(Payment)
class PaymentsRepository extends Repository<Payment> {}

export { PaymentsRepository };