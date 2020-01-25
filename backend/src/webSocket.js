const socketio = require("socket.io");
const parserStringAsArray = require("./utils/parseStringAsArray");
const calculateDistance = require("./utils/calculateDistance");

let io;
const connections = [];

exports.setupWebSocket = server => {
  console.log("OK");
  io = socketio(server);

  io.on("connection", socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coords: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      techs: parserStringAsArray(techs)
    });
  });
};

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return (
      calculateDistance(coordinates, connection.coords) < 10 &&
      connection.techs.some(item => techs.includes(item))
    );
  });
};

exports.sendMessage = (to, type_message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(type_message, data);
  });
};
