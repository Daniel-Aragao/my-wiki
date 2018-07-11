const electron = require('electron');
const {ipcRenderer} = electron;

let forms = {};
let menu = {};
let editMode = false;

let startMenu = (function(){

    menu.search = document.getElementById("search-menu")
    menu.add = document.getElementById("add-menu")
    menu.edit = document.getElementById("edit-menu")
    menu.close = document.getElementById("close-menu")
    
    function menuControl(){
        if(!this.classList.contains('disabled')){
            let activeMenu = document.querySelector(".pointing.menu>.item.active");
            let clickedMenu = this;
            
            let activate = clickedMenu.attributes.getNamedItem("data-target").value
            activate = document.getElementById(activate);
            
            let active = activeMenu.attributes.getNamedItem("data-target").value;
            active = document.getElementById(active);
            
            active.hidden = true;
            activate.hidden = false;
            
            activeMenu.classList.remove('active')
            clickedMenu.classList.add('active')
        }
    }
    
    menu.search.onclick = menuControl;
    menu.add.onclick = menuControl;
    menu.edit.onclick = menuControl;
    
    menu.add.click()
    menu.search.click();
    
    menu.close.onclick = function(){
        ipcRenderer.send('close');
    }
});

function createTD(tr, text){
    let td = document.createElement('td');
    td.innerText = text;
    tr.appendChild(td);

    return td;
}

let startKeywordList = (function(){
    let keywordsList = document.getElementById("keywords-list");
    let addInput = document.getElementById('add-input');
    keywordsList.innerHTML = "";

    let removeInputFromList = (function(){
        function remove(){
            this.parentElement.parentElement.remove();
        }

        return remove;
    })();

    let addInputOnList = (function(){
        let count = 0;

        function add(){
            let listElement = keywordsList;
            count++;
            
            let item = document.createElement('div');
            item.classList.add('item');

            let div = document.createElement('div');
            div.classList.add('ui','action','input');
        
            let input = document.createElement('input');
            input.name = "keywords-" + count;

            let button = document.createElement('button');
            button.classList.add('ui','icon','button');
            button.onclick = removeInputFromList;

            let i = document.createElement('i');
            i.classList.add('minus','icon');
            
            button.appendChild(i)
            div.appendChild(input);
            div.appendChild(button);
            item.appendChild(div)
            listElement.appendChild(item);

            return input
        }
    
        return add;
    })();

    addInput.onclick = function(){
        addInputOnList();
    };

    return addInputOnList;
});

let resetForms = (function(forms){
    startKeywordList();    
    
    forms.create.reset();
    forms.find.reset();
});

function configKey(){
    let newKey = document.getElementById('key');
    
    newKey.onblur = function(){
        ipcRenderer.send('key-changed', this.value);
    }

    ipcRenderer.on('key-repeated', function(e, result){
        newKey.parentElement.classList.toggle('error', result.bool);

        if(result.bool){
            toastr['error']("Chave \""+result.id+"\" já existente");
        }
    });
}

let searchInputContainer = document.getElementById("search-input-container");

let startForm = (function(){
    startKeywordList();
    
    forms.create = document.getElementById("new-matter-form");
    forms.find = document.getElementById("find-matter-form");

    configKey();
    
    forms.create.onsubmit = function(e){
        e.preventDefault();
        
        let data = new FormData(this);

        let matter = {keywords: []}

        for(let entry of data.entries()){
            let key = entry[0];
            let value = entry[1];

            if(key.startsWith('keywords-')){
                matter.keywords.push(value);
            }else{
                matter[key] = value;
            }
        }

        if(editMode){
            saveEdition(matter);
        }else{
            ipcRenderer.send('add-matter', matter)
            resetForms(forms)
        }

    }
    
    forms.find.onsubmit = function(e){
        e.preventDefault();
        
        executeSearch();
    }
});

function executeSearch(){
    searchInputContainer.classList.toggle("loading");
    
    let filter = document.getElementById('search-filter'); 
    
    ipcRenderer.send('filter', filter.value)
}

function saveEdition(matter){
    deactivateEdition();

    matter._id = document.getElementById('key').value;
    ipcRenderer.send('edit-save-matter', matter)

    executeSearch();
}

function passObjectToEdition(matter){
    let key = document.getElementById('key');
    let description = document.getElementById('description');
    let subject = document.getElementById('subject');

    key.value = matter._id;
    description.value = matter.description;
    subject.value = matter.subject;
    
    let keywords = matter.keywords.split(', ');
    
    addInputOnList = startKeywordList();

    keywords.forEach(keyword => {
        let input = addInputOnList();
        input.value = keyword;
    });
}

function deactivateEdition(){
    editMode = false;

    let oldKey = document.getElementById('key');
    let cancelBtn = document.getElementById('cancel-edition');

    cancelBtn.classList.add('hidden');
    oldKey.disabled = false;
    menu.edit.classList.add('disabled')
    menu.search.classList.remove('disabled')
    menu.add.classList.remove('disabled')
    menu.search.click();
}

function activateEdition(){
    let btn = this;
    editMode = true;

    let id = btn.getAttribute("data-id");
    
    menu.edit.classList.remove('disabled')
    menu.edit.click();
    menu.search.classList.add('disabled')
    menu.add.classList.add('disabled')
    
    let oldKey = document.getElementById('key');
    oldKey.disabled = true;
    
    ipcRenderer.send('find-by-id', id);
    
    ipcRenderer.on('matter-found-by-id', function(e, matter){
        passObjectToEdition(matter);
    });

    let cancelBtn = document.getElementById('cancel-edition');
    cancelBtn.classList.remove('hidden');

    cancelBtn.onclick = deactivateEdition;
}

function deleteMatter(e){
    let btn = this;
    let id = btn.getAttribute("data-id");

    let bool = confirm("Tem certeza que deseja deletar?");

    if(bool){
        ipcRenderer.send('delete-matter', id);

        btn.parentElement.parentElement.remove();
    }
}

function createOptionTD(tr, id){
    let td = createTD(tr, "");

    let buttonBan = document.createElement('button');
    buttonBan.classList.add('ui','icon', 'red','button');
    buttonBan.setAttribute('data-id', id);
    
    let iBan = document.createElement('i');
    iBan.classList.add('ban','icon');

    let buttonEdit = document.createElement('button');
    buttonEdit.classList.add('ui','icon', 'yellow','button');
    buttonEdit.setAttribute('data-id', id);
    
    let iEdit = document.createElement('i');
    iEdit.classList.add('pencil', 'alternate','icon');

    buttonEdit.appendChild(iEdit);
    buttonBan.appendChild(iBan);
    td.appendChild(buttonEdit);
    td.appendChild(buttonBan);

    buttonEdit.onclick = activateEdition;
    buttonBan.onclick = deleteMatter;
}


let loadResult = (function(){
    let tbody = document.getElementById('keys-founded');
    
    return function(resultArray){
        tbody.innerHTML = "";

        resultArray.forEach(matter => {
            let tr = document.createElement('tr');

            createTD(tr, matter._id);
            createTD(tr, matter.description);
            createTD(tr, matter.keywords);
            createTD(tr, matter.subject);
            createOptionTD(tr, matter._id);

            tbody.appendChild(tr)
        });
    }
})();

function listen(){

    ipcRenderer.on('db-error', function(e, err){
        toastr['error'](err)
    });

    ipcRenderer.on('search-result', function(e, result){
        loadResult(result)
        searchInputContainer.classList.toggle("loading");
    })
}
window.onload = function(){
    startMenu();
    startForm();

    listen();
}