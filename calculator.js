const OPERATORS = ["+", "-", "*", "/"];
const userInput = [];

const validateNum = (num) => {
    console.log("num: ", num);
    // if (num || Number.isNaN(num)) {
    //     return "ERROR";
    // }
    return (num && Number.isNaN(num));
}

const add = (num1, num2) => {
    // if (validateNum(num1) || validateNum(num2)) return "ERROR";
    num1 = Number.parseInt(num1);
    num2 = Number.parseInt(num2);
    return num1 + num2;
};

const subtract = (num1, num2) => {
    num1 = Number.parseInt(num1);
    num2 = Number.parseInt(num2);
    return num1 - num2;
};

const multiply = (num1, num2) => {
    num1 = Number.parseInt(num1);
    num2 = Number.parseInt(num2);
    return num1 * num2;
};

const divide = (num1, num2) => {
    num1 = Number.parseInt(num1);
    num2 = Number.parseInt(num2);
    return num1 / num2;
};

/**
 * Forwards the math operation to the correct math function based on the operator
 * @param {int} num1 
 * @param {String} operator 
 * @param {int} num2 
 */
const getMathAnswer = (parsedChoices) => {
    if (parsedChoices.length !== 3) {
        return `ERROR: Cannot handle more than 2 numbers and one operator. Received: ${parsedChoices}`;
    }

    // Add a try except around getting the nums and operator out
    const num1 = parsedChoices[0];
    const operator = parsedChoices[1];
    const num2 = parsedChoices[2];

    switch (operator) {
        case OPERATORS[0]:
            // +
            return add(num1, num2);
        case OPERATORS[1]:
            // -
            return subtract(num1, num2);
        case OPERATORS[2]:
            // *
            return multiply(num1, num2);
        case OPERATORS[3]:
            // /
            return divide(num1, num2);
        default:
            console.log("Big errors bro! We didn't match an operator!!");
            return `ERROR determining math function to forward ${num1} and ${num2} to with operator ${operator}`;
    }
};


/**
 * Extracts the values from the buttons that were clicked and turns them into numbers and an
 * operator
 * Only handles two whole numbers and one operator
 * TODO: Actually limit the handling to 2 nums and 1 operator
 * @param {Array} choiceArr Holds all the values from the buttons the user clicked
 * @returns {Array} Array with two numbers and the operator
 */
const parseInputNodesToString = (choiceArr) => {
    // Transform the dom nodes into a single string to parse
    const choiceStr = choiceArr.reduce((acc, cur) => {
        return acc + cur.textContent;
    }, "");

    // Iterate through the string and check the numbers until you get a symbol
    let num1 = "";
    let operator = "";
    let num2 = "";
    for (const char of choiceStr) {
        // if the char is not an operator, concatenate onto num
        if (!OPERATORS.includes(char)) {
            if (operator.length === 0) {
                // Slap the char on the first number if the operator hasn't been defined yet
                num1 += char;
            } else {
                num2 += char;
            }
        } else {
            operator += char;
        }
    }
    
    return [num1, operator, num2];
};

/**
 * Number and operator onClick handler
 * Adds the number or operator clicked by the user to the screen
 * @param {Obj} input Event object for onclick to access the number or operator
 */
const addUserInputToScreen = (input) => {
    const inputDiv = document.querySelector("#userInput");
    const inputVal = document.createElement("span");
    inputVal.textContent = input.target.textContent;
    inputVal.id = "inputVal";
    inputDiv.appendChild(inputVal);
}

/**
 * Gets the input from the screen and puts it into a global array as either an int or str
 * to be userd later
 * 
 * This function needs to also trigger the actual math functions
 */
const handleEqualSign = () => {
    // grab all the numbers off the screen
    const userChoices = document.querySelectorAll("#inputVal");
    const choiceArr = [...userChoices];
    
    const parsedChoices = parseInputNodesToString(choiceArr);

    const answer = getMathAnswer(parsedChoices);

    const userInputDiv = document.querySelector("#userInput");
    const ansOutput = document.createElement("span");
    ansOutput.id = "ansOutput";
    ansOutput.textContent = " = " + answer;
    userInputDiv.appendChild(ansOutput);
}

/**
 * Clears the board from input and answer
 */
const handleClearClick = () => {
    const userInputVals = document.querySelectorAll("#inputVal");
    const ansOutput = document.querySelector("#ansOutput");
    const input = [...userInputVals];
    ansOutput !== null ?? input.push(ansOutput);
    input.forEach((val) => {
        val.parentElement.removeChild(val);
    })
}

/**
 * Builds the number pad for users to click numbers
 * Need to add an eventListener and a function to take the numbers and do something with them
 */
const buildNums = () => {
    let numOrder = 0;
    const operators = ["+", "-", "*", "/"];
    const numberBoard = document.querySelector("#numberBoard");
    
    // Build the number board
    for (let i = 0; i <= 9; i++) {
        const button = document.createElement("button");
        buttonclassName = "number";
        button.id = i;
        button.textContent = i;
        button.addEventListener("click", addUserInputToScreen);

        numberBoard.appendChild(button);
    }

    // Add the operators to the calculator board
    operators.forEach((operator) => {
        const operatorButton = document.createElement("button");
        operatorButton.className = "operator";
        operatorButton.id = operator;
        operatorButton.textContent = operator;

        operatorButton.addEventListener("click", addUserInputToScreen);

        numberBoard.appendChild(operatorButton);
    })

    // Add the equal button with it's own onclick
    const equalButton = document.createElement("button");
    equalButton.className = "equals";
    equalButton.id = "equals";
    equalButton.textContent = "=";
    equalButton.addEventListener("click", handleEqualSign);
    numberBoard.appendChild(equalButton);

    // Add the clear button
    const clearButton = document.createElement("button");
    clearButton.className = "clear";
    clearButton.id = "clear";
    clearButton.textContent = "C";
    clearButton.addEventListener("click", handleClearClick);
    numberBoard.appendChild(clearButton);
}

buildNums();