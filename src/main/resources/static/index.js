let url = '/api/categories';
let categoriesList = document.querySelector("#categories");
const startButton = document.querySelector('.startBtn');
startButton.setAttribute('onclick', 'startQuiz()');
let selectedCategoriesId = null;
let numberOfQuestions = 0;
let categoryNames = new Map;
let questionBlock = document.querySelector('.question-block');
let questionMap = new Map;

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

    fetch('/api/categories/')
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            for (const category of jsonData) {
                categoryNames.set(category.id, category.name)
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

    selectedCategoriesId = (function () {
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

    if (numberOfQuestions / existQuestionsPerCategories.length > Math.min(...existQuestionsPerCategories)) {
        window.alert('Not enough questions to this number');
    } else {
        document.querySelector('.selector').innerHTML = '';
        await loadGamePage();
        //window.location = 'game.html';
    }
}

let currentPage = 0;

async function loadGamePage() {
    questionMap = await fillQuestionsArray()
        .then(function(response) {
            return response;
        });
    const selector = document.querySelector(".selector");
    const section = document.querySelector("section");
    selector.style.display = "none";
    section.style.display = "flex";
    //console.log(questionMap.keys())
    await renderQuestionPage(questionMap);
}


async function renderQuestionPage(questionMap) {

    const gameInfoCat = document.querySelector(".game-info1");
    const keyset = Array.from(questionMap.keys());
    const randomId = randomKey(keyset);
    const question = questionMap.get(randomId);
    questionMap.delete(randomId);
    gameInfoCat.textContent = categoryNames.get(question.categoryId);

    fillAnswersElements(question);
}


function fillAnswersElements(question) {

    let questionP = document.createElement('p');
    questionP.innerHTML = question.question;
    const ul = document.createElement("ul");
    const nextBtn = document.createElement("button");
    nextBtn.className = "nextBtn";
    const cancelBtn = document.createElement("button");
    cancelBtn.classList = "reset";
    nextBtn.textContent = "Next Question";
    cancelBtn.textContent = "Reset Game";

    questionBlock.appendChild(questionP);
    questionBlock.appendChild(ul);
    questionBlock.appendChild(cancelBtn);
    questionBlock.appendChild(nextBtn);

    const correctAnswerId = question.answers[question.correctAnswerIndex];
    let answers = question.answers;
    const loop = answers.length;

    for (let i = 0; i < loop; i++) {
        const li = document.createElement("li");
        const spanLi = document.createElement("span")
        const checkBtn = document.createElement("i");
        checkBtn.className = "material-icons radio";
        checkBtn.textContent = "radio_button_unchecked";
        ul.appendChild(li);
        li.appendChild(spanLi);
        const index = randomKey(Object.keys(answers));
        spanLi.innerHTML = answers[index];
        answers.splice(index, 1);
        li.appendChild(checkBtn);
    }
}


function randomKey(keyset) {
    let index = Math.floor(Math.random() * keyset.length);

    let counter = 0;
    for (const keysetElement of keyset) {
        if (index === counter) {
            return keysetElement;
        }
        counter++;
    }
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


