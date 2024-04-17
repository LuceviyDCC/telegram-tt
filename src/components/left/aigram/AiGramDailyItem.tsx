import type { FC } from "../../../lib/teact/teact";
import React, { useCallback } from "../../../lib/teact/teact";
import { getActions } from "../../../global";

import buildClassName from "../../../util/buildClassName";
import { completeTask } from "../../../api/axios/task";

import Button from "../../ui/Button";
import { TaskType } from "./AiGramTaskItem";

import CompleteIcon from "../../../assets/aigram/complete.png";
import TaskGift from "../../../assets/aigram/gift.png";
import TaskGiftDisabled from "../../../assets/aigram/gift_disabled.png";

interface OwnProps {
  hasSigned: number;
  todayHasSigned: boolean;
  today: number;
  onComplete: () => void;
};

const DAY_LIST = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

const AiGramDailyItem: FC<OwnProps> = (props) => {
  const { hasSigned, today, todayHasSigned, onComplete } = props;

  const {
    showNotification,
  } = getActions();

  const onClick = useCallback(async () => {
    if (hasSigned !== today || todayHasSigned) {
      return;
    }

    const res = await completeTask(TaskType.DAILY);

    if (res.data.success) {
      onComplete();
      showNotification({ message: 'Task Completed !'});
    }
  }, [hasSigned, today, todayHasSigned, onComplete]);

  const realDate = todayHasSigned ? hasSigned - 1 : hasSigned;

  return (
    <Button
      className={buildClassName("daily__table-item", realDate === today && "today")}
      onClick={onClick}
    >
      {
        hasSigned > today && (
          <img src={CompleteIcon} className="daily__table-item-complete" alt="completeIcon" />
        )
      }
      <div className="daily__table-item-title">SCORE</div>
      {
        realDate < today ? (
          <span className="daily__table-item-score">10</span>
        ) : (
          <img
            src={realDate === today ? TaskGift : TaskGiftDisabled}
            className="daily__table-item-gift"
            alt="gift"
          />
        )
      }
      <div
        className={buildClassName(
          "daily__table-item-info",
          realDate === today && "active",
          realDate < today && "disabled"
        )}
      >
        {
          realDate === today ? "Today" : `${DAY_LIST[today]}`
        }
      </div>
    </Button>
  );
};

export default AiGramDailyItem;
