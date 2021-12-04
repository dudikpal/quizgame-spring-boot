//import {createGamePage} from './game';
//const gamePage = require('game');

let url = '/api/categories';
let categoriesList = document.querySelector("#categories");
const startButton = document.querySelector('.startBtn');
startButton.setAttribute('onclick', 'startQuiz()');

(function readAllCategories() {

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
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


async function startQuiz() {

    let categoriesTagA = Array.from(
        document.querySelector('#categories')
            .getElementsByTagName('a')
    );

    const selectedCategoriesId = (function () {
        let ids = [];
        for (let category of categoriesTagA) {
            if (category.getAttribute('checked') == 'true') {
                ids.push(category.id);
            }
        }
        return ids;
    })();

    const numberOfQuestions = +document.querySelector('#numberOfQuestions').value;


    let existQuestionsPerCategories = [];


    for (const categoryId of selectedCategoriesId) {

        const response = await fetch("/api/categories/" + categoryId + "/count");
        const jsonData = await response.json();

        existQuestionsPerCategories.push(jsonData);
    }

    console.log(`${numberOfQuestions} / ${existQuestionsPerCategories.length} > ${Math.min(...existQuestionsPerCategories)}`)
    console.log(`existQuestionsPerCategories: ${existQuestionsPerCategories}`)
    if (numberOfQuestions / existQuestionsPerCategories.length > Math.min(...existQuestionsPerCategories)) {
        window.alert('Not enough questions to this number');
    } else {
        createGamePage();
    }
}


function createGamePage() {

}