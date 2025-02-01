const passwordLengthInput = document.getElementById("passwordLength");
const passwordLengthValue = document.getElementById("passwordLengthValue");
const generatePasswordButton = document.getElementById("generatePasswordButton");
const copyButton = document.getElementById("copyButton");
const passwordOutput = document.getElementById("passwordOutput");

passwordLengthInput.addEventListener("input", () => {
    passwordLengthValue.textContent = passwordLengthInput.value;
});

function generatePassword() {
    const length = parseInt(passwordLengthInput.value) || 12;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeLowercase = document.getElementById("includeLowercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;

    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_-+=<>?";

    if (charset === "") {
        alert("Please select at least one character type.");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    passwordOutput.value = password;
}

function copyToClipboard() {
    if (passwordOutput.value) {
        passwordOutput.select();
        document.execCommand("copy");

        copyButton.textContent = "Copied!";
        setTimeout(() => {
            copyButton.textContent = "Copy";
        }, 1500);
    }
}

generatePasswordButton.addEventListener("click", generatePassword);

copyButton.addEventListener("click", copyToClipboard);
