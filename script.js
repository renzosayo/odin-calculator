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
        outputPreviousContent[outputPreviousContent.length - 1] = newOperator;
        changePrevious(UPDATE, outputPreviousContent.join(' '));
    }
}

function operatorPressed(buttonPressed) {

    let currentOp = buttonPressed.target.textContent; //currentOp is latest operation
    if(currentOp === 'x^') currentOp = '^'; 

    // TO DO:
    // Equals - done
    // Adding . to numbers - done
    // -> rounded numbers 

    let newText = ``;
    let result = 0;

    if(isEmpty(outputPrevious.textContent) === false) {
        let expression = [...outputPrevious.textContent.split(' '), outputCurrent.textContent];
        result = evaluate(expression);
        if(currentOp === '=') {
            newText = `${expression.join(' ')} =`;
        } else {     
            newText = `${result} ${currentOp}`;
        }
    } else {
        newText = `${outputCurrent.textContent} ${currentOp}`;
    }
    
    if(currentOp === '-' && isEmpty(outputCurrent.textContent)) {
        outputCurrent.textContent = '-';
    } else if (outputCurrent.textContent === '0') {
        switchOperator(currentOp);
    } else {
        changePrevious(UPDATE, `${newText}`);
        currentOp === '=' ? changeCurrent(UPDATE, result) : changeCurrent(CLEAR);
    }
}

function isEmpty(string) {
    return (+string == 0 || string === '-' || string === '') ? true: false;
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

    return result;
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

