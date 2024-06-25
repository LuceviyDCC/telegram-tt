import React, { type FC, memo, useCallback, useRef, useState } from "../../../../lib/teact/teact";
import { getActions, withGlobal } from "../../../../global";

import { AiGramPageStatus } from "../../../../types";

import buildClassName from "../../../../util/buildClassName";

import useLastCallback from "../../../../hooks/useLastCallback";
import useResizeObserver from "../../../../hooks/useResizeObserver";

import Button from "../../../ui/Button";

import "./EventDetail.scss";

import TelegramIcon from '../../../../assets/aigram/event/telegram.png';
import VerifiedIcon from '../../../../assets/aigram/event/verify-icon.png';
import XIcon from '../../../../assets/aigram/event/x.png';


interface OwnProps {}

interface StateProps {}

const eventDetail = {
  image: '',
  nickname: 'AIGram',
  isVerified: true,
  title: 'Mystiko.Network Social Candy Box: Step One of the Event!sdfsod sdfsd sdf ',
  desc: 'Welcome to Mystiko.Network! Mystiko.Network’s'
};

const EventDetail: FC<OwnProps & StateProps> = () => {
  const {
    changeAiGramPage
  } = getActions();

  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  // eslint-disable-next-line no-null/no-null
  const descRef = useRef<HTMLDivElement>(null);

  const handleResize = useLastCallback(() => {
    const descEl = descRef.current!;

    setShowMoreBtn(descEl.scrollHeight! > descEl.clientHeight);
  });

  useResizeObserver(descRef, handleResize);

  const onBack = useCallback(() => {
    changeAiGramPage({ pageStatus: AiGramPageStatus.Index });
  }, []);

  return (
    <>
      <div className="event__header">
        <Button
          className='event__header-back'
          round
          size="smaller"
          color="translucent"
          ariaLabel='back'
          onClick={onBack}
        >
          <i className="icon icon-arrow-left" />
        </Button>
      Claim Points
        <span className="event__header-btns">
          <Button
            className='icon-btn'
            round
            size="smaller"
            color="translucent"
            ariaLabel='back'
          >
            <img className='icon' src={XIcon} alt='sort'/>
          </Button>
          <Button
            className='icon-btn'
            round
            size="smaller"
            color="translucent"
            ariaLabel='back'
          >
            <img className='icon' src={TelegramIcon} alt='sort'/>
          </Button>
        </span>
      </div>

      <div className="event__content">
        <div className="event__content-header">
          <img className="avatar" alt="avatar" src={eventDetail.image} />
          <span className="nickname">
            {eventDetail.nickname}
          </span>
          {
            eventDetail.isVerified && <img className="verify-icon" src={VerifiedIcon} alt="verify" />
          }
        </div>

        <div className="event__content-title">{eventDetail.title}</div>

        <div className={buildClassName("event__content-desc", showMoreDesc && 'all')} ref={descRef}>
          {eventDetail.desc}
        </div>

        { showMoreBtn && <span className="more-btn" onClick={() => {
          setShowMoreDesc(true);
          setShowMoreBtn(false);
        }}>View More</span>}

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
