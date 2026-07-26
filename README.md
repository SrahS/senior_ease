# SeniorEase 🚀

**SeniorEase** é uma plataforma acessível e inclusiva, desenvolvida em um monorepo, que visa simplificar a rotina diária de idosos e usuários que buscam clareza, alta usabilidade e adaptação ergonômica em suas interfaces. O projeto conta com arquitetura limpa (*Clean Architecture*), suporte completo a preferências de acessibilidade persistidas e paridade multiplataforma entre **Web (React/Vite)** e **Mobile (React Native/Expo)**.

---

## 🛠️ Tecnologias e Arquitetura

O projeto é estruturado como um monorepo gerenciado por **pnpm**, dividindo lógicas de domínio compartilhadas entre as plataformas:
* **Frontend Web:** React 18, TypeScript, Vite, Lucide Icons, CSS Customizável.
* **Mobile:** React Native, Expo, React Native AsyncStorage, Expo Vector Icons.
* **Core / Lógica:** TypeScript puro, implementando Domain-Driven Design (Clean Architecture com Use Cases e Adapters isolados).
* **Testes:** Vitest e Testing Library para validação de fluxos e componentes.

---

## ⚙️ Funcionalidades de Acessibilidade

* **Modo Simplificado:** Oculta elementos complexos e foca apenas nas ações essenciais.
* **Alto Contraste:** Alterna a interface para traços grossos, fundo de alto contraste e fontes em negrito estrito.
* **Feedback Visual Reforçado:** Adiciona bordas marcantes e selos visuais explícitos (ex: `LIGADO` / `DESLIGADO`) em botões e chaves de ativação.
* **Modo Acolhedor:** Cores pastéis e paletas suaves para reduzir o cansaço visual.
* **Espaçamento Ajustável:** Alternância dinâmica entre densidades padrão e ampla (botões e áreas de toque ampliadas).
* **Confirmações de Segurança:** Barreiras anti-erro para ações críticas (como conclusão de tarefas importantes).

---

# Estrutura Detalhada do SeniorEase

Abaixo está o detalhamento completo de cada pasta e módulo que compõe a arquitetura do monorepo, separando o núcleo compartilhado, a versão Web e a versão Mobile.

---

```text
senior_ease/
├── shared/                  # Domínio e Regras de Negócio Agnósticas (Clean Architecture)
│   ├── adapters/            # Adaptadores de armazenamento (AsyncStorage para Mobile, LocalStorage para Web)
│   ├── domain/              # Entidades, Value Objects e Casos de Uso (Use Cases) globais
│   └── preferences.ts       # Tipos, chaves de armazenamento e configurações padrão de acessibilidade
│
├── web/                     # Aplicação Frontend Web (React + Vite)
│   ├── src/
│   │   ├── contexts/        # Gerenciamento de estado global (PreferencesContext)
│   │   ├── hooks/           # Hooks personalizados para tarefas e histórico (useTasks, useHistory)
│   │   ├── screens/         # Telas principais (Dashboard, Tasks, Profile, Settings, Help, etc.)
│   │   ├── App.tsx          # Componente raiz, roteamento de abas e layout principal (Shell)
│   │   ├── main.tsx         # Ponto de entrada da aplicação React DOM
│   │   └── index.css        # Estilos globais, temas de acessibilidade (Alto Contraste, Warm Mode) e Switches
│   ├── package.json         # Dependências específicas da Web (lucide-react, react, vite)
│   └── vite.config.ts       # Configurações do empacotador Vite
│
├── mobile/                  # Aplicação Mobile (React Native + Expo)
│   ├── src/
│   │   ├── contexts/        # Gerenciamento de estado global integrado ao AsyncStorage
│   │   ├── hooks/           # Hooks nativos (useTasks, usePreferences, useOnboarding)
│   │   ├── screens/         # Telas adaptadas para toque e navegação mobile
│   │   └── App.tsx          # Componente raiz da aplicação React Native
│   ├── app.json             # Configurações do Expo e metadados do aplicativo nativo
│   └── package.json         # Dependências específicas do Mobile (@expo/vector-icons, react-native)
│
└── package.json             # Workspace raiz e scripts globais do pnpm para gerenciamento do monorepo

```

---

## Como Rodar o Projeto

Certifique-se de ter o **Node.js** e o **pnpm** instalados na sua máquina.

### 1. Instalação das Dependências

Na raiz do projeto, instale todas as dependências do monorepo:

```bash
pnpm install

```

## 2. Rodando a Aplicação Web

Para iniciar o ambiente de desenvolvimento web:

```bash
pnpm --filter seniorease-web dev

```

*(Acesse pelo link gerado no terminal, geralmente http://localhost:3000)*

## 3. Rodando a Aplicação Mobile

Para iniciar o Expo (React Native):

```bash
pnpm --filter seniorease-mobile start -c

```

*(Escaneie o QR Code com o aplicativo Expo Go no seu celular ou abra em um emulador)*

## 🧪 Executando os Testes

Para rodar a suíte de testes automatizados e validar a integridade dos componentes e fluxos:

```bash
pnpm test

```

