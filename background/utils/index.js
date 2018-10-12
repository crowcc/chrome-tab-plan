import _ from 'lodash';
import browser from 'webextension-polyfill';

const { differenceWith, concat, uniqBy } = _;
export const getCurrentWindow = async () => {
  const currentWindow = await browser.windows.getCurrent();
  return currentWindow.id;
};

export const getTabsByWindow = windowId => browser.tabs.query({ windowId });

export const openAdminPage = async (windowId) => {
  // open only one in a window
  const tabs = await getTabsByWindow(windowId);
  const tabListsUrl = browser.runtime.getURL('index.html#/');
  const urls = tabs.map(item => item.url);
  if (urls.indexOf(tabListsUrl) < 0) {
    await browser.tabs.create({ url: tabListsUrl, windowId });
  } else {
    const currentAdminTab = tabs[urls.indexOf(tabListsUrl)];
    browser.tabs.highlight({ tabs: currentAdminTab.index, windowId: currentAdminTab.windowId });
  }
};

const saveTabs = async (newTabs, windowId) => {
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

  browser.runtime.getBackgroundPage().then((win) => {
    win.vuestore.commit('changeTabStore', tabstore.tabstore);
  });
  openAdminPage(windowId);
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
  saveTabs(normalTbas, windowId);
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

