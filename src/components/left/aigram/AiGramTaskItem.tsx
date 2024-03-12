import type { FC } from "../../../lib/teact/teact";
import React from "../../../lib/teact/teact";

import buildClassName from "../../../util/buildClassName";

import Button from "../../ui/Button";

import TipsIcon from '../../../assets/aigram/score_q.png';
import TaskIcon1 from '../../../assets/aigram/task_1.png';
import TaskIcon2 from '../../../assets/aigram/task_2.png';
import TaskIcon3 from '../../../assets/aigram/task_3.png';


export enum TaskType {
  BIND,
  INVITE,
  FOLLOW
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
}

const AiGramTaskItem: FC<OwnProps> = (props) => {
  const { taskInfo } = props;
  const { type, title, tips, content } = taskInfo;
  return (
    <Button className="task__item">
      <img src={TaskIconHash[type]} alt="task" className="task__item-icon"  />
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

export default AiGramTaskItem;
