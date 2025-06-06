// TODO: Put all user input in an object to do math with later rather than grabbing it off the screen
//          and have more generic functions like handleClick() if possible
//          So when you click equals, or operators, you check your object if the value is filled out yet
//          Not sure how to add those values yet but I think I can do that

const OPERATORS = ["+", "-", "*", "/"];
let OPERATOR_CHOSEN = false;
let DIVIDE_BY_ZERO = false;
let DECIMAL_CLICKED = false;
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
    // num1 = Number.parseInt(num1);
    // num2 = Number.parseInt(num2);
    console.log("num1: ", num1, "num2", num2);
    return num1 + num2;
};

const subtract = (num1, num2) => {
    // num1 = Number.parseInt(num1);
    // num2 = Number.parseInt(num2);
    console.log("num1: ", num1, "num2", num2);
    return num1 - num2;
};

const multiply = (num1, num2) => {
    // num1 = Number.parseInt(num1);
    // num2 = Number.parseInt(num2);
    console.log("num1: ", num1, "num2", num2);
    return num1 * num2;
};

const divide = (num1, num2) => {
    if (num2 === "0") {
        // You shouldn't be returning a string and a number here dummy!
        // Might want to put the error on the screen and return empty
        DIVIDE_BY_ZERO = true;
        return "Can't Divide By 0, Dummy 🤪! Press Clear or Pick a number to start over.";
    }
    // num1 = Number.parseInt(num1);
    // num2 = Number.parseInt(num2);
    console.log("num1: ", num1, "num2", num2);
    console.log("divide operation: ", num1/num2);
    return num1 / num2;
};

/**
 * Forwards the math operation to the correct math function based on the operator
 * TODO: You shouldn't be returning strings and numbers from this function. You need to figure out a different way to 
 *      handle the errors here than you're currently doing
 * @param {int} num1 
 * @param {String} operator 
 * @param {int} num2 
 */
const getMathAnswer = (parsedChoices) => {
    if (parsedChoices.length !== 3) {
        // Might want to put the error on the screen and return empty
        return `ERROR: Cannot handle more than 2 numbers and one operator. Received: ${parsedChoices}`;
    }

    // Add a try except around getting the nums and operator out
    const num1 = parsedChoices[0];
    const operator = parsedChoices[1];
    const num2 = parsedChoices[2];
    let ans = 0;
    switch (operator) {
        case OPERATORS[0]:
            // +
            ans = add(num1, num2);
            console.log("add: ", ans);
            return Number(ans.toFixed(2));
        case OPERATORS[1]:
            // -
            ans = subtract(num1, num2);
            console.log("subtract: ", ans);
            return Number(ans.toFixed(2));
        case OPERATORS[2]:
            // *
            ans = multiply(num1, num2);
            console.log("multiply: ", ans);
            return Number(ans.toFixed(2));
        case OPERATORS[3]:
            // /
            ans = divide(num1, num2);
            console.log("divide: ", ans);
            return Number(ans.toFixed(2));
        default:
            console.log("Big errors bro! We didn't match an operator!!", operator);
            return `ERROR determining math function to forward ${num1} and ${num2} to with operator ${operator}`;
    }
};

const backspace = () => {
    // TODO: implement backspace
}

/**
 * Clears the input from the screen
 * - The OPERATOR_CHOSEN flag needs to be set individually from each use case. DON'T DO IT HERE!!!
 */
const clearScreen = () => {
    const userInputVals = document.querySelectorAll("#inputVal");
    const ansOutput = document.querySelector("#ansOutput");
    const input = [...userInputVals];
    ansOutput && input.push(ansOutput);
    input.forEach((val) => {
        val.parentElement.removeChild(val);
    })
    DIVIDE_BY_ZERO = false;
    enableDecimal();
};

/**
 * Extracts the values from the buttons that were clicked and turns them into numbers and an
 * operator
 * Only handles two whole numbers and one operator
 * @param {Array} choiceArr Holds all the values from the buttons the user clicked
 * @returns {Array} Array with two numbers and the operator
 */
const parseInputNodesToString = (choiceArr) => {
    // TODO: Handle the decimal
    let num1New = "";
    let operatorNew = "";
    let num2New = "";
    console.log("choiceArr: ", choiceArr);
    choiceArr.forEach((element) => {
        const input = element.textContent;
        console.log("input: ", input);
        if (operatorNew.length === 0 && !OPERATORS.includes(input)) {
            num1New = num1New + input;
            console.log("num1New after update: ", num1New);
        } else if (operatorNew.length === 0 && OPERATORS.includes(input)) {
            operatorNew = operatorNew + input;
            console.log("operatorNew after update: ", operatorNew);
        } else {
            num2New = num2New + input;
            console.log("num2New after update: ", num2New);
        }
    })

    return [num1New, operatorNew, num2New];
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
    if (checkAnsOutput()) {
        // Clear the screen so we can start a new calculation when a number is chosen
        // after a previous calculation is complete
        clearScreen();
        // This is reseting the flag after a calculation is done when there was an equal on the screen
        OPERATOR_CHOSEN = false;
    }

    const inputDiv = document.querySelector("#userInput");
    const inputVal = document.createElement("span");
    inputVal.textContent = input.target.textContent; // get the value of the number clicked
    inputVal.id = "inputVal";
    inputDiv.appendChild(inputVal);
}

/**
 * Checks the DOM to determine if the result from the last calculation is on the screen
 * so we know how to proceed with the next operator click
 * @returns True if the result of the last calculation is on the screen
 */
const checkAnsOutput = () => {
    const ansOutput = document.querySelector("#ansOutput");
    return Boolean(ansOutput);
}

/**
 * 
 * @returns True if an operator or "=" is found
 */
const isOnlyNumber = () => {
    const inputElements = document.querySelectorAll("#inputVal");
    const userInput = [...inputElements];
    const operatorFound = userInput.find((element) => {
        return OPERATORS.includes(element.textContent) || element.textContent === "=";
    })
    if (operatorFound) {
        return false;
    } else {
        return true;
    }
}

/**
 * Checks if last user input was an operator
 * @returns True if the last input was an operator
 */
const isLastInputOperator = () => {
    const inputElements = document.querySelectorAll("#inputVal");
    const userInput = [...inputElements];
    
    const isLastInputOperator = OPERATORS.includes(userInput[userInput.length-1].textContent);

    return isLastInputOperator;
}

const disableDecimal = () => {
    DECIMAL_CLICKED = true;
    const decimal = document.querySelector("#decimal");
    decimal.disabled = true;
};

const enableDecimal = () => {
    DECIMAL_CLICKED = false;
    const decimal = document.querySelector("#decimal");
    decimal.disabled = false;
}

const handleDecimalClick = (decimal) => {
    const inputDiv = document.querySelector("#userInput");
    // Create the new Operator element
    const decimalString = decimal.target.textContent;
    const inputDecimal = document.createElement("span");
    inputDecimal.textContent = decimalString;
    inputDecimal.id = "inputVal";
    inputDiv.appendChild(inputDecimal);
    disableDecimal();
}

/**
 * Operator onClick handler
 * Sends calculation as if an equal sign was clicked when the operator is the second operator chosen
 * Then outputs the result to the screen with the new operator and the result as the left operand
 * @param {Obj} operator Event object for operator click
 */
const handleOperatorClick = (operator) => {
    // TODO: Disabled the decimal after it's been clicked once
    if (isLastInputOperator()) {
        const inputElements = document.querySelectorAll("#inputVal");
        const userInput = [...inputElements];
        const prevOperator = userInput[userInput.length-1];

        if (operator.target.textContent !== prevOperator.textContent) {
            prevOperator.parentElement.removeChild(prevOperator);
            OPERATOR_CHOSEN = false; // Flips the flag so it will drop into the first part and just append the new operator element
        } else {
            return; // Break, it's the same operator without a 2nd number so we don't try to do the math
        }  
    }

    const inputDiv = document.querySelector("#userInput");
    // Create the new Operator element
    const operatorString = operator.target.textContent;
    const inputOperator = document.createElement("span");
    inputOperator.textContent = operatorString;
    inputOperator.id = "inputVal";

    // if (operatorString === "." && DECIMAL_CLICKED === false) {
    //     disableDecimal();
    // } 
    // console.log("operator: ", operatorString);
    const isEqualOnScreen = checkAnsOutput();

    if (OPERATORS.includes(operatorString) && !OPERATOR_CHOSEN) {
        OPERATOR_CHOSEN = true;
        inputDiv.appendChild(inputOperator);
    } else if (OPERATORS.includes(operatorString) && OPERATOR_CHOSEN) {
        // This works to trigger the equals after a second operator click. 
        // But you need refactor so you're not calling an operator but just a math function
        if (!isEqualOnScreen) {
            // If there is not an equal sign on the screen, then we have 2 operands and the user
            // wants to do another calculation
            // If there is an "=" on the screen, the user wants to use the result of the last calculation
            // but we don't have 2 operands
            handleEqualSign();

        }

        // Put this here to prevent the next operator from being used
        if (DIVIDE_BY_ZERO === true) {
            return;
        }

        // Get the result of the last equation from the screen
        const ansOutput = document.querySelector("#ansOutput");
        const ans = ansOutput.textContent.split(" = ")[1];

        // Clear the screen so you can do the math in the dumb way that you're currently doing it
        clearScreen();

        // Create a new element to hold the new operand
        const newOperand = document.createElement("span");
        newOperand.textContent = ans;
        newOperand.id = "inputVal";

        // Add the new operand element to DOM list
        inputDiv.appendChild(newOperand)

        // Add the new operator to the new operand
        inputDiv.appendChild(inputOperator);
    }
}


/**
 * Gets the input from the screen and puts it into a global array as either an int or str
 * to be userd later
 * 
 * This function needs to also trigger the actual math functions
 */
const handleEqualSign = () => {
    if (isLastInputOperator() || isOnlyNumber() || checkAnsOutput()) {
        return;
    }
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

    enableDecimal();
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

    const decimal = document.createElement("button");
    decimal.className = "decimal";
    decimal.id = "decimal";
    decimal.textContent = ".";
    decimal.addEventListener("click", handleDecimalClick);
    numberBoard.appendChild(decimal);

    // Add the equal button with it's own onclick
    const equalButton = document.createElement("button");
    equalButton.className = "equals";
    equalButton.id = "equals";
    equalButton.textContent = "=";
    equalButton.addEventListener("click", handleEqualSign);
    numberBoard.appendChild(equalButton);

    // Add the clear button
    const allClearButton = document.createElement("button");
    allClearButton.className = "allClear";
    allClearButton.id = "allClear";
    allClearButton.textContent = "AC";
    allClearButton.addEventListener("click", handleClearClick);
    numberBoard.appendChild(allClearButton);

    const clearButton = document.createElement("button");
    clearButton.className = "clear";
    clearButton.id = "clear";
    clearButton.textContent = "C";
    clearButton.addEventListener("click", handleClearClick);
    numberBoard.appendChild(clearButton);
}

buildNums();