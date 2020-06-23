const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");
const { json } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function ValidateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid repository"});
  };

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", ValidateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repos = repositories.find(repository => repository.id === id);

  repos.title = title;
  repos.url = url;
  repos.techs = techs;

  return response.json(repos);

});

app.delete("/repositories/:id", ValidateRepositoryId, (request, response) => {
  const { id } = request.params;

  const result = repositories.findIndex(repository => repository.id === id);

  if(result < 0){
    return;
  }

  repositories.splice(result);

  return response.status(204).send();
});

app.post("/repositories/:id/like", ValidateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
