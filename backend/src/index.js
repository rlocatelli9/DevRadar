const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const routes = require("./routes");
const { setupWebSocket } = require("./webSocket");

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect(
  "mongodb+srv://omnistack:ubnt@r00t@omnistack-faku5.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
mongoose.set("useCreateIndex", true);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333, () => {
  console.log("server started!");
});
