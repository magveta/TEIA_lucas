# Teia Backend - Spring Boot

Este é o backend da aplicação **Teia**, desenvolvido em Spring Boot para gerenciar candidatos e sistema de login.

## Como executar o projeto

### Pré-requisitos
- **Java 17** ou superior
- **Maven** (ou use o wrapper incluído)

### 1. Executar o backend
```bash
# Opção 1: Usando Maven Wrapper (recomendado)
./mvnw spring-boot:run

# Opção 2: Usando Maven instalado
mvn spring-boot:run

# Opção 3: Windows (PowerShell)
.\mvnw.cmd spring-boot:run
```

O servidor iniciará na **porta 8080**: `http://localhost:8080`

### 2. Verificar se está funcionando
Acesse: `http://localhost:8080/candidato`
- Deve retornar uma lista vazia `[]` (inicialmente)

## Banco de Dados MongoDB

### Pré-requisitos
- **MongoDB Community Server** instalado e rodando
- **MongoDB Compass** (opcional, para interface gráfica)

### Iniciar MongoDB
```bash
# Windows - MongoDB como serviço
net start MongoDB

# Ou inicie manualmente
mongod
```

### Acessar via MongoDB Compass
1. Abra o MongoDB Compass
2. Conecte em: `mongodb://localhost:27017`
3. Banco de dados: `teia_db`
4. Collection: `candidatos`

### Visualizar dados via terminal
```bash
# Abrir shell do MongoDB
mongosh

# Usar o banco de dados
use teia_db

# Ver todos os candidatos
db.candidatos.find().pretty()

# Contar candidatos
db.candidatos.countDocuments()

# Buscar por email
db.candidatos.find({ email: "exemplo@email.com" })
```

## Endpoints da API

### Candidatos
- **GET** `/candidato` - Listar todos os candidatos
- **POST** `/candidato` - Cadastrar novo candidato
- **POST** `/candidato/login` - Fazer login

### Exemplos de uso

#### Cadastrar candidato
```bash
curl -X POST http://localhost:8080/candidato \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678901",
    "email": "joao@email.com",
    "senha": "MinhaSenh@123"
  }'
```

#### Fazer login
```bash
curl -X POST http://localhost:8080/candidato/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "MinhaSenh@123"
  }'
```

## Frontend Integration

O frontend deve fazer requisições para:
- **Cadastro**: `http://localhost:8080/candidato`
- **Login**: `http://localhost:8080/candidato/login`

**CORS** está configurado para aceitar requisições de:
- `localhost:5173` (Vite - padrão)
- `localhost:5174` (Vite - alternativa)
- `localhost:3000` (React/Next.js)
- `localhost:5000`, `localhost:5500`, `localhost:8000`
- Protocolo `file://` (arquivos locais)

### Rodando com Vite (React)
O frontend React usa Vite e roda por padrão em `http://localhost:5173`:
```bash
# Na raiz do projeto
npm run dev
```

## Estrutura do Projeto

```
src/main/java/com/teia/sitebackend/
├── controller/
│   └── CandidatoController.java    # Endpoints REST
├── model/
│   └── Candidato.java              # Entidade JPA
├── repository/
│   └── CandidatoRepository.java    # Interface de dados
├── service/
│   └── CandidatoService.java       # Lógica de negócio
├── dto/
│   ├── LoginRequest.java           # DTO para login
│   └── ApiResponse.java            # DTO para respostas
├── config/
│   └── CorsConfig.java             # Configuração CORS
└── SitebackendApplication.java     # Classe principal
```

## Configurações (application.properties)

```properties
# Porta do servidor
server.port=8080

# MongoDB
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=teia_db

# Logging
logging.level.org.springframework.data.mongodb=DEBUG
```

## Solução de Problemas

### Erro de porta em uso
Se a porta 8080 estiver ocupada:
```bash
# Verificar processos usando a porta
netstat -ano | findstr :8080

# Ou alterar a porta no application.properties
server.port=8081
```

### Erro de Java
Verificar versão do Java:
```bash
java -version
```

### CORS bloqueado
Verificar se o frontend está rodando em uma das portas configuradas no `CorsConfig.java`.

## Notas Importantes

- **MongoDB**: Dados persistem entre reinicializações do servidor
- **Índices**: Email e CPF têm índices únicos para prevenir duplicatas
- **Senhas**: Atualmente armazenadas em texto plano (implementar hash em produção)
- **Validações**: Email e CPF únicos são validados automaticamente
- **Logs**: Acompanhe o console para debug durante desenvolvimento
- **ID**: MongoDB gera IDs automaticamente (ObjectId como String)

## Para desenvolvedores

### Adicionando novos endpoints
1. Criar método no `CandidatoController.java`
2. Implementar lógica no `CandidatoService.java`
3. Adicionar consultas no `CandidatoRepository.java` se necessário

### Testando mudanças
Reinicie o servidor após alterações no código Java:
- `Ctrl+C` para parar
- `./mvnw spring-boot:run` para reiniciar