import { type FC,memo, useCallback } from "../../../lib/teact/teact";
import React from "../../../lib/teact/teact";
import { getActions,withGlobal } from "../../../global";

import { MainTabStatus } from "../../../types";

import buildClassName from "../../../util/buildClassName";

import './AiGramFooter.scss';

import Home from '../../../assets/aigram/aigram_home.png';
import HomeActive from '../../../assets/aigram/aigram_home_active.png';
import TaskActive from '../../../assets/aigram/aigram_task.png';
import Task from '../../../assets/aigram/aigram_task_disabled.png';

interface StateProps {
  mainTabStatus: MainTabStatus;
};

const AiGramFooter: FC<StateProps> = ({
  mainTabStatus
}) => {
  const {
    changeMainTabStatus
  } = getActions();

  const handleChangeTabStatus = useCallback((newTab: MainTabStatus) => {
    return changeMainTabStatus({
      newTab
    });
  }, [changeMainTabStatus]);

  return (
    <div
      id="AiGram_Footer"
      className={buildClassName(
        "AiGram_Footer",
        mainTabStatus === MainTabStatus.AiGram && "aigram"
      )}
    >
      <div
        className={buildClassName("tab__item", mainTabStatus === MainTabStatus.TeleGram && "active")}
        onClick={() => handleChangeTabStatus(MainTabStatus.TeleGram)}
      >
        <img
          className="tab__item-icon"
          alt="Chats"
          src={mainTabStatus === MainTabStatus.TeleGram ? HomeActive : Home}
          style='top: 0.125rem'
        />
        Chats
      </div>
      <div
        className={buildClassName("tab__item", mainTabStatus === MainTabStatus.AiGram && "active")}
        onClick={() => handleChangeTabStatus(MainTabStatus.AiGram)}
      >
        <img
          className="tab__item-icon"
          alt="Chats"
          src={mainTabStatus === MainTabStatus.AiGram ? TaskActive : Task}
        />
        AiGram
      </div>
    </div>
  );
};

export default memo(withGlobal(
  (global): StateProps => {
    return {
      mainTabStatus: global.mainTabStatus || MainTabStatus.TeleGram,
    };
  },
)(AiGramFooter));
