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

let defaultErrorBehavior = function(err, doc){
    if(!doc){
        console.err(err);
        throw err;
    }
}

let operations = {
    insertUserConfig: function(){
        throw "TODO";
    },
    updateUserConfig: function(){
        throw "TODO";
    },
    findUserConfig: function(){
        throw "TODO";
    },

    insertMatter: function(matter, errcb){
        db.Matters.insert(matter, errcb? errcb : defaultErrorBehavior);
    },
    updateMatter: function(matter){
        db.Matters.update({_id: matter._id}, {$set: {description: matter.description, keywords: matter.keywords, subject: matter.subject}}, defaultErrorBehavior);
    },
    existMatter: function(id, cb){
        db.Matters.findOne({_id:id}, cb);
    },
    findMatter: function(key, cb){
        let keyRegex = new RegExp(key);

        db.Matters.find({$or: [{_id: keyRegex}, {description: keyRegex}, {subject: keyRegex}]}, cb? cb : defaultErrorBehavior)
    },
    findMatterById: function(id, cb){
        let keyRegex = new RegExp(id);

        db.Matters.findOne({_id: keyRegex}, cb? cb : defaultErrorBehavior)
    },
    deleteMatter: function(id, cb){
        db.Matters.remove({_id: id}, cb? cb : defaultErrorBehavior);
    }

}

module.exports = operations;