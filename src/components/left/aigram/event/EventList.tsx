import type { FC } from '../../../../lib/teact/teact';
import React, { memo, useCallback, useEffect } from '../../../../lib/teact/teact';
import { getActions } from '../../../../global';

import { AiGramPageStatus } from '../../../../types';

import Button from '../../../ui/Button';

import "./EventList.scss";

import SortIcon from '../../../../assets/aigram/event/sort.png';

interface OwnProps {
}

const EventList: FC<OwnProps> = () => {
  const {
    changeAiGramPage,
  } = getActions();

  useEffect(() => {
  }, []);

  const onBack = useCallback(() => {
    changeAiGramPage({ pageStatus: AiGramPageStatus.Index });
  }, []);

  function renderCurrentSection() {
    return (
      <>
        <div className="event-header">
          <Button
            className='event-header-btn'
            round
            size="smaller"
            color="translucent"
            ariaLabel='back'
            onClick={onBack}
          >
            <i className="icon icon-arrow-left" />
          </Button>
          <Button
            className='event-header-btn'
            round
            size="smaller"
            color="translucent"
            ariaLabel='back'
            onClick={onBack}
          >
            <img className='sort-icon' src={SortIcon} alt='sort'/>
          </Button>
        </div>
        <div className='event'>123</div>
      </>
    );
  }

  return renderCurrentSection();
};

export default memo(EventList);
