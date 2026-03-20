# Teia - Plataforma de Conexão entre Estudantes de Tecnologia e Oportunidades Profissionais

## Sobre o Projeto

Teia é uma plataforma digital projetada para ajudar estudantes de tecnologia a se prepararem e se profissionalizarem para o mercado de trabalho. Ela conecta currículos a oportunidades de emprego e recomenda cursos externos para que o estudante desenvolva as habilidades necessárias para se destacar.

### Principais Funcionalidades

- Cadastro e autenticação de candidatos
- Upload e gerenciamento de currículos
- Exibição de vagas compatíveis com o perfil do usuário
- Identificação de lacunas no currículo do usuário
- Sugestão de cursos para evolução profissional
- Recomendação personalizada de oportunidades

## Arquitetura do Projeto

Este projeto é dividido em duas partes principais:

### Frontend
- **Tecnologia**: React com Vite
- **Localização**: Raiz do repositório
- **Porta padrão**: 5173

### Backend
- **Tecnologia**: Spring Boot com MongoDB
- **Localização**: `/sitebackend`
- **Porta padrão**: 8080
- **Documentação detalhada**: [Backend README](./sitebackend/README.md)

## Tecnologias Utilizadas

### Frontend
<div align="center">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo" />
<img width="12" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo" />
<img width="12" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="40" alt="html5 logo" />
<img width="12" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="css3 logo" />
</div>

### Backend
<div align="center">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" height="40" alt="java logo" />
<img width="12" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" height="40" alt="spring logo" />
<img width="12" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="40" alt="mongodb logo" />
</div>

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Frontend
- Node.js (versão 16 ou superior)
- npm ou yarn

### Backend
- Java 17 ou superior
- Maven (ou use o wrapper incluído)
- MongoDB Community Server

## Como Executar o Projeto

### 1. Configurar e Executar o Backend

Navegue até o diretório do backend:
```bash
cd sitebackend
```

Execute o servidor Spring Boot:
```bash
# Usando Maven Wrapper (recomendado)
./mvnw spring-boot:run

# Ou usando Maven instalado
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

Para instruções detalhadas sobre configuração do MongoDB e endpoints da API, consulte o [README do Backend](./sitebackend/README.md).

### 2. Configurar e Executar o Frontend

Na raiz do projeto, instale as dependências:
```bash
npm install
```

Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### 3. Iniciar o MongoDB

Certifique-se de que o MongoDB está rodando:
```bash
# Windows - MongoDB como serviço
net start MongoDB

# Ou inicie manualmente
mongod
```

## Scripts Disponíveis

### Frontend
```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run lint     # Executa linter
npm run preview  # Visualiza build de produção
```

### Backend
Consulte o [README do Backend](./sitebackend/README.md) para comandos específicos.

## Estrutura do Projeto

```
TEIA_lucas/
├── src/                    # Código fonte do frontend React
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── contexts/           # Contextos React
│   ├── services/           # Serviços de API
│   └── assets/             # Recursos estáticos
├── sitebackend/            # Backend Spring Boot
│   ├── src/                # Código fonte do backend
│   └── README.md           # Documentação do backend
├── public/                 # Arquivos públicos
├── index.html              # HTML principal
├── package.json            # Dependências do frontend
└── vite.config.js          # Configuração do Vite
```

## Objetivos de Desenvolvimento Sustentável (ODS)

O projeto Teia contribui para os seguintes Objetivos de Desenvolvimento Sustentável da ONU:

- **ODS 4 - Educação de Qualidade**: Promove o acesso a educação técnica e desenvolvimento de habilidades profissionais
- **ODS 8 - Trabalho Decente e Crescimento Econômico**: Facilita a conexão entre candidatos e oportunidades de emprego digno
- **ODS 9 - Indústria, Inovação e Infraestrutura**: Utiliza tecnologia para inovar no processo de recrutamento e capacitação
- **ODS 10 - Redução das Desigualdades**: Democratiza o acesso a oportunidades profissionais na área de tecnologia

## Equipe de Desenvolvimento

- Ana Luiza
- Bruna Lopez
- Cleverson Amorim
- José Luiz
- Lucas Willians
- Thais Ferreira

## Contribuindo

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto foi desenvolvido como trabalho acadêmico.

## Suporte

Para dúvidas ou problemas, consulte a documentação específica de cada componente:
- [Backend README](./sitebackend/README.md) - Documentação completa do backend, incluindo API endpoints e configurações
