const outputDiv = document.querySelector('.output');
const outputCurrent = document.querySelector('.current');
const outputPrevious = document.querySelector('.previous');
const buttonBackspace = document.querySelector('#backspace');
    buttonBackspace.addEventListener('click', () => changeCurrent('backspace'));
const buttonClear = document.querySelector('#clear');
    buttonClear.addEventListener('click', clear);

const numberButtons = document.querySelectorAll('.num');
for(let numberButton of numberButtons) {
    numberButton.addEventListener('click', (event) => numPressed(event));
}

const operatorButtons = document.querySelectorAll('.operator');
for(let operatorButton of operatorButtons) {
    operatorButton.addEventListener('click', (event) => operatorPressed(event));
}

function numPressed(event) {
    let number = event.target.textContent;
    if(!(outputPrevious.textContent === '')) changeCurrent('update', '');
    changeCurrent('concat', number);
}

function operatorPressed(buttonPressed) {

    let operation = buttonPressed.target.value;
    let symbol = buttonPressed.target.textContent;
    //statusPrevious 0 is empty, 2 is pending, 3 is complete 
    let statusPrevious = outputPrevious.textContent.split(' ').length;
    let expression = [];

    if(statusPrevious === 2) {
        changePrevious('concat', ` ${outputCurrent.textContent}`);
        expression = [...outputPrevious.textContent.split(' ')];
        result = operate(expression, operation);
        changeCurrent('update', result);
    } else {
        changePrevious('update', `${outputCurrent.textContent} ${symbol}`);
    }

}

function operate(expression, operation) {
    //expression is [num1, operationSymbol, num2]

    let result = 0;
    let operationSymbol = expression[1];

    if(operation === 'add' || (operation === 'equal' && operationSymbol === '+')) 
        result = add(+expression[0], +expression[2]);
    else if (operation === 'subtract' || (operation === 'equal' && operationSymbol === '-'))
        result = subtract(expression[0], expression[2]);
    else if (operation === 'multiply' || (operation === 'equal' && operationSymbol === 'x'))
        result = multiply(expression[0], expression[2]);
    else if (operation === 'divide' || (operation === 'equal' && operationSymbol === '/'))
        result = divide(expression[0], expression[2]);
    else if (operation === 'power' || (operation === 'equal' && operationSymbol === 'x^'))
        result = power(expression[0], expression[2]);

    return result;
}

function changeCurrent(operation, ...args) {
    if(operation === 'concat') {
        if(outputCurrent.textContent === "0") outputCurrent.textContent = "";
        outputCurrent.textContent += args[0];
    } else if(operation === 'backspace') {
        outputCurrent.textContent = outputCurrent.textContent.slice(0, outputCurrent.textContent.length - 1);
        if(outputCurrent.textContent === "") outputCurrent.textContent = "0";
    } else if(operation === 'update') {
        outputCurrent.textContent = args[0];
    } else if(operation === 'clear') {
        outputCurrent.textContent = '0';
    }
}

function changePrevious(operation, newText) {
    if(operation === 'concat') {
        outputPrevious.textContent += newText;
    } else if(operation === 'update') {
        outputPrevious.textContent = newText;
    } else if(operation === 'clear') {
        outputPrevious.textContent = '';
    }
    
}

function clear() {
    changeCurrent('clear');
    changePrevious('clear');
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
    return num1 / num2;
}

function power(num1, num2) {
    return Math.pow(num1, num2);
}

