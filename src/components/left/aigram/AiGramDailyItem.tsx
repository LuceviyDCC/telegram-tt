import type { FC } from "../../../lib/teact/teact";
import React from "../../../lib/teact/teact";

import buildClassName from "../../../util/buildClassName";

import CompleteIcon from "../../../assets/aigram/complete.png";
import TaskGift from "../../../assets/aigram/gift.png";
import TaskGiftDisabled from "../../../assets/aigram/gift_disabled.png";

interface OwnProps {
  hasSigned: number;
  today: number;
};

const AiGramDailyItem: FC<OwnProps> = (props) => {
  const { hasSigned, today } = props;
  return (
    <div
      className={buildClassName("daily__table-item", hasSigned === today && "today")}
    >
      {
        hasSigned > today && (
          <img src={CompleteIcon} className="daily__table-item-complete" alt="completeIcon" />
        )
      }
      <div className="daily__table-item-title">领积分</div>
      {
        hasSigned < today ? (
          <span className="daily__table-item-score">10</span>
        ) : (
          <img
            src={hasSigned === today ? TaskGift : TaskGiftDisabled}
            className="daily__table-item-gift"
            alt="gift"
          />
        )
      }
      <div
        className={buildClassName(
          "daily__table-item-info",
          hasSigned === today && "active",
          hasSigned < today && "disabled"
        )}
      >
        {
          hasSigned === today ? "今天" : `第${today + 1}天`
        }
      </div>
    </div>
  );
};

export default AiGramDailyItem;
