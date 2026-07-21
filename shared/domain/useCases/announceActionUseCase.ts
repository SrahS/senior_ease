export class AnnounceActionUseCase {
  execute(action: string) {
    return `${action} concluído com sucesso.`;
  }
}
