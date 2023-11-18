const outputDiv = document.querySelector('.output');
const outputCurrent = document.querySelector('.current');
const outputPrevious = document.querySelector('.previous');
const buttonBackspace = document.querySelector('#backspace');
const buttonDecimal = document.querySelector('#decimal');
    buttonBackspace.addEventListener('click', () => changeCurrent(BACKSPACE));
const buttonClear = document.querySelector('#clear');
    buttonClear.addEventListener('click', allClear);

const CONCAT = 'concat';
const CLEAR = 'clear';
const UPDATE = 'update';
const BACKSPACE = 'backspace';

const START = 'start';
const PENDING = 'pending';
const DONE = 'done';

let opState = 'start';

const numberButtons = document.querySelectorAll('.num');
for(let numberButton of numberButtons) {
    numberButton.addEventListener('click', numPressed);
}

const operatorButtons = document.querySelectorAll('.operator');
for(let operatorButton of operatorButtons) {
    operatorButton.addEventListener('click', (event) => operatorPressed(event));
}

//mutation observer for decimal point
function listenForDecimals(mutations) {
    for(let mutation of mutations) {
        let currentText = mutation.target.textContent;
        if(currentText.includes('.')) {
            buttonDecimal.removeEventListener('click', numPressed);
            buttonDecimal.style.opacity = 0.4;
        } else {
            buttonDecimal.addEventListener('click', numPressed);
            buttonDecimal.style.opacity = 1;
        }
    }
}

const decimalObserver = new MutationObserver(listenForDecimals);
decimalObserver.observe(outputCurrent, { subtree: true, childList: true, characterData: true, });


function numPressed(event) {
    let number = event.target.textContent;
    if(outputPrevious.textContent.includes('=')) allClear();
    changeCurrent(CONCAT, number);
}

function switchOperator(newOperator) {
    let outputPreviousContent = outputPrevious.textContent.split(' ');
    if(outputPreviousContent.length > 1) {
        outputPreviousContent[1] = newOperator;
    }
    return outputPreviousContent.join(' ');
}

function operatorPressed(buttonPressed) {

    let currentOp = buttonPressed.target.textContent; //currentOp is latest operation
    if(currentOp === 'x^') currentOp = '^'; 

    // TO DO:
    // Equals - done
    // Adding . to numbers - done
    // -> rounded numbers  

    let newText = '';
    let newCurrentText = '0';
    let result = 0;

    //three possible scenario when pressing an operator,
    //evaluate, change operator, or just push current to prev

    //empty => start, can receive '-' for negative numbers or positive numbers => call start
    //1 + empty, can change op or input another number, can receive '-' for negative numbers => call pending
    //  ^^^ if op is not '-', call switchOperator, else take '-' as sign for negative number
    //  ^^^ 
    //pressing '=' evaluates expression, if prev and curr arent empty, else do nothing => call done

    //set flag depending on current state
    if(isEmpty(outputPrevious.textContent)) opState = START
    else if(!isEmpty(outputPrevious.textContent)) opState = PENDING;
    //separated because it wont get detected
    if(outputPrevious.textContent.includes('=')) opState = DONE;

    if(opState === START || opState === DONE) {
        if(currentOp !== '=') newText = `${outputCurrent.textContent} ${currentOp}`;

    } else if(opState === PENDING && isEmpty(outputCurrent.textContent)) {
        currentOp !== '-' ? newText = switchOperator(currentOp) : newCurrentText = '-'; //changeCurrent(UPDATE, currentOp);
        
    } else { //opState pending and outputCurrent isnt empty
        let expression = [...outputPrevious.textContent.split(' '), outputCurrent.textContent];
        result = evaluate(expression);
        if(currentOp !== '=') {
            newText = `${result} ${currentOp}`;
        } else if(opState !== DONE) {     
            newText = `${expression.join(' ')} =`;
        }

    }
    changePrevious(UPDATE, newText);
    currentOp === '=' ? changeCurrent(UPDATE, result) : changeCurrent(UPDATE, newCurrentText);

}

function isEmpty(string) {
    return (+string == 0 || string === '-' || string === '') ? true : false;
}

function operate(currentOp) { //separated for less messier operationPressed()
    let expression = [...outputPrevious.textContent.split(' '), outputCurrent.textContent];
    let result = evaluate(expression);
    alert(expression);
    changePrevious(UPDATE, `${result} ${currentOp}`);
    changeCurrent(CLEAR);
}

function evaluate(expression) { //evaluate()'s the expression
    //expression is [num1, operationcurrentOp, num2]
    let result = 0;
    let operationcurrentOp = expression[1];

    if(operationcurrentOp === '+') result = add(+expression[0], +expression[2]);
    else if(operationcurrentOp === '-') result = subtract(expression[0], expression[2]);
    else if(operationcurrentOp === 'x') result = multiply(expression[0], expression[2]);
    else if(operationcurrentOp === '/' && expression[2] == 0) {
        alert('Please avoid dividing by zero to maintain the stability of this realm. Thank you.');
    }
    else if(operationcurrentOp === '/') result = divide(expression[0], expression[2]);
    else if(operationcurrentOp === '^') result = power(expression[0], expression[2]);

    return downsize(result);
}

//if greater than 10, fix only output 10 digits inc .

function downsize(num) {
    let length = String(num).length;
    let wholeLength = String(num).split('.')[0].length;

    if(length === wholeLength) return num;

    console.log(length + ' ' + wholeLength);
    if(length >= 10) {
        return num.toFixed(10 - wholeLength);
    } else {
        return num.toFixed(length - 2);
    }
}

function changeCurrent(operation, ...args) {
    if(operation === CONCAT) {
        if(outputCurrent.textContent === "0") outputCurrent.textContent = "";
        outputCurrent.textContent += args[0];
    } else if(operation === BACKSPACE) {
        outputCurrent.textContent = outputCurrent.textContent.slice(0, outputCurrent.textContent.length - 1);
        if(outputCurrent.textContent === "") outputCurrent.textContent = "0";
    } else if(operation === UPDATE) {
        outputCurrent.textContent = args[0];
    } else if(operation === CLEAR) {
        outputCurrent.textContent = '0';
    }
}

function changePrevious(operation, ...args) {
    if(operation === CONCAT) {
        outputPrevious.textContent += args[0];
    } else if(operation === UPDATE) {
        outputPrevious.textContent = args[0];
    } else if(operation === CLEAR) {
        outputPrevious.textContent = '';
    }
}

function allClear() {
    changeCurrent(CLEAR);
    changePrevious(CLEAR);
}

function add(num1, num2) {
    return +num1 + +num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    if(num2 === 0) {
        alert('Please avoid dividing by zero to maintain the stability of this realm. Thank you.');
    } else {
        return num1 / num2;
    }
}

function power(num1, num2) {
    return Math.pow(num1, num2);
}

