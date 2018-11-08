
import browser from 'webextension-polyfill';
import { menulist } from './data/contextMenus';
import { openAdminPage } from './utils';

const generateContextMenus = () => {
  Object.keys(menulist).forEach((key) => {
    browser.contextMenus.create({
      id: key,
      title: browser.i18n.getMessage(menulist[key].title),
      contexts: [browser.contextMenus.ContextType.BROWSER_ACTION],
    });
  });
};

const contextMenusClickedHandler = (info, tab) => {
  menulist[info.menuItemId].action(tab);
};

const init = async () => {
  const window = await browser.runtime.getBackgroundPage();
  if (!window.backgroundStart) {
    window.backgroundStart = true;
    generateContextMenus();
    browser.contextMenus.onClicked.addListener(contextMenusClickedHandler);
    browser.browserAction.onClicked.addListener(async (tab) => {
      openAdminPage(tab.windowId);
    });
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tab.url.indexOf('buttercup.com') > 0) {
        tab.url.split('#')[1].split('&').forEach((item) => {
          if (item.split('=')[0] === 'access_token') {
            browser.runtime.getBackgroundPage().then((win) => {
              win.vuestore.commit('changeToken', item.split('=')[1]);
              openAdminPage(tab.windowId);
              browser.tabs.remove(tabId);
            });
          }
        });
      }
    });
  }
};
init();

