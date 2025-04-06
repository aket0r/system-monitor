const processesList = [];



class ProcessesMethods {
    constructor() {
        this.loadProcesses();
    }

    async loadProcesses() {
        startTimer('loadProcesses');
        const processes = await psList.default();
        
        for (const process of processes) {
            processesList.push(process);
        }

        this.loadProcessesToHTML();
    }

    loadProcessesToHTML() {
        let endTimerData = endTimer('loadProcesses');
        for (let i = 0; i < processesList.length; i++) {
            this.createProcessHTML(processesList[i], i, endTimerData.ms);
        }
    }

    createProcessHTML(process, index, ms) {
        if (process.length === 0) throw Error('Cant load processes...');

        const { pid, ppid, name } = process;
        const path = document.querySelector("#processes__page table .container");
        const processLengthElement = document.querySelector("#processes__page #processes-title");
        const element = document.createElement("tr");
        element.classList.add("active");
        element.innerHTML = 
        `
            <td>${index}</td>
            <td title="${pid}">${pid}</td>
            <td title="${ppid}">${ppid}</td>
            <td title="${name}">${name}</td>
        `
        path.append(element);
        processLengthElement.innerHTML = `Processes: <span class="processes-length">${index}</span> <strong title="Loading time">(${ms} ms.)</strong>`;
    }
}


const initProcesses = new ProcessesMethods();