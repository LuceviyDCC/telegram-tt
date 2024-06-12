import { type MouseEventHandler} from "react";
import React, { type FC,memo, useCallback, useState } from "../../../../lib/teact/teact";

import buildClassName from "../../../../util/buildClassName";

import "./SortPanel.scss";

interface OwnProps {
  activeSortType: SortTypeList;
  onHidePanel: NoneToVoidFunction;
  onSortTypeSelect: (target: SortTypeList) => void;
}

export enum SortTypeList {
  EARLIEST = 'earliest',
  NEWEST = 'newest',
  TRENDING = 'trending',
}

const SortPanel: FC<OwnProps> = ({
  activeSortType,
  onSortTypeSelect,
  onHidePanel
}) => {
  const [showCotent, setShowContent] = useState(true);

  const onClickMask = () => {
    setShowContent(false);
  };

  const onStopClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  const onClickSortType = (target: SortTypeList) => {
    onSortTypeSelect(target);
    setShowContent(false);
  };

  const onAnimEnd = useCallback(() => {
    if (!showCotent) {
      onHidePanel();
    }
  }, [showCotent, onHidePanel]);

  const renderContent = () => {
    return (
      <div className={
        buildClassName("sort__panel-main", showCotent ? 'show' : 'hide')
      }
      onClick={onStopClick}
      onAnimationEnd={onAnimEnd}
      >
        <span className="title">Sort By</span>
        <div className="list">
          {
            Object.values(SortTypeList).map(sortType => (
              <div
                key={sortType}
                className={buildClassName('item', activeSortType === sortType && 'active')}
                onClick={() => onClickSortType(sortType)}
              >{sortType}</div>
            ))
          }
        </div>
      </div>
    );
  };

  return (
    <div className="sort__panel" onClick={onClickMask}>
      {renderContent()}
    </div>
  );
};

export default memo(SortPanel);
