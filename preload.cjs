const { contextBridge, ipcRenderer } = require('electron');

// 모든 Node.js API를 preload 스크립트에서 사용할 수 있도록 허용합니다.
// 또한, 신뢰할 수 있는 Node.js 컨텍스트를 전역에 노출합니다.
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    once: (channel, func) => ipcRenderer.once(channel, (event, ...args) => func(...args))
  }
});
