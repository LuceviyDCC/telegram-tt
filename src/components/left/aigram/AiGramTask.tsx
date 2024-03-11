import { type FC,memo, useEffect,useState } from "../../../lib/teact/teact";
import React from "../../../lib/teact/teact";
import { withGlobal } from "../../../global";

import buildClassName from "../../../util/buildClassName";

import Button from "../../ui/Button";
import AiGramFooter from "./AiGramFooter";

import './AiGramTask.scss';

import CompleteIcon from '../../../assets/aigram/complete.png';
import TaskGift from '../../../assets/aigram/gift.png';
import TaskGiftDisabled from '../../../assets/aigram/gift_disabled.png';
import AIScoreBtnIcon from '../../../assets/aigram/score.png';
import AITips from '../../../assets/aigram/score_q.png';

interface StateProps {};

const DAILY_NUM = 7;

const DAILY_NORMAL_LIST: Array<undefined> = [undefined, undefined,undefined,undefined,undefined, undefined];

const AiGramTask: FC<StateProps> = () => {
  const [score, setScore] = useState(0);
  const [hasSigned, setHasSigned] = useState(0);

  useEffect(() => {
    setScore(10023);
    setHasSigned(3);
  }, []);

  return (
    <div id="AiGram_Task" className="aigram__task">
      <div className="aigram__task-header">
        <div className="aigram__task-header-title">AiGram</div>
        <div className="aigram__task-header-detail">积分明细</div>
      </div>
      <div className="aigram__task-main">
        <div className="total__score">
          <div className="total__score-detail">
            <div className="total__score-detail-title">
              AI Score
              <img className="total__score-detail-tips" src={AITips} alt="tips" />
            </div>
            <div className="total__score-detail-num">{score}</div>
          </div>
          <Button className="total__score-exchange">
            <img className="total__score-exchange-icon" src={AIScoreBtnIcon} alt="score" />
            积分兑换
          </Button>
        </div>
        <div className="daily__table">
          <div className="daily__table-title">连续签到获取分数</div>
          <div className="daily__table-list">
            <div className="daily__table-sublist">
              {
                DAILY_NORMAL_LIST.map((_, index) => (
                  <div className="daily__table-item">
                    {
                      hasSigned > index && (
                        <img src={CompleteIcon} className="daily__table-item-complete" alt="completeIcon" />
                      )
                    }
                    <div className="daily__table-item-title">领积分</div>
                    {
                      hasSigned < index ? (
                        <span className="daily__table-item-score">10</span>
                      ) : (
                        <img
                          src={hasSigned === index ? TaskGift : TaskGiftDisabled}
                          className="daily__table-item-gift"
                          alt="gift"
                        />
                      )
                    }
                    <div
                      className={buildClassName(
                        "daily__table-item-info",
                        hasSigned === index && "active",
                        hasSigned < index && "disabled"
                      )}
                    >
                      {
                        hasSigned === index ? '今天' : `第${index + 1}天`
                      }
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="daily__table-target">
              <div className="daily__table-item">
                {
                  hasSigned > DAILY_NUM - 1 && (
                    <img src={CompleteIcon} className="daily__table-item-complete" alt="completeIcon" />
                  )
                }
                <div className="daily__table-item-title">领积分</div>
                {
                  hasSigned < DAILY_NUM - 1 ? (
                    <span className="daily__table-item-score">10</span>
                  ) : (
                    <img
                      src={hasSigned === DAILY_NUM - 1 ? TaskGift : TaskGiftDisabled}
                      className="daily__table-item-gift"
                      alt="gift"
                    />
                  )
                }
                <div
                  className={buildClassName(
                    "daily__table-item-info",
                    hasSigned === DAILY_NUM - 1 && "active",
                    hasSigned < DAILY_NUM - 1 && "disabled"
                  )}
                >
                  {
                    hasSigned === DAILY_NUM - 1 ? '今天' : `第${DAILY_NUM}天`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AiGramFooter />
    </div>
  );
};

export default memo(withGlobal(
  (global): StateProps => {
    return {
      authState: global.authState,
    };
  },
)(AiGramTask));
