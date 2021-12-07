const questionBlock = document.querySelector(".question-block");
let counter = document.querySelector(".counter");
let number = document.querySelector(".number");
const categoryList = new Map;
const levelList = document.querySelectorAll(".one.level a");
const startButton = document.querySelector(".startBtn");
const selector = document.querySelector(".selector");
const section = document.querySelector("section");
const url = '/api/questions';

let currentPage = 0;
let totalRight = 0;
let moveOn = false;
let idCategory = "";
let level = "";
let allowNext = false;
let nameCategory = "";
let levelText = "";
let data;
let maxPage = 0;
let allQuestions = new Map;


initCategories();


async function initCategories() {
    const categoryResponse = await fetch('/api/categories')
    const categoryJsonData = await categoryResponse.json();
    let categoriesDiv = document.querySelector('.one.category');

    for (const category of categoryJsonData) {
        categoryList.set(category.id, category.name);
        let aTag = document.createElement('a');
        aTag.id = category.id;
        aTag.innerHTML = category.name;
        categoriesDiv.appendChild(aTag);
        aTag.addEventListener("click", function () {
            idCategory = category.id;
            if (aTag.className == "active") {
                aTag.className = "";
            } else {
                aTag.className = "active";
            }
            checkPossibleNumberOfQuestions();
        });
    }

    const allQuestionJsonData = await getInfo();

    for (const question of allQuestionJsonData) {
        if (allQuestions.has(question.categoryId)) {
            allQuestions.get(question.categoryId).push(question);
        } else {
            allQuestions.set(question.categoryId, []);
            allQuestions.get(question.categoryId).push(question);
        }
    }
}


function checkPossibleNumberOfQuestions() {
    const activeCategories = document.querySelectorAll('.one.category a[class~=active]');
    let maxPossibleQuestion = document.querySelector('#maxPossibleQuestion');
    maxPage = document.querySelector('#numberOfQuestions').value;
    const numberOfQuestionPerCategory = [];
    for (const activeCategory of activeCategories) {
        numberOfQuestionPerCategory.push(allQuestions.get(activeCategory.id).length);
    }
    const maxQuestionOfCategory = Math.min(...numberOfQuestionPerCategory);
    if (Math.floor(maxPage / activeCategories.length) > maxQuestionOfCategory) {
        maxPage = maxQuestionOfCategory * activeCategories.length;
    }
    maxPossibleQuestion.innerHTML = maxPage;
    console.log(maxPage)
}


startButton.addEventListener("click", function () {

    checkPossibleNumberOfQuestions();
    selector.style.display = "none";
    getInfo()
    .then(render);


})

// maxPage = numberOfQuestions
// idCategory = categoryId
// level = ?
function getInfo() { //getting all the data from API

    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            return jsonData;
        })
        .catch( () => {
            alert("Server is not available! Try again in a few moment.")
        })

}

// render the data from API
function render(info) {

    section.style.display = "flex";

    if (currentPage <= maxPage - 1) {
        setTimeout(function () {
            counter.style.display = "block";
            number.textContent = currentPage + 1;
        }, 40)

        questionBlock.innerHTML = "";
        let eachData = info[currentPage];

        const gameInfoCat = document.querySelector(".game-info1");
        const gameInfoLev = document.querySelector(".game-info2");
        const pQuestion = document.createElement("p");
        const ul = document.createElement("ul");
        const nextBtn = document.createElement("button");
        nextBtn.className = "nextBtn";
        const cancelBtn = document.createElement("button");
        cancelBtn.classList = "reset";
        nextBtn.textContent = "Next Question";
        cancelBtn.textContent = "Reset Game";
        pQuestion.innerHTML = eachData.question;

        gameInfoCat.textContent = categoryList.get(eachData.categoryId);
        gameInfoLev.textContent = levelText;
        questionBlock.appendChild(pQuestion);
        questionBlock.appendChild(ul);
        questionBlock.appendChild(cancelBtn);
        questionBlock.appendChild(nextBtn);

        //new array with first data in the array is the correct answer API
        let answers = [];

        //pushing new data to the array with incorrect answer from the API
        for (let j = 0; j < eachData.answers.length; j++) {
            answers.push(eachData.answers[j]);
        }

        // shuffle the answers array
        answers = shuffle(answers);

        //looping through the answers array to print out the list of answers to the DOM
        // all the wrong anwers
        for (let k = 0; k < answers.length; k++) {
            const li = document.createElement("li");
            const spanLi = document.createElement("span")
            const checkBtn = document.createElement("i");
            const totalpages = document.querySelector('#totalpages');
            checkBtn.className = "material-icons radio";
            checkBtn.textContent = "radio_button_unchecked"
            totalpages.innerHTML = maxPage;
            ul.appendChild(li);
            li.appendChild(spanLi);
            spanLi.innerHTML = answers[k];
            li.appendChild(checkBtn);
        }

        if (moveOn === false) {
            selectAnswers()
        }

        nextBtn.addEventListener("click", function () {

            if (allowNext === true) {
                console.log('nextbtn listener')
                currentPage++;
                checkAnswer(eachData)
                render(info);
                moveOn = false;
                allowNext = false;
            }
        })

        cancelBtn.addEventListener("click", resetGame);

    }

    if (currentPage === maxPage - 1) {
        selectAnswers();
        checkAnswer(info);
        let cancelBtn = document.querySelector(".question-block button.reset");
        cancelBtn.style.display = "none";
        finalPage();
    }

}


function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }

    return array;
}


function selectAnswers() {

    let answersLi = document.querySelectorAll("li");
    let answersLiIcon = document.querySelectorAll("i");
    console.log(answersLi);

    for (let j = 0; j < answersLi.length; j++) {
        let eachAnswerBtn = answersLi[j];
        let eachAnswerIcon = answersLiIcon[j];
        //eachAnswerBtn.childNodes[1].textContent = "radio_button_unchecked";

        eachAnswerBtn.addEventListener("click", function () {

            for (let k = 0; k < answersLi.length; k++) {
                let eachAnswerBtn = answersLi[k];
                let eachAnswerIcon = answersLiIcon[k];
                eachAnswerIcon.textContent = "radio_button_unchecked";
                eachAnswerIcon.style.color = "rgb(128, 97, 57)";
                eachAnswerBtn.className = "";
              

            }
            eachAnswerIcon.textContent = "radio_button_checked";
            eachAnswerBtn.className = "active";
            eachAnswerIcon.style.color = "rgb(128, 97, 57)";
            allowNext = true;
        })
    }
}


function checkAnswer(info) {

    let answersLi = document.querySelectorAll("li span");
    let answersLiIcon = document.querySelectorAll("i");
    //console.log(answersLi);

    for (let j = 0; j < answersLi.length; j++) {
        let eachAnswer = answersLi[j]
        let eachAnswerIcon = answersLiIcon[j];
        console.log(eachAnswer.textContent)
        if (eachAnswerIcon.textContent === "radio_button_checked") {
            if (eachAnswer.textContent === info.correctAnswerId) {
                totalRight++;
            }
        }
    }

}


function finalPage() {
    let p = document.querySelector(".question-block p");
    let finalBtn = document.querySelector(".question-block button.nextBtn")
    let ul = document.querySelector("ul");
    const gameinfoclass = document.querySelector('.game-info');
    let li = document.querySelector("li");
    gameinfoclass.innerHTML = '';
    finalBtn.textContent = "Check your answers!";

    finalBtn.addEventListener("click", function () {
        let section = document.querySelector("section");
        section.style.flexFlow = "column wrap";
        let questionBlock = document.querySelector(".question-block");
        questionBlock.style.padding = "30px 40px 20px 40px";

        let p1 = document.createElement("p");
        p1.className = "score-num";
        let p2 = document.createElement("p");
        p2.className = "score-text";
        questionBlock.appendChild(p1);
        questionBlock.appendChild(p2);
        
        p.style.display = "none"
        questionBlock.removeChild(ul)
        ul.removeChild(li);
        let sectionH3 = document.querySelector("section h3");
        sectionH3.textContent = "Result"
        p1.textContent = totalRight;
        p2.textContent = `correct answers from ${maxPage} questions`;
        finalBtn.style.display = "none";
        counter.style.display = "none";

        let resetBtn = document.createElement("button");
        resetBtn.textContent = "Play Again!";
        resetBtn.className = "endButton"
        questionBlock.appendChild(resetBtn);

        resetBtn.addEventListener("click", resetGame);
        allowNext = false;
        moveOn = true;
        //}

    })
}

function resetGame() {
    location.reload();
}