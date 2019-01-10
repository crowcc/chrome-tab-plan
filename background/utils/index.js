import _ from 'lodash';
import browser from 'webextension-polyfill';
import { changeTabStore } from './storage';

const { differenceWith, concat, uniqBy } = _;
export const getCurrentWindow = async () => {
  const currentWindow = await browser.windows.getCurrent();
  return currentWindow.id;
};

export const getTabsByWindow = windowId => browser.tabs.query({ windowId });

export const getCurrentTab = async () => {
  const windowId = await getCurrentWindow();
  const tabs = await getTabsByWindow(windowId);
  return tabs.filter(item => item.active)[0];
};

export const openAdminPage = async (windowId) => {
  // open only one in a window
  const tabs = await getTabsByWindow(windowId);
  const tabListsUrl = browser.runtime.getURL('index.html#/');
  const results = tabs.filter(item => item.url.indexOf(tabListsUrl) > -1);
  if (!results.length) {
    await browser.tabs.create({ url: tabListsUrl, windowId });
  } else {
    browser.tabs.highlight({ tabs: results[0].index, windowId: results[0].windowId });
  }
};

const saveTabs = async (newTabs, windowId) => {
  await openAdminPage(windowId);
  browser.tabs.remove(newTabs.map(item => item.id));
  const tabstore = await browser.storage.local.get('tabstore');
  if (tabstore) {
    tabstore.tabstore.forEach((item) => {
      newTabs = differenceWith(newTabs, item.list, (a, b) => a.url === b.url);
    });
  }
  newTabs = newTabs.map(item => ({ title: item.title, url: item.url }));
  const oldTemp = tabstore.tabstore[0].list;
  tabstore.tabstore[0].list = concat(newTabs, oldTemp);
  changeTabStore(tabstore.tabstore);
};

export const saveAllCurrentWIndowTabs = async (tab) => {
  let windowId;
  if (tab) {
    windowId = tab.windowId;
  } else {
    windowId = await getCurrentWindow();
  }
  const tabs = await getTabsByWindow(windowId);
  const normalTbas = tabs.filter(item => (!/^chrome/.test(item.url)));
  saveTabs(uniqBy(normalTbas, 'url'), windowId);
};

export const saveAllWIndowTabs = async (tab) => {
  const tabs = await getTabsByWindow();
  const normalTbas = tabs.filter(item => (!/^chrome/.test(item.url)));
  saveTabs(uniqBy(normalTbas, 'url'), tab.windowId);
};

export const saveCurrentTab = async (tab) => {
  if (tab) {
    saveTabs([tab], tab.windowId);
  }
};

