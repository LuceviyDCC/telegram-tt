import type { FC } from '../../../../lib/teact/teact';
import React, { memo, useCallback, useEffect, useState } from '../../../../lib/teact/teact';

import { LeftColumnContent } from '../../../../types';

import { LAYERS_ANIMATION_NAME } from '../../../../util/windowEnvironment';
import { getScoreDetailList } from '../../../../api/axios/task';

import Button from '../../../ui/Button';
import Transition from '../../../ui/Transition';
import { TaskType } from '../AiGramTaskItem';

import "./AiGramScoreDetail.scss";

import TaskIcon3 from '../../../../assets/aigram/bind.png';
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
  [TaskType.DAILY]: TaskIcon1,
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
    await getScoreDetailList();

    setDetailList([
      {
        type: TaskType.DAILY,
        title: '测试测试测试',
        addScore: 1,
        nowScore: 102,
        date: '2024-03-01'
      },
      {
        type: TaskType.FOLLOW,
        title: '测试测试测试',
        addScore: 3,
        nowScore: 103,
        date: '2024-06-01'
      }
    ]);
  }

  const onBack = useCallback(() => {
    onContentChange(LeftColumnContent.ChatList);
  }, [onContentChange]);

  function renderCurrentSection() {
    return (
      <>
        <div className="left-header">
          <Button
            round
            size="smaller"
            color="translucent"
            ariaLabel='back'
            onClick={onBack}
          >
            <i className="icon icon-arrow-left" />
          </Button>
          积分明细
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
