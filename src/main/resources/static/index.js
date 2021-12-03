let url = '/api/categories';
let categoriesList = document.querySelector("#categories");
const startButton = document.querySelector('.startBtn');
startButton.setAttribute('onclick', 'startQuiz()');

(function readAllCategories() {

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function(jsonData) {
            let categories = jsonData.valueOf();
            for (const category of categories) {
                let aTag = document.createElement('a');

                aTag.setAttribute('id', category.id);
                aTag.setAttribute('checked', 'false');
                aTag.innerHTML = category.name;

                aTag.setAttribute('onclick', 'selectCategories.call(this)');

                categoriesList.appendChild(aTag);
            }
        });
})();


function selectCategories() {

    let checked = this.getAttribute('checked');
    if (checked == 'true') {
        this.setAttribute('checked', 'false');
        this.style.backgroundColor = 'rgb(43, 128, 161)';
    } else {
        this.setAttribute('checked', 'true');
        this.style.backgroundColor = 'rgb(241, 165, 0)';
    }
}


function startQuiz() {
    console.log('start')
}
