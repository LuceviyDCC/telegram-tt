import type { FC } from '../../../../lib/teact/teact';
import React, { memo, useCallback, useEffect, useState } from '../../../../lib/teact/teact';

import { LeftColumnContent } from '../../../../types';

import { LAYERS_ANIMATION_NAME } from '../../../../util/windowEnvironment';
import { getScoreDetailList } from '../../../../api/axios/task';

import Button from '../../../ui/Button';
import Transition from '../../../ui/Transition';
import { TaskTitleHash, TaskType } from '../AiGramTaskItem';

import "./AiGramScoreDetail.scss";

import TaskIcon3 from '../../../../assets/aigram/bind.png';
import TaskIcon4 from '../../../../assets/aigram/daily.png';
import TaskIcon1 from '../../../../assets/aigram/follow.png';
import TaskIcon2 from '../../../../assets/aigram/invite.png';

interface ScoreDetail {
  type: TaskType;
  title: string;
  addScore: number;
  nowScore: number;
  date: string;
}

const TaskIconHash = {
  [TaskType.DAILY]: TaskIcon4,
  [TaskType.INVITE]: TaskIcon2,
  [TaskType.FOLLOW]: TaskIcon3,
  [TaskType.BIND]: TaskIcon1,
} as const;

interface OwnProps {
  onContentChange: (content: LeftColumnContent) => void;
}

const AiGramScoreDetail: FC<OwnProps> = ({ onContentChange }) => {
  const [detailList, setDetailList] = useState<ScoreDetail[]>([]);

  useEffect(() => {
    initDetailList();
  }, []);

  async function initDetailList () {
    const res = await getScoreDetailList();

    setDetailList(res.map(item => ({
      type: item.task_id,
      title: TaskTitleHash[item.task_id as TaskType],
      addScore: item.score,
      nowScore: item.current_score,
      date: item.created_at.split('T')[0],
    })));
  }

  const onBack = useCallback(() => {
    onContentChange(LeftColumnContent.ChatList);
  }, [onContentChange]);

  function renderCurrentSection() {
    return (
      <>
        <div className="left-header detail-header">
          <Button
            className='detail-header-btn'
            round
            size="smaller"
            color="translucent"
            ariaLabel='back'
            onClick={onBack}
          >
            <i className="icon icon-arrow-left" />
          </Button>
          Points Details
        </div>
        <div className='detail__list'>{
          detailList.map(detail => (
            <div className='detail__item'>
              <img src={TaskIconHash[detail.type]} alt="detail" className="detail__item-icon"  />
              <div className='detail__item-main'>
                <div className='detail__item-title'>{detail.title}</div>
                <div className='detail__item-date'>{detail.date}</div>
              </div>
              <div className='detail__item-score'>
                <div className='detail__item-add'>+{detail.addScore}</div>
                <div className='detail__item-total'>{detail.nowScore}</div>
              </div>
            </div>
          ))
        }</div>
      </>
    );
  }

  return (
    <Transition
      id="Settings"
      name={LAYERS_ANIMATION_NAME}
      activeKey={0}
      shouldWrap
      withSwipeControl
    >
      {renderCurrentSection}
    </Transition>
  );
};

export default memo(AiGramScoreDetail);
