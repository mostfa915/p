// commandeMicroservice.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger le fichier commande.proto
const commandeProtoPath = 'commande.proto';
const commandeProtoDefinition = protoLoader.loadSync(commandeProtoPath, {
keepCase: true,
longs: String,
enums: String,
defaults: true,
oneofs: true,
});
const commandeProto = grpc.loadPackageDefinition(commandeProtoDefinition).commande;
// Implémenter le service commande
const commandeService = {
getcommande: (call, callback) => {
// Récupérer les détails du film à partir de la base de données
const commande = {
id: call.request.commande_id,
title: 'Exemple de film',
description: 'Ceci est un exemple de film.',
// Ajouter d'autres champs de données pour le film au besoin
};
callback(null, { commande });
},
searchcommandes: (call, callback) => {
const { query } = call.request;
// Effectuer une recherche de films en fonction de la requête
const commandes = [
{
id: '1',
title: ' commande 1',
description: 'commande alimentaire',
},
{
id: '2',
title: 'commande 2',
description: 'commande biologique',
},

];
callback(null, { commandes });
},

};
// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(commandeProto.commandeService.service, commandeService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
(err, port) => {
if (err) {
console.error('Échec de la liaison du serveur:', err);
return;
}
console.log(`Le serveur s'exécute sur le port ${port}`);
server.start();
});
console.log(`Microservice de films en cours d'exécution sur le port ${port}`);