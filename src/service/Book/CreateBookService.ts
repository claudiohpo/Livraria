import { getCustomRepository } from "typeorm";
import { IBookRequest } from "../../Interface/IBookInterface"; // remova extensão .ts
import { BooksRepositories } from "../../repositories/BooksRepositories";
import { CategoriesRepository } from "../../repositories/CategoriesRepository";
import { PriceGroupRepository } from "../../repositories/PriceGroupRepository";

export class CreateBookService {
  async execute(data: IBookRequest) {
    const {
      author,
      category, // array de ids de categoria (ex.: number[] ou string[])
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
      // opcional: cost (se você capturar custo)
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
    // RN0012 - associação com categorias: exige pelo menos uma categoria válida
    if (!categoryEntities || categoryEntities.length === 0) {
      throw new Error("Categorias inválidas ou não encontradas.");
    }

    const priceGroupRepo = getCustomRepository(PriceGroupRepository);
    const group = await priceGroupRepo.findOne(pricegroup);
    // RN0013 - grupo de precificação deve existir
    if (!group) {
      throw new Error("Grupo de precificação inválido.");
    }

    const booksRepo = getCustomRepository(BooksRepositories);

    // ISBN único
    const bookAlreadyExists = await booksRepo.findOne({ where: { ISBN } });
    if (bookAlreadyExists) {
      throw new Error("Livro com esse ISBN já está cadastrado.");
    }

    // Se quiser validar barcode único também
    const barcodeExists = await booksRepo.findOne({ where: { barcode } });
    if (barcodeExists) {
      throw new Error("Livro com esse código de barras já está cadastrado.");
    }

    // RN0013: cálculo de preço com base no grupo.  
    // OBS: aqui eu usei um 'cost' fictício; ideal é obter 'cost' do cadastro do fornecedor/produto.
    const cost = (data as any).cost ?? 0; // se não existir, é 0 — recomendo enviar cost no IBookRequest
    if (!cost || cost <= 0) {
      // opcional: permitir cost 0 e apenas salvar preço do grupo? Depende do processo
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
