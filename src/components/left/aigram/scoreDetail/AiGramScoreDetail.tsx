import type { FC } from '../../../../lib/teact/teact';
import React, { memo, useCallback, useEffect, useState } from '../../../../lib/teact/teact';
import { getActions } from '../../../../global';

import { AiGramPageStatus } from '../../../../types';

import { getScoreDetailList } from '../../../../api/axios/task';

import Button from '../../../ui/Button';
import { TaskTitleHash, TaskType } from '../AiGramTaskItem';

import "./AiGramScoreDetail.scss";

import TaskIcon3 from '../../../../assets/aigram/bind.png';
import TaskIcon4 from '../../../../assets/aigram/daily.png';
import EmptyIcon from '../../../../assets/aigram/empty.png';
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
}

const AiGramScoreDetail: FC<OwnProps> = () => {
  const {
    changeAiGramPage,
  } = getActions();

  const [hasInit, setHasInit] = useState(false);
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
    setHasInit(true);
  }

  const onBack = useCallback(() => {
    changeAiGramPage({ pageStatus: AiGramPageStatus.Index });
  }, []);

  function renderCurrentSection() {
    return (
      <>
        <div className="detail-header">
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
        {
          hasInit && (
            detailList.length > 0 ? (
              <div className='detail__list'>
                {
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
                }
              </div>
            ) : (
              <div className='detail__empty'>
                <img className='empty-img' alt='empty' src={EmptyIcon}  />
                <div className='empty-title'>No detail</div>
                <div className='empty-text'>You have not earned</div>
                <div className='empty-text'>any point so far</div>
              </div>
            )
          )
        }
      </>
    );
  }

  return renderCurrentSection();
};

export default memo(AiGramScoreDetail);
