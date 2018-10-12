import { openAdminPage, saveCurrentTab, saveAllCurrentWIndowTabs, saveAllWIndowTabs } from '../utils';

export const menulist = {
  SHOWADMINPAGE: {
    title: 'showAdminPage',
    action: (tab) => {
      openAdminPage(tab.windowId);
    },
  },
  SAVEONE: {
    title: 'storeCurrentTab',
    action: (tab) => {
      saveCurrentTab(tab);
    },
  },
  SAVECURRENTALL: {
    title: 'storeCurrentWindowTabs',
    action: (tab) => {
      saveAllCurrentWIndowTabs(tab);
    },
  },
  SAVEALL: {
    title: 'storeAllWindowTabs',
    action: (tab) => {
      saveAllWIndowTabs(tab);
    },
  },
};

