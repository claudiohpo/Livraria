interface IBookImageRequest {
    id?: number; // ID da imagem (opcional para criação)
    url: string; // URL da imagem (pode ser externa ou caminho no servidor)
    caption?: string; // legenda/descrição da imagem (opcional)
    bookId: number; // ID do livro ao qual a imagem pertence
}

export { IBookImageRequest };