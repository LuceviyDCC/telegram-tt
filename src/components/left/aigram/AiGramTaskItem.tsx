import type { FC } from "../../../lib/teact/teact";
import React, {memo, useCallback} from "../../../lib/teact/teact";
import { getActions } from "../../../global";

import buildClassName from "../../../util/buildClassName";
import { copyTextToClipboard } from "../../../util/clipboard";

import Button from "../../ui/Button";

import NextIcon from '../../../assets/aigram/next.png';
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
  [TaskType.DAILY]: TaskIcon1,
  [TaskType.BIND]: TaskIcon1,
  [TaskType.INVITE]: TaskIcon2,
  [TaskType.FOLLOW]: TaskIcon3,
} as const;

export const TaskTitleHash = {
  [TaskType.DAILY]: "DAILY SIGN",
  [TaskType.INVITE]: "INVITE FRIENDS",
  [TaskType.FOLLOW]: "JOIN AIGRAM GROUPS",
  [TaskType.BIND]: "BIND TELEGRAM ACCOUNT",
} as const;

export const TaskDescHash = {
  [TaskType.DAILY]: [],
  [TaskType.INVITE]: [
    "Invite a friend for 2 points",
    "Invite two friends for 5 points",
    "Invite three friends for 8 points"
  ],
  [TaskType.FOLLOW]: [],
  [TaskType.BIND]: [],
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
    searchAigramChat,
    openChat,
  } = getActions();

  const onTaskClick = useCallback(async () => {
    if (taskInfo.type === TaskType.INVITE) {
      copyTextToClipboard(inviteCode);
      showNotification({ message: `invite code was copied` });
    } else if (taskInfo.type === TaskType.FOLLOW) {
      await searchAigramChat({ name: 'aigramLab' });
      openChat({ id: '-1002123962275' });
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
          TaskDescHash[type].map(str => (
            <div className="task__item-content">{str}</div>
          ))
        }
      </div>
      <img className={buildClassName("task__item-next", !content.length && "no-content")} src={NextIcon} alt="btn"/>
    </Button>
  );
};

export default memo(AiGramTaskItem);
