const inputSlider = document.querySelector("#data-lengthSlider");
const lengthDisplay = document.querySelector("#data-lengthNumber");

const passwordDisplay = document.querySelector("#data-passwordDisplay");
const copyBtn = document.querySelector("#data-copy");
const copyMsg = document.querySelector("#data-copyMsg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("#data-indicator");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// set password Length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}


// Set indicator for strength
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


// Generate Random numbers, letters,symbols
function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateNumbers() {
    return getRandInteger(0, 9);
}
function generateUppercase() {
    return String.fromCharCode(getRandInteger(65, 91));
}
function generateLowercase() {
    return String.fromCharCode(getRandInteger(97, 123));
}
function generateSymbols() {
    const randNumber = getRandInteger(0, symbols.length);
    return symbols.charAt(randNumber);
}


// Calculate Strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) {
        hasUpper = true;
    }
    if (lowercaseCheck.checked) {
        hasLower = true;
    }
    if (numbersCheck.checked) {
        hasNum = true;
    }
    if (symbolsCheck.checked) {
        hasSym = true;
    }
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}


// copy the password
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


// add event listener on slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


// add event listener on copy button
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})


// add event Listener on checkbox

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        checkCount = 0;
        allCheckBox.forEach((checkbox) => {
            if(checkbox.checked){
                checkCount++;
            }
        })
        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    });
});



// function shufflePassword using fisher-yates method
function shufflePassword(password) {
    const passwordArr = password.split(''); // Convert the password string to an array
    for (let i = passwordArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
      [passwordArr[i], passwordArr[j]] = [passwordArr[j], passwordArr[i]]; // Swap the values at indices i and j
    }
    return passwordArr.join(''); // Convert the shuffled array back to a string
}



//  generate password and also add eventListener on it
generateBtn.addEventListener('click', () => {
    if(checkCount==0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old password
    password = "";

    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateUppercase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowercase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateNumbers);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbols);
    }

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remaining adddition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    const shuffledPassword = shufflePassword(password);

    //show in UI
    passwordDisplay.value = shuffledPassword;

    //calculate strength
    calcStrength();
})




