
import browser from 'webextension-polyfill';
import store from 'ui/store';
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
  browser.storage.local.get('temptabs').then((items) => {
    store.commit('changeTemp', { val: items.temptabs });
  });
  browser.storage.local.get('tabstore').then((items) => {
    if (items.tabstore) {
      store.commit('changeTabStore', items.tabstore);
    }
  });
  // todo
  browser.storage.local.get('todoVal').then((items) => {
    store.commit('changeTodoVal', items.todoVal);
  });
};
export default store;
init();
