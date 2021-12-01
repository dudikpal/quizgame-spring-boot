let url = '/api/categories';
let listBox = document.querySelector("#adminCategoriesList");

function readAllCategories() {

    //listBox.innerHTML = '';

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            let categories = jsonData.valueOf();
            for (const category of categories) {
                appendCategory(category);
                appendToSelectCategory(category);
            }
        });
};

function appendToSelectCategory(category) {
    let selectedCategory = document.querySelector('#selectFromCategory');
    let option = document.createElement('option');

    option.id = category.id;
    option.name = 'selectCategory';
    option.setAttribute('onclick', 'updateQuestion()');
    option.innerHTML = category.name;

    selectedCategory.appendChild(option);
};

function appendCategory(category) {
    let label = document.createElement('label');
    let radio = document.createElement('input');
    let name = document.createElement('span');

    label.setAttribute('for', category.id);
    label.style.display = "block";
    radio.type = 'radio';
    radio.setAttribute('id', category.id);
    radio.setAttribute('name', 'groupCategories');
    name.innerHTML = ' ' + category.name;


    label.appendChild(radio);
    label.appendChild(name);
    listBox.appendChild(label);
};

readAllCategories();

const submitQuestionButton = document.querySelector('#submit-question-button');

function submitQuestion() {
    const question = document.querySelector('#question');
    const answer0 = document.querySelector('#answer-0');
    const answer1 = document.querySelector('#answer-1');
    const answer2 = document.querySelector('#answer-2');
    const answer3 = document.querySelector('#answer-3');
    const correctAnswerIndex = document.querySelector('input[name="correctAnswer"]:checked');
    const categoryId = document.querySelector('input[name="groupCategories"]:checked');

    let data = JSON.stringify(
        {
            "question": question.value,
            "answers": [answer0.value, answer1.value, answer2.value, answer3.value],
            "correctAnswerIndex": correctAnswerIndex.id,
            "categoryId": categoryId.id
        }
    );

    const url = 'api/questions';

    fetch(url, {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function () {
            let statusLabel = document.querySelector('#status-label');
            statusLabel.innerHTML = 'Save successful';
            question.value = '';
            answer0.value = '';
            answer1.value = '';
            answer2.value = '';
            answer3.value = '';
            correctAnswerIndex.checked = false;
            categoryId.checked = false;
        });
}

submitQuestionButton.setAttribute('onclick', 'submitQuestion()');

const submitCategoryButton = document.querySelector('#submit-new-category-button');

function submitCategory() {
    const newCategoryName = document.querySelector('#newCategoryName');

    let data = JSON.stringify({
        "name": newCategoryName.value
    });

    const url = '/api/categories';

    fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            appendCategory(jsonData.valueOf());
            newCategoryName.value = '';
        });
}

submitCategoryButton.setAttribute('onclick', 'submitCategory()');


function updateQuestion() {
    let selectedCategory = document.querySelector('#selectFromCategory');
    const categoryId = document.querySelector('#selectQuestion');
    const id = this;
    console.log(categoryId.id);
    console.log(id);

    let selectQuestionDiv = document.querySelector('#selectQuestion');


}

