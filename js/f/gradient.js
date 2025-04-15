class Gradient {
    constructor(colors = ['#F8D4F1', '#CECCF4'], positions = [0, 50]) {
        this.colors = colors;
        this.positions = positions;
    }

    generateCode(container, angle, code) {
        const gradientString = `linear-gradient(${angle}deg, ${this.colors[0]} ${this.positions[0]}%, ${this.colors[1]} ${this.positions[1]}%)`;
        code.value = `background-image: ${gradientString};`;
        container.style.backgroundImage = gradientString;
    }

    generateRandom(container, angle, code) {
        this.colors = this.colors.map(() =>
            '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
        );
        this.generateCode(container, angle, code);
        document.querySelector('#color1').value = this.colors[0];
        document.querySelector('#color2').value = this.colors[1];
    }
}

const container = document.querySelector('.gradient-preview-container');
const code = document.querySelector('.code');
const random = document.querySelector('.random');
const scale = document.querySelector('#scale');
const position = document.querySelector('#position');
const color1 = document.querySelector('#color1');
const color2 = document.querySelector('#color2');
const copyWrapper = document.querySelector('.copy-wrapper');

color1.value = '#F8D4F1';
color2.value = '#CECCF4';

let angle = 90;
let gradient = new Gradient();

gradient.generateCode(container, angle, code);

scale.addEventListener('input', function () {
    angle = this.value;
    gradient.generateCode(container, angle, code);
});

position.addEventListener('input', function () {
    gradient.positions[1] = parseInt(this.value);
    gradient.generateCode(container, angle, code);
});

[color1, color2].forEach((input, index) => {
    input.addEventListener('input', function () {
        gradient.colors[index] = this.value;
        gradient.generateCode(container, angle, code);
    });
});

random.addEventListener('click', function () {
    gradient.generateRandom(container, angle, code);
});

function copyToClipboard(targetId, wrapper) {
    const input = document.getElementById(targetId);
    if (input) {
        input.select();
        document.execCommand("copy");

        wrapper.style.setProperty("--copy-text", '"Copied!"');

        wrapper.classList.add("copied");

        setTimeout(() => {
            wrapper.classList.remove("copied");
            wrapper.style.setProperty("--copy-text", '"Copy"');
        }, 1000);
    }
}

document.querySelectorAll(".copy-wrapper img.copy-button").forEach((img) => {
    img.addEventListener("click", function () {
        const wrapper = this.parentElement;
        const targetId = wrapper.getAttribute("data-copy-target");
        copyToClipboard(targetId, wrapper);
    });
});
