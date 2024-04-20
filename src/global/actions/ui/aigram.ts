import type { ActionReturnType } from '../../types';

import { addActionHandler } from '../../index';

addActionHandler('changeMainTabStatus', (global, actions, payload): ActionReturnType => {
  const {
    newTab,
  } = payload!;

  return {
    ...global,
    mainTabStatus: newTab
  };
});

addActionHandler('initAigramTaskList', (global, actions, payload): ActionReturnType => {
  const {
    taskList,
  } = payload!;

  return {
    ...global,
    aigramTaskList: taskList
  };
});
