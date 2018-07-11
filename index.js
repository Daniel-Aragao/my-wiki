const dbapi = require('./infra/services/databaseAPI');
dbapi.Config();

const controller = require('./view/controller');
controller.Config(dbapi.operations);