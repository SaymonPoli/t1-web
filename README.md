# t1-web

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
