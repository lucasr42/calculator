
const OPERATORS = ["+", "-", "*", "/"];
let OPERATOR_CHOSEN = false;
let DIVIDE_BY_ZERO = false;
let DECIMAL_CLICKED = false;


const add = (num1, num2) => {
    num1 = Number(num1);
    num2 = Number(num2);

    return num1 + num2;
};

const subtract = (num1, num2) => {
    num1 = Number(num1);
    num2 = Number(num2);

    return num1 - num2;
};

const multiply = (num1, num2) => {
    num1 = Number(num1);
    num2 = Number(num2);

    return num1 * num2;
};

const divide = (num1, num2) => {
    if (num2 === "0") {
        DIVIDE_BY_ZERO = true;
        displayAnswer("Can't Divide By 0, Dummy 🤪! Press Clear or Pick a number to start over.");
        return;
    }

    num1 = Number(num1);
    num2 = Number(num2);

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
        displayAnswer(`ERROR: Cannot handle more than 2 numbers and one operator. Received: ${parsedChoices}`);
        return;
    }

    const num1 = parsedChoices[0];
    const operator = parsedChoices[1];
    const num2 = parsedChoices[2];
    let ans = 0;
    switch (operator) {
        case OPERATORS[0]:
            // +
            ans = add(num1, num2);
            return Math.round(ans * 100) / 100;
        case OPERATORS[1]:
            // -
            ans = subtract(num1, num2);
            return Math.round(ans * 100) / 100;
        case OPERATORS[2]:
            // *
            ans = multiply(num1, num2);
            return Math.round(ans * 100) / 100;
        case OPERATORS[3]:
            // /
            ans = divide(num1, num2);
            if (ans === undefined) return;
            return Math.round(ans * 100) / 100;
        default:
            console.log("Big errors bro! We didn't match an operator!!", operator);
            return `ERROR determining math function to forward ${num1} and ${num2} to with operator ${operator}`;
    }
};


/**
 * Outputs the result of a calculation to the screen, appending it within the main userInput div
 * @param {String} answer either a number of an error message
 */
const displayAnswer = (answer) => {
    const userInput = document.querySelector("#userInput");
    const ansElement = document.createElement("span");
    ansElement.className = "ansOutput";
    ansElement.id = "ansOutput";
    ansElement.textContent = " = " + answer;
    userInput.appendChild(ansElement);
}


/**
 * Allows user to delete the last thing put on the screen
 * Removes a whole answer, including the equal sign, and all number/input operators
 */
const backspace = () => {
    const userInputVals = document.querySelectorAll("#inputVal");
    const ansOutput = document.querySelector("#ansOutput");
    const input = [...userInputVals];
    ansOutput && input.push(ansOutput);
    
    // Can't backspace an empty screen
    if (input.length === 0) return;

    // Reset the DIVIDE BY ZERO FLAG if that's getting deleted so we can continue doing more math
    if (DIVIDE_BY_ZERO === true) {
        DIVIDE_BY_ZERO = false;
    }

    const last = input[input.length-1];
    if (OPERATORS.includes(last.textContent)) {
        OPERATOR_CHOSEN = false;
    } else if (last.textContent === ".") {
        enableDecimal();
    }
    last.parentElement.removeChild(last);
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
 * @param {Array} choiceArr Holds all the values from the buttons the user clicked
 * @returns {Array} Array with two numbers and the operator
 */
const parseInputNodesToString = (choiceArr) => {
    let num1New = "";
    let operatorNew = "";
    let num2New = "";

    choiceArr.forEach((element) => {
        const input = element.textContent;
        if (operatorNew.length === 0 && !OPERATORS.includes(input)) {
            num1New = num1New + input;
        } else if (operatorNew.length === 0 && OPERATORS.includes(input)) {
            operatorNew = operatorNew + input;
        } else {
            num2New = num2New + input;
        }
    })

    return [num1New, operatorNew, num2New];
};


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
    inputVal.className = "numOutput";
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


/**
 * Prevents the user from adding more than one decimal to a number
 */
const disableDecimal = () => {
    DECIMAL_CLICKED = true;
    const decimal = document.querySelector("#decimal");
    decimal.disabled = true;
};


/**
 * Called after an answer has been output to the screen to allow users to add a decimal to 
 * the result of the last equation
 */
const enableDecimal = () => {
    DECIMAL_CLICKED = false;
    const decimal = document.querySelector("#decimal");
    decimal.disabled = false;
}


/**
 * Handled separately from the operators to clearly separate it's ID and functionality (though it's mostly the same)
 * @param {String} decimal 
 */
const handleDecimalClick = (decimal) => {
    const inputDiv = document.querySelector("#userInput");
    // Create the new Operator element
    const decimalString = decimal.target.textContent;
    const inputDecimal = document.createElement("span");
    inputDecimal.textContent = decimalString;
    inputDecimal.id = "inputVal";
    inputDecimal.className = "operatorOutput";
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
    inputOperator.className = "operatorOutput";

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
        newOperand.className = "numOutput";

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

    if (answer === undefined) return;

    displayAnswer(answer);

    enableDecimal();
}


/**
 * Does a full clear of the board and resets the operator flag
 * 
 * This is for the Clear button so should reset the board. The OPERATOR_CHOSEN flag will be set differently
 * depending on the use case of the clearScreen() function so we're setting it here also
 */
const handleAllClearClick = () => {
    clearScreen();
    OPERATOR_CHOSEN = false;
}


/**
 * onClick handler for the backspace button
 */
const handleClearClick = () => {
    backspace();
}


/**
 * Builds the number pad for users to click numbers
 * Need to add an eventListener and a function to take the numbers and do something with them
 */
const buildNums = () => {
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
    allClearButton.addEventListener("click", handleAllClearClick);
    numberBoard.appendChild(allClearButton);

    const clearButton = document.createElement("button");
    clearButton.className = "clear";
    clearButton.id = "clear";
    clearButton.textContent = "C";
    clearButton.addEventListener("click", handleClearClick);
    numberBoard.appendChild(clearButton);
}


buildNums();