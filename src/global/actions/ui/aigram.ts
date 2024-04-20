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

addActionHandler('updateAigramTotalScore', (global, actions, payload): ActionReturnType => {
  const {
    score,
  } = payload!;

  return {
    ...global,
    aigramTotalScore: score
  };
});

addActionHandler('updateAigramInviteCode', (global, actions, payload): ActionReturnType => {
  const {
    code,
  } = payload!;

  return {
    ...global,
    aigramInviteCode: code
  };
});

addActionHandler('updateAigramSignedInfo', (global, actions, payload): ActionReturnType => {
  const {
    hasSigned,
    todaySigned
  } = payload!;

  return {
    ...global,
    aigramHasSigned: typeof hasSigned === 'undefined' ? global.aigramHasSigned : hasSigned,
    aigramTodaySigned: typeof todaySigned === 'undefined' ? global.aigramTodaySigned : todaySigned,
  };
});
