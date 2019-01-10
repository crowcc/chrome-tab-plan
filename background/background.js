
import browser from 'webextension-polyfill';
import { menulist } from './data/contextMenus';
import { openAdminPage, getCurrentTab } from './utils';

console.log(process.env.NODE_ENV);

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

const addCommand = () => {
  browser.commands.onCommand.addListener(async (command) => {
    const currentTab = await getCurrentTab();
    menulist[command].action(currentTab);
  });
};
const init = async () => {
  const window = await browser.runtime.getBackgroundPage();
  if (!window.backgroundStart) {
    window.backgroundStart = true;
    browser.storage.local.get('tabstore').then((items) => {
      if (!items.tabstore) {
        browser.storage.local.set({
          tabstore: [{
            identity: 'temptabs',
            collapse: false,
            list: [],
          }],
        });
      }
    });
    generateContextMenus();
    addCommand();
    browser.contextMenus.onClicked.addListener(contextMenusClickedHandler);
    browser.browserAction.onClicked.addListener(async (tab) => {
      openAdminPage(tab.windowId);
    });
  }
};
init();

