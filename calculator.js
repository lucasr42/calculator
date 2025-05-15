const validateNum = (num) => {
    console.log("num: ", num);
    // if (num || Number.isNaN(num)) {
    //     return "ERROR";
    // }
    return (num && Number.isNaN(num));
}
const add = (num1, num2) => {
    if (validateNum(num1) || validateNum(num2)) return "ERROR";
    console.log(num1, num2, num1+num2);
    return num1 + num2;
};

const subtract = (num1, num2) => {
    return num1 - num2;
};

const multiply = (num1, num2) => {
    return num1 * num2;
};

const divide = (num1, num2) => {
    return num1 / num2;
};

/**
 * Builds the number pad for users to click numbers
 * Need to add an eventListener and a function to take the numbers and do something with them
 */
const buildNums = () => {
    let num = 1;
    const operators = ["+", "-", "*", "/", "="];
    const numberBoard = document.querySelector("#numberBoard");
    for (let i = 0; i < 3; i++) {
        for (let j = 1; j <= 3; j++) {
            const button = document.createElement("button");
            button.id = "number";
            button.textContent = num;
            numberBoard.appendChild(button);
            num++;
        }
        const lineBreak = document.createElement("br");
        numberBoard.appendChild(lineBreak);
    }
    operators.forEach((operator) => {
        const operatorButton = document.createElement("button");
        operatorButton.id = operator;
        operatorButton.textContent = operator;
        numberBoard.appendChild(operatorButton);
    })
}

buildNums();