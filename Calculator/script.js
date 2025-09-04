const numberParent = document.querySelector(".numbers");
const numbers = numberParent.children;
const operatorParent = document.querySelector(".operators");
const operators = operatorParent.children;
const display = document.getElementById("display");
const equalsButton = document.querySelector(".equals");
const calculator = document.querySelector(".calculator-container");
const body = document.querySelector("body")

let leftSide = '';
let rightSide = '';
let operation = '';
let isOperated = false;
let solution = '';

function handleFloat(string){
    if (string.includes(".")){
        return string;
    } else {
        return string+=".";
    }
    
}

function changeSign(string){
    if (!string) {
        return '';
    }
    return (parseFloat(string) * -1).toString()
}

function deleteCharacter(string) {
    let arr = string.split("")
    arr.pop()
    return arr.join("");
}

function setMemory(){
    let value = parseFloat(display.innerText)
    if (typeof value === "number" && !isNaN(value)){
        sessionStorage.setItem("memory", value);
        }
}

function getMemory(){
    if (!isNaN(sessionStorage.getItem("memory"))){
        return sessionStorage.getItem("memory");
    } 
}

function handleInput(e) {
    let input = ''
    if (e.type === "keydown") {
        let inputRegex = /=|\d|\*|\+|\-|\/|\./gi
        if (e.key === "Backspace" || e.key === "Enter") {
            input = e.key;
        }
        if (inputRegex.test(e.key)) {
            input = e.key
        }
    } else if (e.type === "click") {
        input = e.target.value;
        
    }
   
    return input; 
}

function handleClear(){  
    leftSide = '';
    rightSide = '';
    solution = '';
    operation = '';
    isOperated = false;
}

function updateDisplay() {
    display.innerText = leftSide+operation+rightSide;
    if (solution || parseInt(solution) === 0) {
        display.innerText = solution;
    }
}

function buildExpression(input) {
    if(display.innerText === "DIVIDE BY ZERO ERROR"){
        display.innerText = "";
    }
    if(/\d/ig.test(input)){
        if (isOperated === false) {
            leftSide += input;
        } else {
            rightSide += input;      
        }
    } else if (/\*|\+|\-(?![a-z])|\//.test(input)) {
       
        if (typeof parseFloat(display.innerText) === "number" & !isOperated) {
            leftSide = display.innerText;
        }
         if (!leftSide || rightSide) {
            return;
        } 
        isOperated = true;
        operation = input;
             
    } else if (input === ".") {
        if (isOperated) {
            rightSide = handleFloat(rightSide)
        } else {
            leftSide = handleFloat(leftSide)
        }
        
    } else if (input === "sign") {
        if (isOperated) {
            rightSide = changeSign(rightSide)
        } else if (leftSide === ""){
            leftSide = changeSign(parseFloat(display.innerText))
        } else {
            leftSide = changeSign(leftSide)
        }
    } else if (input === "Backspace") {
         if (isOperated) {
            if (!rightSide){
                operation = '';
                isOperated = false;
            }
            rightSide = deleteCharacter(rightSide);
        } else {
            leftSide = deleteCharacter(leftSide)
        }
    } else if (input === "clear") {
        handleClear();
        display.innerText = '';
        localStorage.clear;
    } else if (input === "memory-recall"){
        if (isOperated) {
            rightSide = getMemory() ? getMemory() : rightSide;
        } else {
            leftSide = getMemory() ? getMemory() : leftSide;
        }
    }
    updateDisplay()
}


function evaluateExpression(){
    if (leftSide && !rightSide) {
        return leftSide;
    } else {
        let parsedLeft = parseFloat(leftSide)
        let parsedRight = parseFloat(rightSide);
        let result;
        switch (operation) {
            case '+':
                result = parsedLeft + parsedRight;
                break;
            case '-':
                result = parsedLeft - parsedRight;
                break;
            case '*':
                result = parsedLeft * parsedRight;
                break;
            case '/':
                if (parsedRight === 0) {
                    result = "DIVIDE BY ZERO ERROR"
                    break;
                }
                result = parsedLeft / parsedRight;
                break;
        }
        isSolved = true;
        solution = result;
        updateDisplay();
    };
    handleClear();
}

calculator.addEventListener("click", (e)=> {
    if (handleInput(e)==="memory-set"){
        setMemory()}
    buildExpression(handleInput(e))
    if (handleInput(e)==="=") {
        evaluateExpression()
    }
})
body.addEventListener("keydown", (e)=> {
    buildExpression(handleInput(e))
    if (handleInput(e)==="="||handleInput(e)==="Enter") {
        evaluateExpression()
    }
})



