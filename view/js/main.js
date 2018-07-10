let startMenu = (function(){
    let menu = {};

    menu.search = document.getElementById("search-menu")
    menu.add = document.getElementById("add-menu")
    menu.close = document.getElementById("close-menu")
    
    function menuControl(){
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
    
    menu.search.onclick = menuControl
    menu.add.onclick = menuControl;
    
    menu.add.click()
    menu.search.click();
    
    menu.close.onclick = function(){
        
    }
});

function createTD(tr, text){
    let td = document.createElement('td');
    td.innerText(text);
    tr.appendChild(td);
}

function createTableLine(lines){
    lines.forEach(Matter => {
        let tr = document.createElement('tr');
        
        createTD(Matter.key);
        createTD(Matter.description);
        createTD(Matter.getKeyWord());
        createTD(Matter.subject);
        
    });
}

let startInputList = (function(){
    let keywordsList = document.getElementById("keywords-list");
    keywordsList.innerHTML = "";

    let addInputOnList = (function(){
        let count = 0;

        function add(listElement){
            count++;
        
            let div = document.createElement('div');
            div.classList.toggle('field');
        
            let input = document.createElement('input');
            input.name = "keywords-" + count;

            input.
            
            div.appendChild(input);
            listElement.appendChild(div);
        }
    
        return add;
    })();

    addInputOnList();

})();


let startForm = (function(){
    startInputList();

    let forms = {};
    
    forms.create = document.getElementById("new-matter-form")
    forms.find = document.getElementById("find-matter-form")
    
    let searchInputContainer = document.getElementById("search-input-container");
    let table = document.getElementById("result-table");
    
    forms.create.onsubmit = function(){
        e.preventDefault();
        
    }
    
    forms.find.onsubmit = function(e){
        e.preventDefault();
        
        searchInputContainer.classList.toggle("loading");
    }
});

window.onload = function(){
    startMenu();
    startForm();

    
    
}