const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.materiaPath = "/bim/control";
  
    this.conectarDB();

    this.middlewares();

    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(express.static("public"));
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.materiaPath, require("../routes/control.routes"));
    
    
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(
        `Servidor ejecutando y escuchando por el puerto ${this.port}`
      );
    });
  }
}

module.exports = Server;
