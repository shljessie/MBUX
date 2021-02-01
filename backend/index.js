const express = require('express');
const app = require('express')();
const request = require('request-promise');
const http = require('http').createServer(app);
const path = require('path');
const steps = require("./database/steps");
const model = `http://${process.env.IP}:6000`
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

app.use(express.urlencoded());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname + '/../public')));
app.use('/pages', express.static(path.join(__dirname + '/../pages')));

// === BASE ===
io.on('connection', (socket) => {
  console.log('a user connected');
});

app.post("/event", (req, res) => {

  io.emit('sound', req.body);

  return res.sendStatus(200)
});

app.post("/event/animal", (req, res) => {

  io.emit('animal', req.body);

  return res.sendStatus(200)
});

app.post("/event/harmonizer", (req, res) => {

  io.emit('harmonizer', req.body);

  return res.sendStatus(200)
});

app.post("/event/secret", (req, res) => {

  if (req.body.steps && req.body.steps == "bg") {
    io.emit('secret_bg', req.body);
  } else if (req.body.steps && req.body.steps == "train") {
    io.emit('secret_train', req.body);
  } else {
    io.emit('secret', req.body);
  }

  return res.sendStatus(200)
});

app.post("/action", (req, res) => {

  console.log(req.body)

  if (req.body.action == "Dog_bark") {
    io.emit('action', { page: "/pages/alwayson/dogBark/dogBark.html" })
  }
  else if (req.body.action == "Baby_cry") {
    io.emit('action', { page: "/pages/alwayson/babyCry/babyCry.html" })
  }
  else if (req.body.action == "Cough") {
    io.emit('action', { page: "/pages/alwayson/cough/cough.html" })
  }
  else if (req.body.action == "Sigh") {
    io.emit('action', { page: "/pages/alwayson/sigh/sigh.html" })
  }
  else if (req.body.action == "Sneeze") {
    io.emit('action', { page: "/pages/alwayson/sneeze/sneeze.html" })
  }
  else if (req.body.action == "Finger_snap") {
    io.emit('action', { page: "/pages/alwayson/fingerSnap/snap.html" })
  }
  else if (req.body.action == "Laughter") {
    io.emit('action', { page: "/pages/alwayson/laugh/laugh.html" })
  }
  else if (req.body.action == "Yawn") {
    io.emit('action', { page: "/pages/alwayson/yawn/yawn.html" })
  }
  else if (req.body.action == "Emergency_vehicle_siren") {
    io.emit('action', { page: "/pages/alwayson/emergency/emergency.html" })
  }
  else if (req.body.action == "Double_clap") {
    io.emit('action', { page: "/pages/alwayson/handClap/clap.html" })
  }
  else if (req.body.action == "whistle") {
    io.emit('action', { page: "/pages/whistle.html" })
  }
  else if (req.body.action == "whistleHL") {
    io.emit('action_whistle', { page: "/pages/HLwhistle.html" })
  }
  else if (req.body.action == "whistleLH") {
    io.emit('action_whistle', { page: "/pages/LHwhistle.html" })
  }
  else if (req.body.action == "whistleNC") {
    io.emit('action_whistle', { page: "/pages/NCwhistle.html" })
  }
  else if (req.body.action == "Secret") {
    io.emit('action', { page: "/pages/secretLang/secretTrain.html" })
  }
  return res.sendStatus(200)
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/response', (req, res) => {
  res.sendFile(path.join(__dirname + '/response.html'));
});

// === Steps ===

app.post("/step/:tag", async (req, res) => {

  if (req.params.tag === "animalDetect") {
    return res.status(200).json((await steps.increment(req.params.tag)))
  }

})

// === Modes ===
app.post('/alwaysOn/activate', async (req, res) => {
  try {

    await request({
      method: "POST",
      uri: model + "/modeOn",
      body: {
        modeName: "alwaysOn"
      },
      json: true
    })
  } catch (e) {
    console.log("No SDK detected")
  }

  console.log("alwaysOn activated")

  res.sendStatus(200)
})


app.post('/harmonizer/activate', async (req, res) => {

  try {
    await request({
      method: "POST",
      uri: model + "/modeOn",
      body: {
        modeName: "harmonizer"
      },
      json: true
    })

  } catch (e) {
    console.log("No SDK detected")
  }

  console.log("harmonizer activated")

  res.sendStatus(200)
})

app.post('/animalDetect/activate', async (req, res) => {
  try {

    await request({
      method: "POST",
      uri: model + "/modeOn",
      body: {
        modeName: "animalDetect"
      },
      json: true
    })
  } catch (e) {
    console.log("No SDK detected")
  }

  console.log("animalDetect activated")

  res.sendStatus(200)
})

app.post('/animalBook/activate', async (req, res) => {
  try {

    await request({
      method: "POST",
      uri: model + "/modeOn",
      body: {
        modeName: "animalBook"
      },
      json: true
    })
  } catch (e) {
    console.log("No SDK detected")
  }

  console.log("animalBook activated")

  res.sendStatus(200)
})

app.post('/secret/activate', async (req, res) => {
  try {

    await request({
      method: "POST",
      uri: model + "/modeOn",
      body: {
        modeName: "secret"
      },
      json: true
    })
  } catch (e) {
    console.log("No SDK detected")
  }

  console.log("secret activated")

  res.sendStatus(200)
})

app.post('/secretReady', async (req, res) => {
  try {

    await request({
      method: "POST",
      uri: model + "/secretReady",
      body: {},
      json: true
    })
  } catch (e) {
    console.log("No SDK detected")
  }

  console.log("secret activated")

  res.sendStatus(200)
})

app.post('/disable', async (req, res) => {

  console.log("Process disabled")
  try {

    await request({
      method: "DELETE",
      uri: model + "/modeOff",
      body: {},
      json: true
    })
  } catch (e) {
    console.log("No SDK detected")
  }

  res.sendStatus(200)
})

// === Feature ===
// app.get('/feature/whistle', async (req, res) => {
// return res.json((await settings.get(1)))
// });

http.listen(3000, () => {
  console.log('Socket app listening at 3000');
});

app.listen(5000, () => {
  console.log(`Rest app listening at 5000`)
});
