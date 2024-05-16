const { gql } = require('@apollo/server');
// Définir le schéma GraphQL
const typeDefs = `#graphql
type commande {
id: String!
title: String!
description: String!
}
type pannier {
id: String!
title: String!
description: String!
}
type Query {
commande(id: String!): commande
commandes: [commande]
pannier(id: String!): pannier
panniers: [pannier]
}
`;
module.exports = typeDefs