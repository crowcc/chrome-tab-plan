
import browser from 'webextension-polyfill';

const syncLocalStorage = (storeMap) => {
  browser.storage.local.set(storeMap);
};

export function changeTodoTodayVal(payload) {
  syncLocalStorage({ todoTodayVal: payload });
}
export function changeTodoVal(payload) {
  syncLocalStorage({ todoVal: payload });
}
export function changeTabStore(payload) {
  syncLocalStorage({ tabstore: payload });
}
export function changeTabBlock(payload) {
  const { key, val, index } = payload;
  browser.storage.local.get('tabstore').then((items) => {
    const tabstore = items.tabstore;
    tabstore[index][key] = val;
    syncLocalStorage({ tabstore });
  });
}
export function newTablist() {
  browser.storage.local.get('tabstore').then((items) => {
    const tabstore = items.tabstore;
    tabstore.push({ title: 'new list', list: [] });
    syncLocalStorage({ tabstore });
  });
}
export function deleteTabList(payload) {
  browser.storage.local.get('tabstore').then((items) => {
    const tabstore = items.tabstore;
    if (payload === 0) {
      tabstore[0].list = [];
    } else {
      tabstore.splice(payload, 1);
    }
    syncLocalStorage({ tabstore });
  });
}
