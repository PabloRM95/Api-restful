var express = require("express");
var app = express();
var { nanoid } = require("nanoid");
let users = [
  {
    username: "Yunior",
    name: "Jose Luis",
    email: "yunior@squaads.com",
  },
];

let tweets = [
  {
    id: nanoid(),
    text: "La EOI se sale",
    owner: "Yunior",
    createdAt: new Date().getTime(),
  },
];

app.use(express.json());

app.get("/tweets", function (req, res) {
  res.json(tweets);
});
app.get("/users", function (req, res) {
  res.json(users);
});

app.get("/users/:username", function (req, res) {
  const userNameParameter = req.params.username;

  let userFound = users.find((u) => u.username == userNameParameter);

  if (userFound == undefined) {
    return res.status(404).send("No se ha encontrado al usuario");
  }

  const propietarioTweets = tweets.filter((u) => u.owner == userNameParameter); //encuentra todos los tweets de un propietario

  let usuarioConTweets = {

    ...userFound, tweets:propietarioTweets

  }

  res.json(usuarioConTweets);
});
app.get("/tweets/:id", function (req, res) {
  const tweetIdParameter = req.params.id;
  const tweetFound = tweets.find((u) => u.id == tweetIdParameter);
  if (tweetFound == undefined) {
    return res.status(404).send("No se ha encontrado el tweet");
  }
  res.json(tweetFound);
});

app.post("/users", function (req, res) {
  const newUser = req.body;

  if (users.some((element) => element.username == newUser.username)) {
    return res.status(403).send("Este usuario ya existe");
  }

  let nuevoUsuario = {
    username: newUser.userName,
    name: newUser.name,
    email: newUser.email,
  };
  users.push(nuevoUsuario);

  res.json(nuevoUsuario);
});

app.post("/tweets", function (req, res) {
  const newTweet = req.body;

  // if (tweets.some(element => element.id == newTweet.id)){ //No hace falta porque el id del tweet nos lo inventamos nosotros

  //  return res.status(403).send("Este tweet ya existe")

  //Falta comprobar que el propietario existe para que pueda hacer un nuevo tweet

  let nuevoTweet = {
    id: nanoid(),
    text: newTweet.text,
    owner: newTweet.owner,
    createdAt: new Date().getTime(),
  };
  users.push(nuevoTweet);

  res.json(nuevoTweet);
});

app.delete("/users/:username", function (req, res) {
  users = users.filter((element) => element.username != req.params.username);
  //Comprobar que el que se va a borrar existe ya
  res.status(200).send("Okey");
});

app.delete("/tweets/:id", function (req, res) {
  tweets = tweets.filter((element) => element.id != req.params.id);

  res.status(200).send("Okey");
});

app.put("/users/:username", function (req, res) {
  let recogerUserName = req.params.username;

  const newUserName = req.body;

  if (users.some((u) => u.username == recogerUserName)) {
    newUserName.username = recogerUserName;
    users.forEach((element, index) => {
      if (element.username == newUserName.username) {
        users[index] = newUserName;
      }
    });
    res.json(newUserName);
  } else {
    res.status(404).send('Este "nombre de usuario" no existe en la API');
  }
});

app.put("/tweets/:id", function (req, res) {
  let recogerId = req.params.id;

  const newTweet = req.body;
  const oldTweet = tweets.find((element) => element.id == recogerId);
  if (oldTweet != undefined) {
    newTweet.owner = oldTweet.owner;
    newTweet.id = recogerId;
    tweets.forEach((element, index) => {
      if (element.id == newTweet.id) {
        tweets[index] = newTweet;
      }
    });
    res.json(newTweet);
  } else {
    res.status(404).send('Este "tweet" no existe en la API');
  }
});

app.patch("/users/:username", function (req, res) {
  let recogerUserName = req.params.username;

  const newUserName = req.body;

  let UserNameEncontrado = users.find((u) => u.username == recogerUserName);
  if (UserNameEncontrado == undefined) {
    return res.status(404).send('Este "usuario" no existe en la API');
  }

  let cambioUno = {
    username: recogerUserName,
    name: checkBodyPatch(newUserName.name, UserNameEncontrado.name),
    email: checkBodyPatch(newUserName.email, UserNameEncontrado.email),
  };

  users.forEach((element, index) => {
    if (element.username == cambioUno.username) {
      users[index] = cambioUno;
    }
  });

  res.json(cambioUno);
});

app.patch("/tweets/:id", function (req, res) {
  let recogerId = req.params.id;
  const newTweet = req.body;

  let TweetEncontrado = tweets.find((u) => u.id == recogerId);
  if (TweetEncontrado == undefined) {
    return res.status(404).send('Este "tweet" no existe en la API');
  }

  TweetEncontrado.text = checkBodyPatch(newTweet.text, TweetEncontrado.text);

  res.json(TweetEncontrado);
});

function checkBodyPatch(newAtribute, oldAtribute) {
  if (newAtribute != undefined) {
    return newAtribute;
  } else {
    return oldAtribute;
  }
}
app.listen(4000);
