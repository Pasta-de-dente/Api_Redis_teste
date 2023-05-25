const redis = require('redis');
const { promisify } = require('util');
const { client } = require('../db/redisconfig');

const itemController = {
  create: async (req, res) => {
    try {
      const item = {
        chave: req.body.chave,
        valor: req.body.valor,
        cod: req.body.cod,
      };
      const response = await client.hSet(item.chave,item.cod,item.valor, JSON.stringify(item));
      res.status(200).json({ response, msg: "Item criado com sucesso!" });
    } catch (error) {
      console.log(error);
    }
  },

  getAll: async (req, res) => {
    try {
      const hesh = req.params.hesh;
      const item = await client.hVals(hesh);
      if (!item) {
        res.status(404).json({ msg: "Item não encontrado." });
        return;
      }
      const valores = item.map(str => {
        const obj = JSON.parse(str);
        return obj; // assumindo que o valor desejado é a propriedade 'value'
      });
      res.json(valores);
    } catch (error) {
      console.log(error);
    }
  },
  get: async (req, res) => {
    try {
      const chave = req.params.chave;
      const hesh = req.params.hesh;
      const item = await client.hGet(hesh, chave);
      if (!item) {
        res.status(404).json({ msg: "Item não encontrado." });
        return;
      }
      res.json(JSON.parse(item));
    } catch (error) {
      console.log(error);
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.body.id;
      client.del(id, (err, response) => {
        if (err) return console.log(err);
        if (response == 1) {
          res.status(200).json({ response, msg: "Item excluído com sucesso!" });
        } else {
          res.status(404).json({ msg: "Item não encontrado." });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  update: async (req, res) => {
    try {
      const hash = req.params.hash;
      const chave = req.params.chave
      const chaveExiste = await client.hExists(hash, chave);

      if (!chaveExiste) {
        res.status(404).json({ msg: "Chave não encontrada." });
        return;
      }
      const item = {
        nome: req.body.nome,
        adress: req.body.adress,
        aniversario: req.body.aniversario,
        numero: req.body.numero,
      };
      const response = await client.hSet(hash,chave, JSON.stringify(item));
      res.status(200).json({ response, msg: "Item atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = itemController;
