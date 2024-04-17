import type { FC } from "../../../lib/teact/teact";
import React, {memo, useCallback} from "../../../lib/teact/teact";
import { getActions } from "../../../global";

import buildClassName from "../../../util/buildClassName";
import { copyTextToClipboard } from "../../../util/clipboard";

import Button from "../../ui/Button";

import TipsIcon from '../../../assets/aigram/score_q.png';
import TaskIcon1 from '../../../assets/aigram/task_1.png';
import TaskIcon2 from '../../../assets/aigram/task_2.png';
import TaskIcon3 from '../../../assets/aigram/task_3.png';


export enum TaskType {
  DAILY = 1,
  INVITE = 2,
  FOLLOW = 3,
  BIND = 4
}

export const TaskIconHash = {
  [TaskType.BIND]: TaskIcon1,
  [TaskType.INVITE]: TaskIcon2,
  [TaskType.FOLLOW]: TaskIcon3,
} as const;

export interface TaskItem {
  type: TaskType;
  title: string;
  content: string[];
  tips?: string;
}

export interface OwnProps {
  taskInfo: TaskItem;
  inviteCode: string;
}

const AiGramTaskItem: FC<OwnProps> = (props) => {
  const { taskInfo, inviteCode } = props;
  const { type, title, tips, content } = taskInfo;

  const {
    showNotification,
  } = getActions();

  const onTaskClick = useCallback(() => {
    if (taskInfo.type === TaskType.INVITE) {
      copyTextToClipboard(inviteCode);
      showNotification({ message: `invite code was copied` });
    } else if (taskInfo.type === TaskType.FOLLOW) {
      // todo: jump to
      window.location.href = 'https://t.me/AIGramLab';
    }
  }, [taskInfo.type, inviteCode]);
  return (
    <Button className="task__item" onClick={onTaskClick}>
      {
        type !== TaskType.DAILY && <img src={TaskIconHash[type]} alt="task" className="task__item-icon"  />
      }
      <div className="task__item-main">
        <div className="task__item-title">
          <span className="task__item-title-content">{ title }</span>
          {
            tips && <img src={TipsIcon} className="task__item-title-tips" alt="tips" />
          }
        </div>
        {
          content.map(str => (
            <div className="task__item-content">{str}</div>
          ))
        }
      </div>
      <div
        className={buildClassName("task__item-next", !content.length && "no-content")}
      >
        {">"}
      </div>
    </Button>
  );
};

export default memo(AiGramTaskItem);
