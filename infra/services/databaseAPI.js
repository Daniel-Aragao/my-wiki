const EventController = require('./EventController');
const eventEmitter = EventController.getEmitter();

const Matter = require('../../core/entities/matter');

const dbOperations = require('../database/database');

let config = (function(){
    
    function listen(){
        eventEmitter.on("add-matter", function(matter){
            dbOperations.insertMatter(matter, function(err, doc){
                if(!doc){
                    erroEmitter("Chave já existente: " + matter._id);
                }
            });
        });

        eventEmitter.on("check-id", function(id){
            dbOperations.existMatter(id, function(err, doc){
                eventEmitter.emit('id-checked', {id: id, bool:Boolean(doc)});
            })
        });

        eventEmitter.on('get-by-key', function(key){
            dbOperations.findMatter(key, function(err, doc){
                if(err){
                    throw err;
                }else{
                    if(doc == null){
                        doc = [];
                    }else if(!Array.isArray(doc)){
                        doc = [doc];
                    }

                    let matters = doc.map(mapMatters);
                    
                    eventEmitter.emit('search-result', matters);
                }
            });
        })

        eventEmitter.on('delete-matter', function(id){
            dbOperations.deleteMatter(id, function(){
                // throw 'Erro ao deletar';
            });
        });

        eventEmitter.on('find-by-id', function(id){

            dbOperations.findMatterById(id, function(err, doc){
                eventEmitter.emit('matter-found-by-id', doc);
            });

        });

        eventEmitter.on('edit-save-matter', function(matter){
            dbOperations.updateMatter(mapMatters(matter));
        });
    }

    return listen
})();

function mapMatters(value){
    let matter = new Matter(
        value._id,
        value.description,
        null,
        value.subject
    );
    
    if(!Array.isArray(value.keywords)){
        value.keywords = value.keywords.split(', ')
    }

    matter.addKeywords(value.keywords);

    return matter
}

function erroEmitter(err){
    eventEmitter.emit('db-error', err)
}

let operations = (function(){
    return {
        findAllMatter: dbOperations.findAllMatter
        
    }
})();

module.exports = {
    Config: config,
    operations: operations
};