let url = '/api/categories';
let listBox = document.querySelector("#adminCategoriesList");
let upgradeQuestion = false;
let upgradeQuestionId;


function readAllCategories() {

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            let categories = jsonData.valueOf();
            for (const category of categories) {
                fillCategoryToCreateQuestion(category);
                fillCategoryToUpgradeQuestion(category);
            }
        });
}

function fillCategoryToUpgradeQuestion(category) {
    let selectedCategory = document.querySelector('#categoryToUpgradeQuestion');
    let option = document.createElement('option');

    option.id = category.id;
    option.name = 'selectCategory';
    option.innerHTML = category.name;

    selectedCategory.appendChild(option);
    // init dropdown with empty option
    selectedCategory.selectedIndex = -1;
}

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
}

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

    if (!correctAnswerId || !categoryId) {
        alert('Select the category and correct answer options')
    }

    const correctAnswer = eval(`answer${correctAnswerId.id}`);

    if (
        inputFieldIsEmpty(question.value) ||
        inputFieldIsEmpty(answer0.value) ||
        inputFieldIsEmpty(answer1.value) ||
        inputFieldIsEmpty(answer2.value) ||
        inputFieldIsEmpty(answer3.value)
    ) {
        alert('Input fields cannot be left blank');
        return;
    }

    let data = JSON.stringify(
        {
            "question": question.value,
            "answers": [answer0.value, answer1.value, answer2.value, answer3.value],
            "correctAnswerId": correctAnswer.value,
            "categoryId": categoryId.id
        }
    );

    const url = 'api/questions';

    // create or upgrade question
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

    if (inputFieldIsEmpty(newCategoryName.value)) {
        return;
    }

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
            // load questions in reverse order (newest on top)
            for (let i = jsonData.length - 1; i >= 0; i--) {
                fillUpgradeQuestionList(jsonData[i]);
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


function inputFieldIsEmpty(value) {
    return value === '';
}

// Upload to database
function onFileLoad(elementId, event) {
    // document.getElementById(elementId).innerText = event.target.result;
    const file = event.target.result;
    let questions = [file.split(/(?<=\r\n\d\r\n\r\n)/)];
    for (const question of questions[0]) {
        const rows = question.toString().split(/\r\n/);
        let index = 0;
        const category = rows[index];
        index++;
        let questionText = '';

        while (!rows[index].startsWith('1:')) {
            if (rows[index] == '') {
                questionText += '\r\n\r\n';
            } else {
                questionText += rows[index];
            }
            index++;
        }

        let answers = [4];
        for (let i = 0; i < 4; i++) {
            answers[i] = rows[index].substring(2);
            index++;
        }
        const correctAnswer = rows[index] - 1;
        const categoryLabel = Array.from(document.querySelectorAll('#adminCategoriesList label'))
            .find(cat => cat.lastChild.textContent === ` ${category}`);
        const categoryId = categoryLabel.getAttribute('for');

        let dataToUpload = JSON.stringify({
            "question": questionText,
            "answers": answers,
            "correctAnswerId": correctAnswer,
            "categoryId": categoryId
        });

        const url = '/api/questions';
        fetch(url, {
            method: "POST",
            body: dataToUpload,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

function onChooseFile(event, onLoadFileHandler) {
    if (typeof window.FileReader !== 'function')
        throw ("The file API isn't supported on this browser.");
    let input = event.target;
    if (!input)
        throw ("The browser does not properly implement the event object");
    if (!input.files)
        throw ("This browser does not support the `files` property of the file input.");
    if (!input.files[0])
        return undefined;
    let file = input.files[0];
    let fr = new FileReader();
    fr.onload = onLoadFileHandler;
    fr.readAsText(file);
}


