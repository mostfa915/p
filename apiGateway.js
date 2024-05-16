// apiGateway.js
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les films et les séries TV
const commandeProtoPath = 'commande.proto';
const pannierProtoPath = 'pannier.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
// Créer une nouvelle application Express
const app = express();
const commandeProtoDefinition = protoLoader.loadSync(commandeProtoPath, {
keepCase: true,
longs: String,
enums: String,
defaults: true,
oneofs: true,
});
const pannierProtoDefinition = protoLoader.loadSync(pannierProtoPath, {
keepCase: true,
longs: String,
enums: String,
defaults: true,
oneofs: true,
});
const commandeProto = grpc.loadPackageDefinition(commandeProtoDefinition).commande;
const pannierProto = grpc.loadPackageDefinition(pannierProtoDefinition).pannier;
// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });
// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
app.use(
cors(),
bodyParser.json(),
expressMiddleware(server),
);
});
app.get('/commandes', (req, res) => {
    const client = new commandeProto.commandeService('localhost:50051',
    grpc.credentials.createInsecure());
    client.searchcommandes({}, (err, response) => {
    if (err) {
    res.status(500).send(err);
    } else {
    res.json(response.commandes);
    }
    });
    });
    app.get('/commandes/:id', (req, res) => {
    const client = new commandeProto.commandeService('localhost:50051',
    grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getcommande({ commandeId: id }, (err, response) => {
    if (err) {
    res.status(500).send(err);
    } else {
    res.json(response.commande);
    }
    });
    });
    app.get('/panniers', (req, res) => {
    const client = new pannierProto.pannierService('localhost:50052',
    grpc.credentials.createInsecure());
    client.searchpanniers({}, (err, response) => {
    if (err) {
    res.status(500).send(err);
    } else {
    res.json(response.tv_shows);
    }
    });
    });
    app.get('/panniers/:id', (req, res) => {
    const client = new pannierProto.pannierService('localhost:50052',
    grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getpannier({ pannierId: id }, (err, response) => {
    if (err) {
    res.status(500).send(err);
    } else {
    res.json(response.tv_show);
    }
    });
    });
    // Démarrer l'application Express
    const port = 3000;
    app.listen(port, () => {
    console.log(`API Gateway en cours d'exécution sur le port ${port}`);
    });