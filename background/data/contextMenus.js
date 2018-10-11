import { openAdminPage, saveAllCurrentWIndowTabs } from '../utils';

export const menulist = {
  SHOWADMINPAGE: {
    title: 'showAdminPage',
    action: () => {
      openAdminPage();
    },
  },
  SAVEONE: {
    title: 'storeCurrentTab',
    action: () => {
      console.log('保存当前页面标签');
    },
  },
  SAVECURRENTALL: {
    title: 'storeCurrentWindowTabs',
    action: () => {
      saveAllCurrentWIndowTabs();
    },
  },
  SAVEALL: {
    title: 'storeAllWindowTabs',
    action: () => {
      console.log('保存所有窗口标签');
    },
  },
};

export const aaa = 5;

