import { EntityRepository, Repository } from "typeorm";
import { Category } from "../entities/Category";

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {}

export { CategoriesRepository };