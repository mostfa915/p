// resolvers.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les films et les séries TV
const commandeProtoPath = 'commande.proto';
const pannierProtoPath = 'pannier.proto';
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
// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
Query: {
commande: (_, { id }) => {
// Effectuer un appel gRPC au microservice de films
const client = new commandeProto.commandeService('localhost:50051',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.getcommande({ commandeId: id }, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.commande);
}
});
});
},
commandes: () => {
// Effectuer un appel gRPC au microservice de films
const client = new commandeProto.commandeService('localhost:50051',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.searchcommandes({}, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.commandes);
}
});
});
},



pannier: (_, { id }) => {
// Effectuer un appel gRPC au microservice de séries TV
const client = new pannierProto.pannierService('localhost:50052',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.getpannier({ pannierId: id }, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.tv_show);
}
});
});
},
panniers: () => {
// Effectuer un appel gRPC au microservice de séries TV
const client = new pannierProto.pannierService('localhost:50052',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.searchpanniers({}, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.tv_shows);
}
});
});
},
},
};
module.exports = resolvers;