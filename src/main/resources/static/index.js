//import {createGamePage} from './game';
//const gamePage = require('game');

let url = '/api/categories';
let categoriesList = document.querySelector("#categories");
const startButton = document.querySelector('.startBtn');
startButton.setAttribute('onclick', 'startQuiz()');
let selectedCategoriesId = null;
let numberOfQuestions = 0;

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

    selectedCategoriesId = await (function () {
        let ids = [];
        for (let category of categoriesTagA) {
            if (category.getAttribute('checked') == 'true') {
                ids.push(category.id);
            }
        }
        return ids;
    })();

    numberOfQuestions = +document.querySelector('#numberOfQuestions').value;


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
        document.querySelector('.selector').innerHTML = '';
        loadGamePage();
        //window.location = 'game.html';
    }
}


async function loadGamePage() {
    const questionMap = await fillQuestionsArray()
        .then(function(response) {
            return response;
        });
    console.log(questionMap)
}


async function fillQuestionsArray() {
    let questions = new Map();

    for (const categoryId of selectedCategoriesId) {

        const url = `/api/categories/${categoryId}`;
        const response = await fetch(url);
        const jsonData = await response.json();
        let array = [];

        for (const questionData of jsonData) {
            const question = {
                id: questionData.id,
                categoryId: categoryId,
                question: questionData.question,
                correctAnswerIndex: questionData.correctAnswerIndex,
                answers: questionData.answers
            }
            array.push(question);
        }

        for (let i = 0; i < numberOfQuestions / selectedCategoriesId.length; i++) {

            let index = Math.floor(Math.random() * array.length);
            let question = array[index];
            while (questions.has(question.id)) {
                index = Math.floor(Math.random() * array.length);
                question = array[index];
            }
            questions.set(question.id, question);
        }
    }
    return questions;
}


