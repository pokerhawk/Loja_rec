const express = require("express"); // remove cors and pg-promise
var cors = require("cors");
const app = express();
const port = 3000;
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "hubs",
    database: "loja",
  },
});
app.use(cors());
app.use(express.json());
////////////////////////////////////// SERVER

app.get("/usuarios", (req, res) => {
  knex
    .select("*")
    .from("users")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/produtos", (req, res) => {
  knex
    .select("*")
    .from("produtos")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/pedidos", (req, res) => {
  knex
    .select("*")
    .from("pedidos")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/carrinho", async (req, res) => {
  const { produto, quantidade_prod } = req.body;
  knex("produtos")
    .where("produto", produto)
    .update({
      quantidade: quantidade_prod,
    })
    .then(res.json("Quantidade Atualizada"))
    .catch((err) => {
      res.json(`ERROR: ${err}`);
    });
});

app.put("/atualizaDivida", async (req, res)=>{
  const {cost, nome} = req.body;
  knex("users")
  .where("nome", nome)
  .update({
    divida: cost
  })
  .then(res.json("Divida Atualizado"))
  .catch((err) => {
    res.json(`ERROR: ${err}`);
  });
})

app.post("/cadastro", async (req, res) => {
  const { nome, senha } = req.body;
  if (!nome || !senha) {
    return res.status(400).json("Dados incorretos!");
  }
  knex
    .transaction((trx) => {
      trx
        .insert({
          nome: nome,
          senha: senha,
          divida: 0,
        })
        .into("users")
        .then(res.json("Cadastrado com sucesso!"))
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/pedido", async (req, res)=>{
  const nome = req.body.nome;
  const codigo = req.body.codigo;
  const data = req.body.data;
  if(!nome||!codigo||!data){
    return res.status(400).json("Dados incorretos!");
  }
  knex.transaction((trx)=>{
    trx.insert({
      nome:nome,
      codigo:codigo,
      data:data
    })
    .into("pedidos")
    .then(res.json("Pedido Efetuado"))
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch((err)=>{console.log(err)});
});

// app.delete('/deletarUsuario', (req, res)=>{ // CHECK
//   knex('users').dropColumn().where('nome', 'joao');
//   knex('users').where('nome', 'joao').del()
//   .then(res=>{console.log(res)})
//   .catch(err=>{console.log(err)})
// })

////////////////////////////////////// CONSOLE LOG DISPLAYS
knex
  .select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });

knex
  .select("*")
  .from("users")
  .where({
    nome: "eliabe",
  })
  .then((data) => {
    console.log(data);
  });
///////////////////////////////////////

app.listen(port, () => {
  console.log(`Server running at https:localhost:${port}`);
});
