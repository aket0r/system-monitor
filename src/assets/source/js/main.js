const os = require("os");
const process = require("process");
const si = require("systeminformation");
const psList = require("ps-list");

const timers = {};
const SYSTEM_INFORMATION = {};

function startTimer(label = "default") {
  timers[label] = performance.now();
}

function endTimer(label = "default") {
  const start = timers[label];
  if (!start) return console.warn(`Таймер "${label}" не был запущен`);
  const duration = performance.now() - start;
  console.log(`${label}: ${duration.toFixed(2)}ms`);
  delete timers[label];

  return { ms: duration.toFixed(2) };
}

class Content {
  constructor() {
    startTimer("loading content");
    Content.init();
    this.loadOSInfo();
    startTimer("loading system info");
    this.loadAllSystemInfo();
  }

  static init() {
    const title = document.querySelector(".system-name h1");
    title.innerText = `${os.hostname()}`;
  }

  async getSystemInformation(methodName, key) {
    try {
      const data = await si[methodName]();
      SYSTEM_INFORMATION[key] = data;

      if (key === "networkConnections") {
        setTimeout(() => {
          this.loadNetworkContent({
            ms: 0.25
          });
        }, 1000);
      }
    } catch (e) {
      console.warn(`Error in ${methodName}:`, e);
    }
  }

  loadOSInfo() {
    const elements = [
      "username", "homedir", "arch", "release", "type",
      "machine", "tmpdir", "platform", "endianness",
      "totalmem", "uptime"
    ];

    const methods = [
      os.userInfo().username,
      os.homedir(),
      os.arch(),
      os.release(),
      os.type(),
      os.machine(),
      os.tmpdir(),
      os.platform(),
      os.endianness(),
      (os.totalmem() / 1e9).toFixed(2),
      (os.uptime() / 60 / 60).toFixed(2)
    ];

    for (let i = 0; i < elements.length; i++) {
      let element = document.querySelector(`.${elements[i]} .context`);
      if (element) element.innerText = `${methods[i]}`;
    }

    const loadingTime = endTimer("loading content");
  }

  async loadPriorityInfo() {
    const highPriorityMethods = [
      "cpu", "mem", "osInfo", "networkInterfaces", "networkConnections"
    ];

    const promises = highPriorityMethods.map(async (method) => {
      await this.getSystemInformation(method, method);
    });

    await Promise.all(promises);
  }

  async loadBackgroundInfo(batchSize = 5, delay = 300) {
    const methodNames = Object.keys(si).filter(
      (fn) => typeof si[fn] === "function"
    );

    const highPriority = [
      "cpu", "mem", "osInfo", "networkInterfaces", "networkConnections"
    ];

    const lowPriorityMethods = methodNames.filter(
      (m) => !highPriority.includes(m)
    );

    for (let i = 0; i < lowPriorityMethods.length; i += batchSize) {
      const batch = lowPriorityMethods.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (method) => {
          await this.getSystemInformation(method, method);
        })
      );

      await new Promise((res) => setTimeout(res, delay));
    }
  }

  async loadAllSystemInfo() {
    await this.loadPriorityInfo();
    this.loadBackgroundInfo(); // Не блокируем интерфейс
    const loadingTime = endTimer("loading system info");
    console.log("System info loaded in", loadingTime.ms, "ms");
    
    const msContent = document.querySelector("#os-info .loading-time");
    msContent.innerText = `(${loadingTime.ms} ms.)`;
  }

  loadNetworkContent(delay) {
    const path = document.querySelector("#os-info .network .container");
    const delayText = document.querySelector("#os-info .network h3 .length");
    let content = ``;

    for (const network of SYSTEM_INFORMATION.networkConnections || []) {
      content += `
        <li>localAddress: <span class="${network.localAddress ? 'default' : 'none'}">${network.localAddress || "none"}</span></li>
        <li>localPort: <span class="${network.localPort ? 'default' : 'none'}">${network.localPort || "none"}</span></li>
        <li>peerAddress: <span class="${network.peerAddress ? 'default' : 'none'}">${network.peerAddress || "none"}</span></li>
        <li>peerPort: <span class="${network.peerPort ? 'default' : 'none'}">${network.peerPort || "none"}</span></li>
        <li>pid: <span class="${network.pid ? 'default' : 'none'}">${network.pid || "none"}</span></li>
        <li>process: <span class="${network.process ? 'default' : 'none'}">${network.process || "none"}</span></li>
        <li>protocol: <span class="${network.protocol ? 'default' : 'none'}">${network.protocol || "none"}</span></li>
        <li>state: <span class="${network.state ? 'default' : 'none'}">${network.state || "none"}</span></li>
        <br>
      `;
    }

    if (delayText) delayText.innerText = `(${delay.ms} ms.)`;
    if (path) path.innerHTML = content;
  }
}

const content = new Content();
