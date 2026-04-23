# t1-web

## Como Executar

### 1. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo para as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais, se necessário.

### 2. Subir o Banco de Dados (Docker)
Certifique-se de ter o Docker instalado e execute:
```bash
docker-compose up -d
```

### 3. Instalar Dependências e Rodar a Aplicação
Instale as dependências do Node.js:
```bash
npm install
```
Inicie o servidor:
```bash
npm start
```

# Folder structure

. 
├── public/                 # Arquivos estáticos da aplicação web 
│   ├── index.html          # Dashboard principal
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js          # Lógica do frontend (requisições fetch para a API)
├── simulators/             # Scripts Node.js para os sensores 
│   └── sensor.js           # Executar via terminal: node sensor.js <DeviceID> <DevicePWD>
├── src/
│   ├── config/             # Database connection setup
│   │   └── db.js
│   ├── controllers/        # Regras de negócio das rotas da API
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   └── sensorController.js
│   ├── middlewares/        # Middlewares do Express 
│   │   └── tokenAuth.js    # Intercepta e valida os JWTs 
│   ├── models/             # Esquemas/classes do banco de dados
│   │   ├── Client.js       
│   │   └── Sensor.js       
│   └── routes/             # Definições dos endpoints da API REST 
│       ├── authRoutes.js
│       └── apiRoutes.js
├── .env                    # Variáveis de ambiente (porta, db, jwt secret)
├── package.json
└── server.js               # Ponto de entrada principal da aplicação
