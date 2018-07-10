let Matter = function (key, description, keywords, subject){
    this.key = key;
    this.description = description;
    this.keywords = keywords? keywords : [];
    this.subject = subject;

    this.addKeyword = function(word){
        this.keywords.push(word);
    }

    this.getKeyWord = function(separator){
        let result = "";
        
        if(!keywords.length){
            return result;
        }

        separator = separator ? separator : ", ";

        this.keywords.forEach(keyword => {
            result += keyword;
        });

        return result;
    }
       
}

module.exports = Matter;