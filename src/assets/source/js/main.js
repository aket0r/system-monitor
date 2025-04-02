const os = require('os');
const process = require('process');
const child_process = require('child_process');
const psList = require('ps-list');
const timers = {};

function startTimer(label = 'default') {
    timers[label] = performance.now();
  }
  
  function endTimer(label = 'default') {
    const start = timers[label];
    if (!start) return console.warn(`Таймер "${label}" не был запущен`);
    const duration = performance.now() - start;
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    delete timers[label];
  
    return {
      ms: duration.toFixed(2)
    }
  }


class Content {
    constructor() {
        startTimer('loading content');
        Content.init();
        this.loadOSInfo();
    }

    static init() {
        const title = document.querySelector(".system-name h1");
        title.innerText = `${os.hostname()}`;
    }


    loadOSInfo() {
        const msContent = document.querySelector('#os-info .loading-time')
        const elements = 
        [
            'username', 'homedir', 'arch', 'release', 'type',
            'machine', 'tmpdir', 'platform', 'endianness',
            'totalmem', 'uptime'
        ];

        const methods = [
            os.userInfo().username, os.homedir(), os.arch, os.release(),
            os.type, os.machine(), os.tmpdir(), os.platform(), os.endianness(),
            (os.totalmem() / 1e9).toFixed(2), (os.uptime() / 60 / 60).toFixed(2)
        ]

        for (let i = 0; i < elements.length; i++) {
            let element = document.querySelector(`.${elements[i]} .context`);
            element.innerText = `${methods[i]}`;
        }
        const loadingTime = endTimer('loading content');
        msContent.innerText = `(${loadingTime.ms} ms.)`;

    }
}

const content = new Content();