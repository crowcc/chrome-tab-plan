import browser from 'webextension-polyfill';

const syncLocalStorage = (storeMap) => {
  browser.storage.local.set(storeMap);
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
      syncLocalStorage({ tabstore });
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
    syncLocalStorage({ todoTodayVal: payload });
  }
  changeTodoVal(payload) {
    this.storageData.todoVal = payload;
    syncLocalStorage({ todoVal: payload });
  }
  newTablist() {
    this.storageData.tabstore.push({ title: 'new list', list: [] });
    syncLocalStorage({ tabstore: this.storageData.tabstore });
  }
  changeTabStore(payload) {
    this.storageData.tabstore = payload;
    syncLocalStorage({ tabstore: payload });
  }
  deleteTabList(payload) {
    this.storageData.tabstore.push({ title: 'new list', list: [] });
    if (payload === 0) {
      this.storageData.tabstore[0].list = [];
    } else {
      this.storageData.tabstore.splice(payload, 1);
    }
    syncLocalStorage({ tabstore: this.storageData.tabstore });
  }
  saveToken(payload) {
    this.storageData.gitToken = payload;
    syncLocalStorage({ gitToken: payload });
  }
}
