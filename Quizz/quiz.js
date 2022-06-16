window.addEventListener("DOMContentLoaded", event => {
    quizRandom ()
});

if(localStorage.getItem('win') == null) localStorage.setItem('win', 0);
if(localStorage.getItem('lost') == null) localStorage.setItem('lost', 0);
let oldChoice, userChoice, trueAnswer;

async function apiQuiz (){
    const request = await fetch('https://opentdb.com/api.php?amount=1');
    if(!request.ok) {
        throw Error (request.statusText);
    }
    const response = await request.json()
    return response.results;
}

async function quizRandom () {
    try {
        const apiResponse = await apiQuiz ();
        // Category
        document.querySelector('.category').textContent = `Category : ${apiResponse[0].category}`;
        // Results
        document.querySelector('.win').textContent = localStorage.getItem('win');
        document.querySelector('.lost').textContent = localStorage.getItem('lost');
        //Question
        document.querySelector('.question').textContent = apiResponse[0].question;
        // Answers include trueAnswer and false answers
        trueAnswer = apiResponse[0].correct_answer;
        const answers = apiResponse[0].incorrect_answers;
        // Generate a randon integer betwen -- 0 to 3 if lenght of false answers egal 3 -- 0 or 1 if lenght false answers egal 1
        const index = Math.floor(Math.random() * parseInt(answers.length) + 1);
        // Insert true answer to random position
        answers.splice(index, 0, trueAnswer);
        // Check length of all answers to disapear undefined blocks
        let start = end = '';
        if(answers.length == 2){
            start = '<!--';
            end = '-->'
        }
        // Answers
        document.querySelector('.answers').innerHTML = `
            <div class="row">
                <div class="col-md-4 my-3 offset-md-2 yellow me-2"><p class="choice">${answers[0]}</p></div>
                <div class="col-md-4 my-3 yellow"><p class="choice">${answers[1]}</p></div>
            </div>
            ${start}
            <div class="row mt-2">
                <div class="col-md-4 my-3 offset-md-2 yellow me-2"><p class="choice">${answers[2]}</p></div>
                <div class="col-md-4 my-3 yellow"><p class="choice">${answers[3]}</p></div>
            </div>
            ${end}
        `;
        // Get user choice
        getChoice ();
    } catch (err ){
        console.log(err);
        quizRandom ();
    }
}

function getChoice (){
    document.querySelectorAll('.choice').forEach(choice => {
        choice.addEventListener('click', e => {
            if(oldChoice != undefined) {
                if(e.target.textContent != oldChoice.textContent) {
                    oldChoice.parentElement.style.background = '#ffc107';
                    oldChoice = choice;
                }
            } else {
                oldChoice = choice;
            }
            e.target.parentElement.style.background = '#198754';
            userChoice = e.target.textContent
        });
    });
}

document.querySelector('.check').addEventListener('click', () => {
    let win = parseInt(document.querySelector('.win').textContent);
    let lost = parseInt(document.querySelector('.lost').textContent);
    if(trueAnswer != undefined && userChoice != undefined){
        if(userChoice == trueAnswer) {
            localStorage.setItem('win', ++win);
        } else {
            localStorage.setItem('lost', ++lost);
        }
        quizRandom ();
    } else {
        alert('Veuillez choisir une reponse');
    }
});

document.querySelector('.clear').addEventListener('click', ()=>{
    document.querySelector('.win').textContent = document.querySelector('.lost').textContent = 0;
    localStorage.setItem('win', 0);
    localStorage.setItem('lost', 0);
});