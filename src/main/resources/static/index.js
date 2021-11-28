let url = '/api/categories';
let listBox = document.querySelector("#categoriesList");


(function readAllCategories() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function(jsonData) {
            let categories = jsonData.valueOf();
            for (const category of categories) {
                let label = document.createElement('label');
                let checkbox = document.createElement('input');

                label.setAttribute('for', category.id);
                label.style.display = "block";
                checkbox.type = 'checkbox';
                checkbox.setAttribute('id', category.id);


                label.appendChild(checkbox);
                label.innerHTML += ' ' + category.name;
                listBox.appendChild(label);
            }
        });
})();

//readAllCategories();