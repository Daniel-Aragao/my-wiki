let constants = require('../constants');
let Datastore = require('nedb');

let db = {};
let interval = 30 * 1000; // miliseconds

db.Matters = new Datastore({filename: constants.db.DataFilePath + "matters" + constants.db.DataFileSufix, autoload: true});
db.UserConfig = new Datastore({filename: constants.db.DataFilePath + "config" + constants.db.DataFileSufix, autoload: true});

(function basicDBConfig(){
    db.Matters.persistence.setAutocompactionInterval(interval)
    db.UserConfig.persistence.setAutocompactionInterval(interval)
})();


let operations = {
    insertUserConfig = function(){
        throw "TODO";
    },
    updateUserConfig = function(){
        throw "TODO";
    },
    findUserConfig = function(){
        throw "TODO";
    },

    insertMatter = function(){
        throw "TODO";
    },
    updateMatter = function(){
        throw "TODO";
    },
    findMatter = function(){
        throw "TODO";
    }

}

module.exports = operations;