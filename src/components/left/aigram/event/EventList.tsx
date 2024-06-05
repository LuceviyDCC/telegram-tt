import type { FC } from '../../../../lib/teact/teact';
import React, { memo, useCallback, useEffect, useState } from '../../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../../global';

import { AiGramPageStatus } from '../../../../types';

import buildClassName from '../../../../util/buildClassName';
import { getEventCategoryList } from '../../../../api/axios/event';

import Button from '../../../ui/Button';
import SearchInput from '../../../ui/SearchInput';

import "./EventList.scss";

import SortIcon from '../../../../assets/aigram/event/sort.png';

interface OwnProps {
}

interface StateProps {
  categoryList: Array<{
    ID: number;
    Name: string;
  }>;
}

const EventList: FC<OwnProps & StateProps> = ({
  categoryList
}) => {
  const {
    changeAiGramPage,
    updateAigramEventCategory,
  } = getActions();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // todo: 恢复
    initCategoryList();
  }, []);

  async function initCategoryList() {
    const { list } = await getEventCategoryList();

    updateAigramEventCategory({ categoryList: list });
  };

  const onBack = useCallback(() => {
    changeAiGramPage({ pageStatus: AiGramPageStatus.Index });
  }, []);

  const handleSearchInputChange = useCallback((newVal: string) => {
    setKeyword(newVal);
  }, []);

  const handleSearch = useCallback( () => {
    if(isLoading) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [isLoading]);

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
          >
            <img className='sort-icon' src={SortIcon} alt='sort'/>
          </Button>
        </div>
        <div className='event-content'>
          <SearchInput
            value={keyword}
            isLoading={isLoading}
            parentContainerClassName="event-content"
            onChange={handleSearchInputChange}
            onEnter={handleSearch}
          />

          <div className='category-list'>
            {
              categoryList.map((categoryInfo) => (
                <div
                  key={categoryInfo.ID}
                  className={buildClassName(
                    'category-item',
                    category === categoryInfo.ID && 'active'
                  )}
                  onClick={() => setCategory(categoryInfo.ID)}
                >{categoryInfo.Name}</div>
              ))
            }
          </div>
        </div>
      </>
    );
  }

  return renderCurrentSection();
};

export default memo(withGlobal((global): StateProps => {
  return {
    categoryList: global.aigramEventCategoryList
  };
},)(EventList));
