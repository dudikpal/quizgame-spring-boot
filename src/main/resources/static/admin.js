let url = '/api/categories';
let listBox = document.querySelector("#adminCategoriesList");


(function readAllCategories() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function(jsonData) {
            let categories = jsonData.valueOf();
            for (const category of categories) {
                let label = document.createElement('label');
                let radio = document.createElement('input');

                label.setAttribute('for', category.id);
                label.style.display = "block";
                radio.type = 'radio';
                radio.setAttribute('id', category.id);
                radio.setAttribute('name', 'groupCategories');


                label.appendChild(radio);
                label.innerHTML += ' ' + category.name;
                listBox.appendChild(label);
            }
        });
})();