
import browser from 'webextension-polyfill';
import { menulist } from './data/contextMenus';
import { openAdminPage } from './utils';

const generateContextMenus = () => {
  browser.contextMenus.removeAll();
  Object.keys(menulist).forEach((key) => {
    browser.contextMenus.create({
      id: key,
      title: browser.i18n.getMessage(menulist[key].title),
      contexts: [browser.contextMenus.ContextType.BROWSER_ACTION],
    });
  });
};

const contextMenusClickedHandler = (info) => {
  menulist[info.menuItemId].action();
};

const init = async () => {
  generateContextMenus();
  browser.contextMenus.onClicked.addListener(contextMenusClickedHandler);
  browser.browserAction.onClicked.addListener(async () => {
    openAdminPage();
  });
  // tab
  browser.storage.local.get('tabstore').then((items) => {
    if (items.tabstore) {
      window.vuexStore.commit('changeTabStore', items.tabstore);
    }
  });
  // todo
  browser.storage.local.get('todoVal').then((items) => {
    window.vuexStore.commit('changeTodoVal', items.todoVal);
  });
};
init();

