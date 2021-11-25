let url = '/api/categories';
let injectedField = document.querySelector("#here");

console.log(injectedField);

function readAllCategories() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function(jsonData) {
            injectedField.innerHTML = jsonData[0].name;
            console.log(jsonData)
        });
}

readAllCategories();