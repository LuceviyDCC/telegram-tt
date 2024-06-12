import React, { type FC, memo, useCallback } from "../../../../lib/teact/teact";
import { getActions, withGlobal } from "../../../../global";

import { AiGramPageStatus } from "../../../../types";

import Button from "../../../ui/Button";

// import "./EventDetail.scss";

interface OwnProps {}

interface StateProps {}

const EventDetail: FC<OwnProps & StateProps> = () => {
  const {
    changeAiGramPage
  } = getActions();

  const onBack = useCallback(() => {
    changeAiGramPage({ pageStatus: AiGramPageStatus.Index });
  }, []);

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
      Claim Points
        <Button
          className='event-header-btn'
          round
          size="smaller"
          color="translucent"
          ariaLabel='back'
        >
        123
          {/* <img className='sort-icon' src={SortIcon} alt='sort'/> */}
        </Button>
      </div>

      <div className="event-detail">
        <div className="event-header">
          <img className="avatar" alt="avatar" />
          <span className="nickname" />
        </div>

        <div className="event-title" />

        <div className="event-content" />

        <div className="event-clicker-list" />

        <div className="event-create-time" />

        <div className="event-task">
          <div className="task-title" />
          <div className="task-desc" />
          <div className="task-detail" />
        </div>
      </div>

      <div className="event-operation">
        <div className="operation-header">
          <img className="operation-avatar" alt="avatar" />

        </div>

        <div className="operation-btn">Go !</div>
      </div>
    </>
  );
};

export default memo(withGlobal(() => ({

}), )(EventDetail));
