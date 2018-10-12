
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
  }
};
init();

