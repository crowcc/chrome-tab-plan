import { saveCurrentTab, saveAllCurrentWindowTabs, saveAllWIndowTabs } from '../utils';

export const menulist = {
  SAVEONE: {
    title: 'storeCurrentTab',
    action: (tab) => {
      saveCurrentTab(tab);
    },
  },
  SAVECURRENTALL: {
    title: 'storeCurrentWindowTabs',
    action: (tab) => {
      saveAllCurrentWindowTabs(tab);
    },
  },
  SAVEALL: {
    title: 'storeAllWindowTabs',
    action: (tab) => {
      saveAllWIndowTabs(tab);
    },
  },
};

