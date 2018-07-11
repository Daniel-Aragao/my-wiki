let Matter = function (key, description, keywords, subject){
    this._id = key;
    this.description = description;
    this.keywords = keywords? keywords : [];
    this.subject = subject;

    this.addKeyword = function(word){
        this.keywords.push(word);
    }

    this.addKeywords = function(list){
        let self = this;
        list.forEach(function(item){
            self.addKeyword(item);
        });
    }

    this.getKeyWords = function(separator){
        let result = "";
        
        if(keywords && !keywords.length){
            return result;
        }

        separator =  separator? separator :", ";

        this.keywords.forEach((keyword, index) => {
            result += keyword ;
            if(this.keywords.length - 1 != index){
                result += separator
            }
        });

        return result;
    }
       
}

module.exports = Matter;