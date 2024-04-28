import qs from 'qs';

import type { ActionReturnType } from '../../types';

import { AXIOS_TOKEN_KEY_IN_URL, IS_AIGRAM_IN_URL } from '../../../config';
import { buildCollectionByKey } from '../../../util/iteratees';
import { callApi } from '../../../api/gramjs';
import { addActionHandler, getGlobal, setGlobal } from '../../index';
import { addChats } from '../../reducers';

addActionHandler('changeMainTabStatus', (global, actions, payload): ActionReturnType => {
  const {
    newTab,
  } = payload!;

  return {
    ...global,
    mainTabStatus: newTab
  };
});

addActionHandler('initAigramFromApp', (global): ActionReturnType => {
  const params = qs.parse(window.location.search.slice(1));
  const isInApp = params[IS_AIGRAM_IN_URL] === '1';
  const tokenFromApp = (params[AXIOS_TOKEN_KEY_IN_URL] || '') as string;

  return {
    ...global,
    aigramIsInApp: isInApp,
    aigramTokenFromApp: isInApp ? tokenFromApp : '',
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

addActionHandler('searchAigramChat', async (global, actions, payload): Promise<void> => {
  const {
    name
  } = payload!;

  const result = await callApi('searchChats', { query: name });
  const {
    globalChats = [], accountChats = [],
  } = result || {};
  const chats = [...accountChats, ...globalChats];

  global = getGlobal();

  if (chats.length) {
    global = addChats(global, buildCollectionByKey(chats, 'id'));
  }

  setGlobal(global);
});
