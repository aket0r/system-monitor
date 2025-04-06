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


const searchInput = document.querySelector("#search-process");
searchInput.addEventListener("input", function(event) {
    searchProcess(event);
});