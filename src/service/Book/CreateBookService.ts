import { getCustomRepository } from "typeorm";
import { IBookRequest } from "../../Interface/IBookInterface";
import { BooksRepositories } from "../../repositories/BooksRepositories";
import { CategoriesRepository } from "../../repositories/CategoriesRepository";
import { PriceGroupRepository } from "../../repositories/PriceGroupRepository";

export class CreateBookService {
  async execute(data: IBookRequest) {
    const {
      author,
      category, // array de ids de categoria
      year,
      title,
      publisher,
      edition,
      ISBN,
      pages,
      synopsis,
      dimensions,
      pricegroup, // id do grupo de precificação
      barcode,
      cost,       // agora vem direto da interface
    } = data;

    // RN0011 - validação obrigatória
    if (
      !author ||
      !category ||
      !Array.isArray(category) ||
      category.length === 0 ||
      !year ||
      !title ||
      !publisher ||
      !edition ||
      !ISBN ||
      !pages ||
      !synopsis ||
      !dimensions ||
      typeof dimensions.height !== "number" ||
      typeof dimensions.width !== "number" ||
      typeof dimensions.depth !== "number" ||
      typeof dimensions.weight !== "number" ||
      !pricegroup ||
      !barcode
    ) {
      throw new Error("Todos os campos obrigatórios devem ser preenchidos corretamente.");
    }

    const categoriesRepo = getCustomRepository(CategoriesRepository);
    const categoryEntities = await categoriesRepo.findByIds(category);
    if (!categoryEntities || categoryEntities.length === 0) {
      throw new Error("Categorias inválidas ou não encontradas.");
    }

    const priceGroupRepo = getCustomRepository(PriceGroupRepository);
    const group = await priceGroupRepo.findOne(pricegroup);
    if (!group) {
      throw new Error("Grupo de precificação inválido.");
    }

    const booksRepo = getCustomRepository(BooksRepositories);

    // ISBN único
    const bookAlreadyExists = await booksRepo.findOne({ where: { ISBN } });
    if (bookAlreadyExists) {
      throw new Error("Livro com esse ISBN já está cadastrado.");
    }

    // Barcode único
    const barcodeExists = await booksRepo.findOne({ where: { barcode } });
    if (barcodeExists) {
      throw new Error("Livro com esse código de barras já está cadastrado.");
    }

    // RN0013: cálculo de preço com base no grupo
    if (!cost || cost <= 0) {
      throw new Error("Custo do livro (cost) deve ser informado para cálculo do preço.");
    }

    // supondo que o PriceGroup tem um campo `margin` (ex.: 0.30 = 30%)
    const margin = Number((group as any).margin ?? 0);
    if (isNaN(margin)) {
      throw new Error("Margem inválida no grupo de precificação.");
    }

    const computedPrice = Number((cost + cost * margin).toFixed(2));

    const book = booksRepo.create({
      author,
      categories: categoryEntities,
      year,
      title,
      publisher,
      edition,
      ISBN,
      pages,
      synopsis,
      dimensions,
      pricegroup: group,
      barcode,
      price: computedPrice,
      status: "ACTIVE",
    });

    await booksRepo.save(book);

    return book;
  }
}