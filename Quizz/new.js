window.addEventListener("DOMContentLoaded", (event) => {
    quizRandom();
});

if(localStorage.getItem('win') == null) localStorage.setItem('win', 0);
if(localStorage.getItem('lost') == null) localStorage.setItem('lost', 0);

let oldUserChoice,userChoice,trueAnswer;

async function apiQuiz(){
    const request = await fetch('https://opentdb.com/api.php?amount=1');
    if(!request.ok){
        throw Error (request.statusText);
    }
    const response = await request.json();
   // console.log(response);
    return response.results;
}

async function quizRandom(){
    try{
        const apiResponse = await apiQuiz();
      
        document.querySelector('.win').textContent = localStorage.getItem('win');
        document.querySelector('.lost').textContent = localStorage.getItem('lost');
        document.querySelector('.category').textContent =`Category : ${apiResponse[0].category}`;
        document.querySelector('.question').textContent = apiResponse[0].question;
        trueAnswer = apiResponse[0].correct_answer;
        const answers = apiResponse[0].incorrect_answers;
        const indexPosition = Math.floor(Math.random() * parseInt(answers.length));
        answers.splice(indexPosition,0,trueAnswer);

        let start = '';
        let end = '';
        if(answers.length == 2){
            start = '<!--';
            end = '-->';
        }

        document.querySelector('.answers').innerHTML = `
        <div class="row">
            <div class="col-md-5 offset-md-1 yellow me-2"><p class="choice">${answers[0]}</p></div>
            <div class="col-md-5 yellow"><p class="choice">${answers[1]}</p></div>
        </div>
        ${start}
        <div class="row mt-2">
            <div class="col-md-5 offset-md-1 yellow me-2"><p class="choice">${answers[2]}</p></div>
            <div class="col-md-5 yellow"><p class="choice">${answers[3]}</p></div>
        </div>
        ${end}` 
        getChoice();
    } 
    catch(err){
        console.log(err);
         quizRandom();
    }

    function getChoice(){
        document.querySelectorAll('.choice').forEach(choice => {
           choice.addEventListener('click', e => {
            if(oldUserChoice != undefined){
                if(e.target.textContent != oldUserChoice.textContent){
                   oldUserChoice.parentElement.style.background = '#ffc107';
                   oldUserChoice = choice;
                }    
            } else{
                oldUserChoice = choice;
            }
            e.target.parentElement.style.background = '#ABC8E2';
            userChoice = e.target.textContent;

            });
        });
    }

    document.querySelector('.check').addEventListener('click' ,() => {
        let win = parseInt(document.querySelector('.win').textContent);
        let lost = parseInt(document.querySelector('.lost').textContent);
        if(userChoice != undefined && trueAnswer != undefined){
            if(userChoice == trueAnswer){
                localStorage.setItem('win', ++win);
            }else{
                localStorage.setItem('lost', ++lost)
            }
            quizRandom();
        }else{
            alert('Please, you need to select answer!')
        }
    });

    document.querySelector('.clear').addEventListener('click', ()=>{
        document.querySelector('.win').textContent = document.querySelector('.lost').textContent = 0;
        localStorage.setItem('win', 0);
        localStorage.setItem('lost', 0);
    });

    
}



