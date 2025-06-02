// TODO: Put all user input in an object to do math with later rather than grabbing it off the screen
//          and have more generic functions like handleClick() if possible
//          So when you click equals, or operators, you check your object if the value is filled out yet
//          Not sure how to add those values yet but I think I can do that

const OPERATORS = ["+", "-", "*", "/"];
let OPERATOR_CHOSEN = false;
const userInput = [];
const inputDict = {
    num1: "0",
    operator: "+",
    num2: "0"
}

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
 * Clears the input from the screen
 * - The OPERATOR_CHOSEN flag needs to be set individually from each use case
 */
const clearScreen = () => {
    const userInputVals = document.querySelectorAll("#inputVal");
    const ansOutput = document.querySelector("#ansOutput");
    const input = [...userInputVals];
    ansOutput && input.push(ansOutput);
    input.forEach((val) => {
        val.parentElement.removeChild(val);
    })
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
        // user hasn't entered a single operator yet
        if (!OPERATORS.includes(char)) {
            // operator length === 0 when you're still on the first number and haven't input an operator yet
            if (operator.length === 0) {
                // Slap the char on the first number if the operator hasn't been defined yet
                num1 += char;
            } else {
                num2 += char;
            }
        } else {
            // You already have one operator so when the user enters a second operator,
            // you need to call the equals function
            // And store the result somewhere that you can access it later
            // And store the operator behind it
            operator += char;
        }
    }
    
    return [num1, operator, num2];
};

// const handleClick = (input) => {
    // I want to get the value of any button click and throw it in something that I can retrieve from later
// }

/**
 * Number onClick handler
 * Adds the number or operator clicked by the user to the screen
 * @param {Obj} input Event object for onclick to access the number
 */
const handleNumberClick = (input) => {

    const inputDiv = document.querySelector("#userInput");
    const inputVal = document.createElement("span");
    inputVal.textContent = input.target.textContent; // get the value of the number clicked
    inputVal.id = "inputVal";
    inputDiv.appendChild(inputVal);
}

/**
 * Operator onClick handler
 * Sends calculation as if an equal sign was clicked when the operator is the second operator chosen
 * Then outputs the result to the screen with the new operator and the result as the left operand
 * @param {Obj} operator Event object for operator click
 */
const handleOperatorClick = (operator) => {
    // Only allow 1 operator to be chosen before doing the calculation
    if (OPERATORS.includes(operator.target.textContent) && !OPERATOR_CHOSEN) {
        console.log("1st operator chosen: ", operator.textContent, "OPERATOR_CHOSEN BEFORE UPDATE = ", OPERATOR_CHOSEN);
        OPERATOR_CHOSEN = true;
        const inputDiv = document.querySelector("#userInput");
        const inputOperator = document.createElement("span");
        inputOperator.textContent = operator.target.textContent;
        inputOperator.id = "inputVal";
        inputDiv.appendChild(inputOperator);
    } else if (OPERATORS.includes(operator.target.textContent) && OPERATOR_CHOSEN) {
        // Get the second operator and do the math
        const secondOperator = operator.target.textContent;
        const inputOperatorSpan = document.createElement("span");
        inputOperatorSpan.textContent = secondOperator;
        inputOperatorSpan.id = "inputVal";

        // This works to trigger the equals after a second operator click. 
        // But you need refactor so you're not calling an operator but just a math function
        handleEqualSign();

        // Get the result of the last equation from the screen
        const ansOutput = document.querySelector("#ansOutput");
        const ans = ansOutput.textContent.split(" = ")[1];

        // Clear the screen so you can do the math in the dumb way that you're currently doing it
        clearScreen();

        // Create a new element to hold the new operand
        const newOperand = document.createElement("span");
        newOperand.textContent = ans;
        newOperand.id = "inputVal";

        // Get the DOM list of user input to add the new operand element to
        const userInput = document.querySelector("#userInput");
        userInput.appendChild(newOperand)

        // Add the new operator to the new operand
        userInput.appendChild(inputOperatorSpan);
        
        OPERATOR_CHOSEN = false;

    }
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
 * Does a full clear of the board and resets the operator flag
 * 
 * This is for the Clear button so should reset the board. The OPERATOR_CHOSEN flag will be set differently
 * depending on the use case of the clearScreen() function so we're setting it here also
 * 
 * TODO: Implement a backspace
 */
const handleClearClick = () => {
    clearScreen();
    OPERATOR_CHOSEN = false;
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
        button.addEventListener("click", handleNumberClick);

        numberBoard.appendChild(button);
    }

    // Add the operators to the calculator board
    operators.forEach((operator) => {
        const operatorButton = document.createElement("button");
        operatorButton.className = "operator";
        operatorButton.id = operator;
        operatorButton.textContent = operator;

        operatorButton.addEventListener("click", handleOperatorClick);

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