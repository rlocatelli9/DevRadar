const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../webSocket");

module.exports = {
  //funcoes: index, show, store, update, destroy
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let developer = await Dev.findOne({ github_username });

    if (!developer) {
      const apiResponse = await axios
        .get(`https://api.github.com/users/${github_username}`)
        .catch(err => {
          console.log("ERRO:", err);
        });

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      developer = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      //filtra conexao que estao no raio de 10km
      //e novo dev criado tenha  pelo menos 1 tech filtrada

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "new-dev", developer);
    }

    return response.json(developer);
  },

  async update(request, response) {},

  /**
   * Route params: id
   * Deleta o dev associado ao id presente nos parâmetros da rota.
   */
  async delete(request, response) {
    const { id } = request.params;

    await Dev.findByIdAndDelete(id);

    return response.sendStatus(200);
  }
};
