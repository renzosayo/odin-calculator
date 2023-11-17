const outputDiv = document.querySelector('.output');
const outputCurrent = document.querySelector('.current');
const outputPrevious = document.querySelector('.previous');
const buttonBackspace = document.querySelector('#backspace');
    buttonBackspace.addEventListener('click', () => changeCurrent(BACKSPACE));
const buttonClear = document.querySelector('#clear');
    buttonClear.addEventListener('click', clear);

const CONCAT = 'concat';
const CLEAR = 'clear';
const UPDATE = 'update';
const BACKSPACE = 'backspace';

const numberButtons = document.querySelectorAll('.num');
for(let numberButton of numberButtons) {
    numberButton.addEventListener('click', (event) => numPressed(event));
}

const operatorButtons = document.querySelectorAll('.operator');
for(let operatorButton of operatorButtons) {
    operatorButton.addEventListener('click', (event) => operatorPressed(event));
}

let operationStatus = 'input';

function numPressed(event) {
    let number = event.target.textContent;

    if(operationStatus === 'done') clear();

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
    // Equals
    // Adding . to numbers
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
    else if(operationcurrentOp === 'x^') result = power(expression[0], expression[2]);

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

function clear() {
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

