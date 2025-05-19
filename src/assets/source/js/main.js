const os = require("os");
const process = require("process");
const si = require("systeminformation");
const psList = require("ps-list");

const timers = {};
const SYSTEM_INFORMATION = {};

let index = 0;

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
    if (
      methodName === undefined ||
      methodName === null ||
      methodName === "observe"
    ) {
      console.error(`Method "${methodName}" is not provided`);
      return;
    } else {
      console.log(`Loading ${methodName}...`);
    }

    try {
      const data = await si[methodName]();
      SYSTEM_INFORMATION[key] = data;

      if (key === "networkConnections") {
        setTimeout(() => {
          this.loadNetworkContent({
            ms: 0.25,
          });
        }, 1000);
      }
    } catch (e) {
      console.warn(`Error in ${methodName}:`, e);
    }
  }

  loadOSInfo() {
    const elements = [
      "username",
      "homedir",
      "arch",
      "release",
      "type",
      "machine",
      "tmpdir",
      "platform",
      "endianness",
      "totalmem",
      "uptime",
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
      Math.floor(os.uptime() / 3600) + " hrs.",
    ];

    for (let i = 0; i < elements.length; i++) {
      let element = document.querySelector(`.${elements[i]} .context`);
      if (element) element.innerText = `${methods[i]}`;
    }

    const loadingTime = endTimer("loading content");
  }

  async loadPriorityInfo() {
    const highPriorityMethods = [
      "cpu",
      "mem",
      "osInfo",
      "networkInterfaces",
      "networkConnections",
    ];

    const promises = highPriorityMethods.map(async (method) => {
      if (method === "get") return;
      await this.getSystemInformation(method, method);
    });

    await Promise.all(promises);
  }

  async loadBackgroundInfo(batchSize = 5, delay = 300) {
    const methodNames = Object.keys(si).filter(
      (fn) => typeof si[fn] === "function"
    );

    const highPriority = [
      "cpu",
      "mem",
      "osInfo",
      "networkInterfaces",
      "networkConnections",
    ];

    const lowPriorityMethods = methodNames.filter(
      (m) => !highPriority.includes(m)
    );

    for (let i = 0; i < lowPriorityMethods.length; i += batchSize) {
      const batch = lowPriorityMethods.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (method) => {
          if (method === "get") return;
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
  const networkLengthElement = document.querySelector(".network-length");
  let content = 
  `
    <li class="hidden-message">
        <img src="assets/images/empty.png" width="200px" alt="">
        it's empty here
    </li>
    <br>
  `;
  let index = 0;

  const seen = new Set();

  const normalizePair = (a, b) => {
    return a < b ? `${a}<->${b}` : `${b}<->${a}`;
  };

  const filteredConnections = SYSTEM_INFORMATION.networkConnections
    .filter(network =>
      network.localAddress &&
      network.peerAddress &&
      network.localAddress !== '127.0.0.1' &&
      network.peerAddress !== '127.0.0.1' &&
      !network.localAddress.includes("�")
    )
    .filter(network => {
      const key = normalizePair(network.localAddress, network.peerAddress);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  for (const network of filteredConnections) {
    content += `
      <li>localAddress: <span class="default">${network.localAddress}</span></li>
      <li>peerAddress: <span class="default">${network.peerAddress}</span></li>
      <li>localPort: <span class="default">${network.localPort || "none"}</span></li>
      <li>peerPort: <span class="default">${network.peerPort || "none"}</span></li>
      <li>pid: <span class="default">${network.pid || "none"}</span></li>
      <li>process: <span class="default">${network.process || "none"}</span></li>
      <li>protocol: <span class="default">${network.protocol || "none"}</span></li>
      <li>state: <span class="default">${network.state || "none"}</span></li>
      <br>
    `;
    index++;
  }

  if (networkLengthElement) networkLengthElement.innerText = `Network connections: ${index}`;
  if (delayText) delayText.innerText = `(${delay.ms} ms.)`;
  if (path) path.innerHTML = content;
}

}

const content = new Content();
