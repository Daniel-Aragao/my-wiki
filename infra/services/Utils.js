Number.prototype.getRandomInt = function(max) {
    let min = this;
    
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
}

Number.prototype.getRandomArbitrary = function (max) {
    let min = this;
    return Math.random() * (max - min) + min;
  }

Array.prototype.subtract = function(array_b, cb){
    let array_a = this;
    let array_c = [];

    if (cb == null){
        cb = function(a,b){
            return a == b;
        }
    }

    array_a.forEach(item => {
        if(item == undefined){
            throw new Error("item undefined on array subtraction")
        }

        let isIn = false;
        
        for(let i = 0; i < array_b.length;i++){
            if(cb(item,array_b[i])){
                isIn = true;
                break;
            }
        }

        if(!isIn){
            array_c.push(item);
        }
    });

    return array_c
}

Array.prototype.shuffle = function(){
    var result = [];
    var runned_indexes = [-1];
    
    for(let i = 0; i < this.length; i++){
        let includIn = -1;
        
        while(runned_indexes.findIndex(e => e == includIn) > -1){
            includIn = (0).getRandomInt(this.length);
        }

        runned_indexes.push(includIn);

        result[includIn] = this[i];
    }
    return result;
}

Array.prototype.toString = function(){
    let result = ""

    this.forEach(function(e){
        result += ", " + e.toString();
    });
    result = result.replace(', ', '');
    return result;
}

Array.prototype.padd = function(n){
    for(let i=0;i<n;i++){
        this.push(null);
    }
}