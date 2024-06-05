import { type FC,memo, useCallback, useEffect } from "../../../lib/teact/teact";
import React from "../../../lib/teact/teact";
import { getActions, withGlobal } from "../../../global";

import type { TaskItem } from "./AiGramTaskItem";
import { AiGramPageStatus } from "../../../types";

import { LAYERS_ANIMATION_NAME } from "../../../util/windowEnvironment";
import { getTaskInfo, getTaskList } from "../../../api/axios/task";

import Button from "../../ui/Button";
import Transition from "../../ui/Transition";
import AiGramDailyItem from './AiGramDailyItem';
import AiGramFooter from "./AiGramFooter";
import AiGramTaskItem, { TaskType } from "./AiGramTaskItem";
import EventList from "./event/EventList";
import AiGramScoreDetail from "./scoreDetail/AiGramScoreDetail";

import './AiGramTask.scss';

import AIScoreBtnIcon from '../../../assets/aigram/score.png';
import AITips from '../../../assets/aigram/score_q.png';


interface StateProps {
  score: number;
  hasSigned: number;
  todayHasSigned: boolean;
  inviteCode: string;
  taskList: TaskItem[];
  isInApp: boolean;
  pageStatus: AiGramPageStatus;
};

const DAILY_NUM = 7;

const DAILY_NORMAL_LIST: Array<undefined> = [undefined, undefined,undefined,undefined,undefined, undefined];

const AiGramTask: FC<StateProps> = ({
  score,
  hasSigned,
  todayHasSigned,
  inviteCode,
  taskList,
  isInApp,
  pageStatus,
}) => {
  const {
    initAigramTaskList,
    updateAigramInviteCode,
    updateAigramSignedInfo,
    updateAigramTotalScore,
    changeAiGramPage,
  } = getActions();

  useEffect(() => {
    initTaskInfo();
    initTaskList();
  }, []);

  async function initTaskInfo () {
    try {
      const res = await getTaskInfo();

      updateAigramTotalScore({score: res.total_score || 0});
      updateAigramInviteCode({code: res.invite_code || ''});
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  async function initTaskList() {
    try {
      const res = await getTaskList();

      const tmpTaskList: TaskItem[] = [];

      (res || []).forEach(task => {
        if (task.task_info.id === TaskType.DAILY) {
          updateAigramSignedInfo({
            hasSigned: task?.finish_count || 0,
            todaySigned: !!task.today_finished
          });
        } else {
          tmpTaskList.push({
            type: task?.task_info.id,
            title: task.task_info?.name,
            content: task.task_info?.description?.split(','),
            tips: task.task_info?.tip_text,
          });
        }
      });

      initAigramTaskList({ taskList: tmpTaskList });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  function handleToDetail () {
    changeAiGramPage({ pageStatus: AiGramPageStatus.ScoreDetail });
  }

  const handleToEventList = useCallback(() => {
    changeAiGramPage({ pageStatus: AiGramPageStatus.EventList });
  }, []);

  const handleCompleteDaily = useCallback(() => {
    updateAigramSignedInfo({
      hasSigned: hasSigned + 1,
      todaySigned: true
    });
    initTaskInfo();
  }, [hasSigned]);

  function renderIndex () {
    return (
      <div id="AiGram_Task" className="aigram__task">
        <div className="aigram__task-header">
          <div className="aigram__task-header-title">AiGram</div>
          <div className="aigram__task-header-detail" onClick={handleToDetail}>Points Details</div>
        </div>
        <div className="aigram__task-main">
          <div className="total__score">
            <div className="total__score-detail">
              <div className="total__score-detail-title">
                AI Points
                <img className="total__score-detail-tips" src={AITips} alt="tips" />
              </div>
              <div className="total__score-detail-num">{score}</div>
            </div>
            <Button className="total__score-exchange" onClick={handleToEventList}>
              <img className="total__score-exchange-icon" src={AIScoreBtnIcon} alt="score" />
              <span className="total__score-exchange-txt">Exchange</span>
            </Button>
          </div>
          <div className="daily__table">
            <div className="daily__table-title">Sign in continuously to get points</div>
            <div className="daily__table-list">
              <div className="daily__table-sublist">
                {
                  DAILY_NORMAL_LIST.map((_, index) => (
                    <AiGramDailyItem
                      hasSigned={hasSigned}
                      todayHasSigned={todayHasSigned}
                      today={index}
                      onComplete={handleCompleteDaily}
                    />
                  ))
                }
              </div>
              <div className="daily__table-target">
                <AiGramDailyItem
                  hasSigned={hasSigned}
                  todayHasSigned={todayHasSigned}
                  today={DAILY_NUM - 1}
                  onComplete={handleCompleteDaily}
                />
              </div>
            </div>
          </div>
          <div className="task__list">
            {
              taskList.map(task => (
                <AiGramTaskItem key={task.type} taskInfo={task} inviteCode={inviteCode} />
              ))
            }
            <div className="more-task">
              More rewards are coming soon...
            </div>
          </div>
        </div>
        {
          !isInApp && <AiGramFooter />
        }
      </div>
    );
  }

  function renderContent() {
    switch (pageStatus) {
      case AiGramPageStatus.ScoreDetail:
        return <AiGramScoreDetail />;
      case AiGramPageStatus.EventList:
        return <EventList />;
      default:
        return renderIndex();
    }
  }

  return (
    <Transition
      id="AigramTask"
      name={LAYERS_ANIMATION_NAME}
      activeKey={pageStatus}
    >{renderContent}</Transition>
  );
};

export default memo(withGlobal(
  (global): StateProps => {
    return {
      score: global.aigramTotalScore,
      hasSigned: global.aigramHasSigned,
      todayHasSigned: global.aigramTodaySigned,
      inviteCode: global.aigramInviteCode,
      taskList: global.aigramTaskList || [],
      isInApp: global.aigramIsInApp,
      pageStatus: global.aigramPageStatus,
    };
  },
)(AiGramTask));
