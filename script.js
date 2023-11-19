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

let opState = '';

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
    changePrevious(UPDATE, outputPreviousContent.join(' '));
}

function operatorPressed(buttonPressed) {

    let currentOp = buttonPressed.target.textContent;
    if(currentOp === 'x^') currentOp = '^'; 

    // Earlier attempted solutions, open at your own risk
    //four possible scenario when pressing an operator,

    //evaluate, change operator, or just push current to prev, if - consider negative

    //empty, input number, receive '-' for neg => call start
    //1 + empty, change op, input number, receive '-' => call pending
    //  ^^^ if op is not '-', call switchOperator, else take '-' as sign for negative number
    //  ^^^ 
    //pressing '=' evaluates expression, if prev and curr arent empty, else do nothing => call done

    //set flag depending on current state
    //if(isEmpty(outputPrevious.textContent)) opState = START;
    //else opState = PENDING;
    //separated because it wont get detected
    //if(outputPrevious.textContent.includes('=')) opState = DONE;

    //catch dividing by zero
    // if(currentOp === '=' 
    //     && outputCurrent.textContent === '0' 
    //     && outputPrevious.textContent.split(' ')[1] === '/')
    //     alert('Please avoid dividing by zero to maintain the stability of this realm. Thank you.'); 

    // if(opState === START) {
    //     if(currentOp !== '=') 
    //         currentOp !== '-' ? newText = `${outputCurrent.textContent} ${currentOp}` 
    //         : newCurrentText = '-';

    // } else if(opState === PENDING && isEmpty(outputCurrent.textContent)) {
    //     currentOp === '-' ? newCurrentText = '-' : newText = switchOperator(currentOp); //changeCurrent(UPDATE, currentOp);

    // } else { //opState pending and outputCurrent isnt empty
    //     let expression = [...outputPrevious.textContent.split(' '), outputCurrent.textContent];
    //     result = evaluate(expression);
    //     if(currentOp !== '=') {
    //         newText = `${result} ${currentOp}`;
    //     } else if(opState !== DONE) {
    //         newText = `${expression.join(' ')} =`;
    //     }

    // }
    // changePrevious(UPDATE, newText);
    // currentOp === '=' ? changeCurrent(UPDATE, result) : changeCurrent(UPDATE, newCurrentText);
    
    //catch - and =
    //work on - first, if curr is empty, use as negative sign, else, as operator
    //work on

    // !!!!! NOTE TO SELF: THIS ALL EXECUTES WHEN AN OPERATOR IS PRESSED !!!!!
    let curText = outputCurrent.textContent;
    let prevText = outputPrevious.textContent;

    switch(currentOp) {
        case '=':
            if(!isEmpty(prevText) && !prevText.includes('=') 
                && !isEmpty(curText)) operate(curText, prevText, currentOp);
            //handle dividing by zero
            else if(!isEmpty(prevText) && !prevText.includes('=') && isEmpty(curText)) {
                alert('Please avoid dividing by zero to maintain the stability of this realm. Thank you');
            }
            break;
        case '-':
            //if curr is empty, handle negative
            //if((!isEmpty(prevText) && isEmpty(curText)) || (isEmpty(prevText) && isEmpty(curText))) {
            isEmpty(curText) ? changeCurrent(UPDATE, '-') 
                : operate(curText, prevText, currentOp);
            break;
        case '+':
        case 'x':
        case '/':
        case '^':
            operate(curText, prevText, currentOp);
            break;
    }

}

function operate(curText, prevText, currentOp) {
    //if curr is empty but prev isnt, change operator
    if(isEmpty(curText) && !isEmpty(prevText) && !prevText.includes('=')) {
        switchOperator(currentOp);
    }
    //prev empty and curr isnt, push curText + ' ' + currentOp into prev
    else if(isEmpty(prevText) && !isEmpty(curText)) {
        changePrevious(UPDATE, `${curText} ${currentOp}`);
        changeCurrent(CLEAR);
    //if none empty, evaluate
    } else if(!isEmpty(prevText) && !isEmpty(curText)) {
        let expression = [...prevText.split(' '), curText];
        let result = evaluate(expression);

        let newPrevText = '';

        if(currentOp !== '=') {
            newPrevText = `${result} ${currentOp}`;
            //changePrevious(UPDATE, `${result} ${currentOp}`);
            changeCurrent(CLEAR);
        } else {
            newPrevText = `${expression.join(' ')} =`;
            changeCurrent(UPDATE, result);
        }
        changePrevious(UPDATE, newPrevText);
    }
}


function isEmpty(string) {
    return (+string == 0 || string === '') ? true : false;
}

function evaluate(expression) { //evaluate()'s the expression
    //expression is [num1, currentOp, num2]
    let result = 0;
    let operationcurrentOp = expression[1];

    if(operationcurrentOp === '+') result = add(+expression[0], +expression[2]);
    else if(operationcurrentOp === '-') result = subtract(expression[0], expression[2]);
    else if(operationcurrentOp === 'x') result = multiply(expression[0], expression[2]);
    //basically useless, kept for reference
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

