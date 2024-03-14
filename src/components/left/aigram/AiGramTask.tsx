import { type FC,memo, useEffect,useState } from "../../../lib/teact/teact";
import React from "../../../lib/teact/teact";
import { withGlobal } from "../../../global";

import type { TaskItem } from "./AiGramTaskItem";

import { getTaskInfo, getTaskList } from "../../../api/axios/task";

import Button from "../../ui/Button";
import AiGramDailyItem from './AiGramDailyItem';
import AiGramFooter from "./AiGramFooter";
import AiGramTaskItem from "./AiGramTaskItem";

import './AiGramTask.scss';

import AIScoreBtnIcon from '../../../assets/aigram/score.png';
import AITips from '../../../assets/aigram/score_q.png';

interface StateProps {};

const DAILY_NUM = 7;

const DAILY_NORMAL_LIST: Array<undefined> = [undefined, undefined,undefined,undefined,undefined, undefined];

const AiGramTask: FC<StateProps> = () => {
  const [score, setScore] = useState(0);
  const [hasSigned, setHasSigned] = useState(0);
  const [taskList, setTaskList] = useState<TaskItem[]>([]);

  useEffect(() => {
    initTaskInfo();
    initTaskList();
    setHasSigned(3);
    setTaskList([
      {
        type: 0,
        title: '绑定 Telegram 账号奖励10-1M AI score',
        content: ['免费使用会员功能', '训练你的AI并获得更多积分', '完美支持所有Telegram功能'],
        tips: '123'
      }
    ]);
  }, []);

  async function initTaskInfo () {
    const res = await getTaskInfo();

    setScore(res.total_score);
  }

  async function initTaskList() {
    const res = await getTaskList();

    // eslint-disable-next-line no-console
    console.log(res);
  }

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
            <span className="total__score-exchange-txt">积分兑换</span>
          </Button>
        </div>
        <div className="daily__table">
          <div className="daily__table-title">连续签到获取分数</div>
          <div className="daily__table-list">
            <div className="daily__table-sublist">
              {
                DAILY_NORMAL_LIST.map((_, index) => (
                  <AiGramDailyItem hasSigned={hasSigned} today={index} />
                ))
              }
            </div>
            <div className="daily__table-target">
              <AiGramDailyItem hasSigned={hasSigned} today={DAILY_NUM - 1} />
            </div>
          </div>
        </div>
        <div className="task__list">
          {
            taskList.map(task => (
              <AiGramTaskItem key={task.type} taskInfo={task} />
            ))
          }
          <div className="more-task">
            更多奖励即将开始
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
