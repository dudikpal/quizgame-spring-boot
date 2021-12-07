let url = '/api/categories';
let listBox = document.querySelector("#adminCategoriesList");
let upgradeQuestion = false;
let upgradeQuestionId;

function readAllCategories() {

    //listBox.innerHTML = '';

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            let categories = jsonData.valueOf();
            for (const category of categories) {
                fillCategoryToCreateQuestion(category);
                // init dropdown with empty option
                //fillCategoryToUpgradeQuestion({id: 0, name: ""});
                fillCategoryToUpgradeQuestion(category);
            }
        });
};

function fillCategoryToUpgradeQuestion(category) {
    let selectedCategory = document.querySelector('#categoryToUpgradeQuestion');
    let option = document.createElement('option');

    option.id = category.id;
    option.name = 'selectCategory';
    option.innerHTML = category.name;

    selectedCategory.appendChild(option);
    selectedCategory.selectedIndex = -1;
};

function fillCategoryToCreateQuestion(category) {
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

const createQuestionButton = document.querySelector('#submit-question-button');

function createQuestion() {
    const question = document.querySelector('#question');
    const answer0 = document.querySelector('#answer-0');
    const answer1 = document.querySelector('#answer-1');
    const answer2 = document.querySelector('#answer-2');
    const answer3 = document.querySelector('#answer-3');
    const correctAnswerId = document.querySelector('input[name="correctAnswer"]:checked');
    const categoryId = document.querySelector('input[name="groupCategories"]:checked');
    const correctAnswer = eval(`answer${correctAnswerId.id}`);
    console.log(correctAnswerId)
    console.log(correctAnswer)

    let data = JSON.stringify(
        {
            "question": question.value,
            "answers": [answer0.value, answer1.value, answer2.value, answer3.value],
            "correctAnswerId": correctAnswer.value,
            "categoryId": categoryId.id
        }
    );

    const url = 'api/questions';

    if (upgradeQuestion) {

        fetch(url + '/' + upgradeQuestionId, {
            method: "PUT",
            body: data,
            headers: {
                "Content-Type": "application/json"
            }
        });

        upgradeQuestion = false;
    } else {

        fetch(url, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    let statusLabel = document.querySelector('#status-label');
    statusLabel.innerHTML = 'Save successful';
    question.value = '';
    answer0.value = '';
    answer1.value = '';
    answer2.value = '';
    answer3.value = '';
    correctAnswerId.checked = false;
    //categoryId.checked = false;

}

createQuestionButton.setAttribute('onclick', 'createQuestion()');

const createCategoryButton = document.querySelector('#submit-new-category-button');

function createCategory() {
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
            fillCategoryToCreateQuestion(jsonData.valueOf());
            fillCategoryToUpgradeQuestion(jsonData.valueOf());
            newCategoryName.value = '';
        });
}

createCategoryButton.setAttribute('onclick', 'createCategory()');


function updateQuestion() {
    const selectBox = document.querySelector('#categoryToUpgradeQuestion');
    const selectedCategoryId = selectBox.options[selectBox.selectedIndex].id;

    let data = JSON.stringify({
        "id": selectedCategoryId
    });
    const url = '/api/categories/' + selectedCategoryId;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            let listDiv = document.querySelector('#selectQuestion');
            listDiv.innerHTML = '';
            for (const element of jsonData.valueOf()) {
                fillUpgradeQuestionList(element);
            }
        });


}


function loadUpgradableQuestion() {
    const url = '/api/questions/' + this.id;
    upgradeQuestion = true;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            const data = jsonData.valueOf();
            let categoryId = data.categoryId;
            let questionText = data.question;
            const correctAnswerId = data.correctAnswerId;
            let categoryRadio = document.querySelector(`input[id="${categoryId}"]`);

            for (let i = 0; i < 4; i++) {
                let answer = document.querySelector(`#answer-${i}`);
                if (data.answers[i] === correctAnswerId) {
                let correctAnswerRadio = document.querySelector(`input[id="${i}"]`);
                correctAnswerRadio.checked = true;
                }
                answer.value = data.answers[i];
            }

            upgradeQuestionId = data.id;
            document.querySelector('#question').value = questionText;
            categoryRadio.checked = true;
        })
}


function fillUpgradeQuestionList(questionObject) {
    let listDiv = document.querySelector('#selectQuestion');
    let questionToList = questionObject.question;
    let aTag = document.createElement('a');

    aTag.classList.add('list-group-item', 'list-group-item-action');
    aTag.setAttribute('onclick', 'loadUpgradableQuestion.call(this)');
    aTag.id = questionObject.id;
    aTag.innerHTML = questionToList;

    listDiv.appendChild(aTag);
}

