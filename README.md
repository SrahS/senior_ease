# Senior Ease 📱💻

Um projeto estruturado em formato de **Monorepo** que contempla uma aplicação Mobile (React Native / Expo) e uma plataforma Web, compartilhando lógicas de domínio, regras de negócio e tipagens.

## 🛠 Tecnologias e Ferramentas

Este projeto utiliza o que há de mais moderno no ecossistema JavaScript/TypeScript, gerenciado de forma otimizada com **pnpm**.

* **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/) (Workspaces)
* **Mobile (App):** React Native (0.81) + Expo (SDK 54)
* **Web:** React 19 + Vite
* **Linguagem:** TypeScript
* **Armazenamento Local:** AsyncStorage

## 🏗 Arquitetura e Estrutura de Pastas

O projeto segue princípios de **Clean Architecture**, isolando as regras de negócio das camadas de UI. A pasta `shared` é responsável por manter a lógica que transita entre as plataformas Web e Mobile.

```text
senior_ease/
├── app/                  # Aplicativo Mobile (Expo / React Native)
│   ├── App.tsx           # Ponto de entrada da UI Mobile
│   ├── index.js          # Entry file customizado para o Metro Bundler
│   ├── metro.config.js   # Configuração do Metro para enxergar o monorepo
│   └── package.json
├── web/                  # Aplicação Web (Vite / React)
│   ├── src/
│   └── package.json
├── shared/               # Lógica compartilhada (Clean Architecture)
│   ├── domain/
│   │   └── useCases/     # Casos de uso (ex: LoadPreferencesUseCase, SavePreferencesUseCase)
│   ├── adapters/         # Adaptadores de infraestrutura (ex: AsyncStoragePreferencesAdapter)
│   └── preferences/      # Interfaces e entidades de domínio genéricas
├── pnpm-workspace.yaml   # Declaração dos workspaces do monorepo
└── package.json          # Raiz do projeto