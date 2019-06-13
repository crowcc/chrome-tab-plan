import browser from 'webextension-polyfill';

const syncLocalStorage = (storeMap, updateTime = true) => {
  if (updateTime) {
    console.log('update timestamp');
    browser.storage.local.set({ ...storeMap, timestamp: new Date().getTime() });
  } else {
    browser.storage.local.set(storeMap);
  }
};

export default class StorageHandle {
  constructor() {
    this.storageData = {};
  }
  init() {
    browser.storage.local.get('tabstore').then((items) => {
      const tabstore = items.tabstore || [
        {
          identity: 'temptabs',
          collapse: false,
          list: [],
        },
      ];
      this.storageData.tabstore = tabstore;
      syncLocalStorage({ tabstore }, false);
      browser.runtime.onMessage.addListener((request) => {
        this[request.key](request.payload);
      });
    });
  }
  changeTabBlock(payload) {
    const { key, val, index } = payload;
    this.storageData.tabstore[index][key] = val;
    syncLocalStorage({ tabstore: this.storageData.tabstore });
  }
  changeTodoTodayVal(payload) {
    this.storageData.todoTodayVal = payload;
    syncLocalStorage({ todoTodayVal: this.storageData.todoTodayVal });
  }
  changeTodoVal(payload) {
    this.storageData.todoVal = payload;
    syncLocalStorage({ todoVal: this.storageData.todoVal });
  }
  newTablist(payload = {}) {
    console.log(this.storageData.tabstore);
    this.storageData.tabstore.push({ title: payload.name || 'new list', list: payload.list || [] });
    syncLocalStorage({ tabstore: this.storageData.tabstore });
  }
  changeTabStore(payload) {
    this.storageData.tabstore = payload;
    syncLocalStorage({ tabstore: this.storageData.tabstore });
  }
  deleteTabList(payload) {
    if (payload === 0) {
      this.storageData.tabstore[0].list = [];
    } else {
      this.storageData.tabstore.splice(payload, 1);
    }
    syncLocalStorage({ tabstore: this.storageData.tabstore });
  }
  saveToken(payload) {
    this.storageData.gitToken = payload;
    syncLocalStorage({ gitToken: this.storageData.gitToken }, false);
  }
}
