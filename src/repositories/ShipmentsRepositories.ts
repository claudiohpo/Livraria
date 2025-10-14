import { EntityRepository, Repository } from "typeorm";
import { Shipment } from "../entities/Shipment";

@EntityRepository(Shipment)
class ShipmentsRepositories extends Repository<Shipment> { }

export { ShipmentsRepositories };
