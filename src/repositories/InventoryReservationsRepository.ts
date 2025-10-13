import { EntityRepository, Repository } from "typeorm";
import { InventoryReservation } from "../entities/InventoryReservation";

@EntityRepository(InventoryReservation)
class InventoryReservationsRepository extends Repository<InventoryReservation> { }

export { InventoryReservationsRepository };