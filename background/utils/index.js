import { isObject, differenceWith, concat } from 'lodash';
import browser from 'webextension-polyfill';

export const getCurrentWindow = async () => {
  const currentWindow = await browser.windows.getCurrent();
  return currentWindow.id;
};
export const getAllInWindow = windowId => browser.tabs.query({ windowId });

// 打开管理页面
export const openAdminPage = async () => {
  // open only one in a window
  const window = await browser.runtime.getBackgroundPage();
  if (!isObject(window.appTabId)) window.appTabId = {};
  const windowId = await getCurrentWindow();
  const tabListsUrl = browser.runtime.getURL('index.html#/');
  if (windowId in window.appTabId) {
    const tabs = await getAllInWindow(windowId);
    const tab = tabs.find(item => item.id === window.appTabId[windowId]);
    if (tab) {
      if (tab.url.startsWith(tabListsUrl)) {
        return browser.tabs.update(tab.id, { active: true });
      }
      delete window.appTabId[windowId];
    }
  }
  const createdTab = await browser.tabs.create({ url: tabListsUrl });
  window.appTabId[windowId] = createdTab.id;
};
// 保存当前窗口所有标签页
export const saveAllCurrentWIndowTabs = async () => {
  const windowId = await getCurrentWindow();
  const tabs = await getAllInWindow(windowId);
  let normalTbas = tabs.filter(item => (!/^chrome/.test(item.url)));
  const tabstore = await browser.storage.local.get('tabstore');
  if (tabstore) {
    tabstore.tabstore.forEach((item) => {
      normalTbas = differenceWith(normalTbas, item.list, (a, b) => a.url === b.url);
    });
  }
  normalTbas = normalTbas.map(item => ({ title: item.title, url: item.url }));
  const oldTemp = tabstore.tabstore[0].list;
  tabstore.tabstore[0].list = concat(normalTbas, oldTemp);
  window.vuexStore.commit('changeTabStore', tabstore.tabstore);
};
