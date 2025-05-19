console.log('animations.js connected');

function searchProcess(e) {
    const processLengthElement = document.querySelector("#processes__page .processes-length");
    const allRows = document.querySelectorAll("tbody.container > tr");
    const visibleRows = [...allRows].filter(el => el.classList.contains("active"));

    const input = e.target.value.toLowerCase();
    const length = allRows.length - 2;

    if (allRows.length - 1 < 1) return;

    allRows.forEach(el => {
        const text = el.innerText.toLowerCase();

        if (input.trim() === "") {
            processLengthElement.innerText = length + 1;
            el.className = "active";
            return;
        }

        if (text.indexOf(input.trim()) > -1) {
            el.className = "active";
        } else {
            el.className = "hidden";
        }
        processLengthElement.innerText = visibleRows.length;
    });
}



const searchInput = document.querySelector("#search-network");

searchInput.addEventListener("input", function() {
    const elements = document.querySelectorAll("#os-info .network .container > li");
    const hiddenElements = document.querySelectorAll("#os-info .network .container > li.hidden");
    const message = document.querySelector("#os-info .network .container li.hidden-message");

    if (hiddenElements.length === elements.length) {
        message.classList.remove("hidden");
        message.classList.add("active");
    } else {
        message.classList.remove("active");
        message.classList.add("hidden");
    }

    if (this.value === "") {
        elements.forEach((el) => {
            el.classList.remove("hidden");
        });
        message.classList.remove("active");
        message.classList.add("hidden");
        return;
    }

    elements.forEach((el) => {
        const text = el.innerText.toLowerCase();
        if (text.indexOf(this.value.toLowerCase()) > -1) {
            el.classList.remove("hidden");
        } else {
            el.classList.add("hidden");
        }
    });
});


const valuesMode = document.querySelector(".type-of-show");
valuesMode.addEventListener("click", function() {
    const elements = document.querySelectorAll("#os-info .network .container > li");
    elements.forEach((el) => {
        el.classList.toggle("easy-mode");
    });

    let icon = this.querySelector('i');
    icon.className = icon.className === "fa-solid fa-eye" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
});