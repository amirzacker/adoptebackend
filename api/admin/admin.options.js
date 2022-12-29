const { default: AdminBro } = require("admin-bro");
const AdminBroMongoose = require("admin-bro-mongoose");
const conversationsSchema = require("../conversations/conversations.schema");
const domainsSchema = require("../domains/domains.schema");
const messagesSchema = require("../messages/messages.schema");
const searchTypesSchema = require("../searchTypes/searchTypes.schema");
const usersModel = require("../users/users.model");


AdminBro.registerAdapter(AdminBroMongoose);

/** @type {import('admin-bro').AdminBroOptions} */
const options = {
  resources: [
   
    { resource: usersModel,
        options: {
            navigation: {
                name: 'Users',
                icon: 'User',
            },
          },
    },
    { resource: domainsSchema,
        options: {
            navigation: {
                name: 'Domain',
                icon: 'List',
            },
          },
    },
    { resource: searchTypesSchema,
        options: {
            navigation: {
                name: 'SearchType',
                icon: 'List',
            },
          },
    },
    { resource: messagesSchema,
        options: {
            navigation: {
                name: 'Message',
                icon: 'List',
            },
          },
    },
    { resource: conversationsSchema,
        options: {
            navigation: {
                name: 'Conversation',
                icon: 'List',
            },
          },
    },
  ],
  branding: {
    logo: "https://zupimages.net/up/22/52/ckbw.png",
    companyName: "Adopte1etudiant",
  },
};

module.exports = options;
