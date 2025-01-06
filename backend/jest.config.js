export default {
    testEnvironment: "node", // Define o ambiente de testes como Node.js
    transform: {
      "^.+\\.js$": "babel-jest" // Transforma arquivos .js usando Babel
    },
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1" // Ajusta caminhos relativos para incluir extensão .js
    },
    verbose: true // Ativa logs detalhados para depuração
  };
  