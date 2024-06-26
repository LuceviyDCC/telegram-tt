import type { FC } from '../../../../lib/teact/teact';
import React, { memo, useCallback, useEffect, useRef, useState } from '../../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../../global';

import { AiGramPageStatus } from '../../../../types';

import buildClassName from '../../../../util/buildClassName';
import { clamp, getNumInShortStr } from '../../../../util/math';
import { getEventCategoryList, getRecommendList } from '../../../../api/axios/event';

import useSwipe from '../../../../hooks/touch/useSwipe';

import Button from '../../../ui/Button';
import SearchInput from '../../../ui/SearchInput';

import "./EventList.scss";

import HotIcon from '../../../../assets/aigram/event/fire-icon.png';
import SortIcon from '../../../../assets/aigram/event/sort.png';

export interface EventInfo {
  id: string;
  name: string;
  image: string;
  avatar: string;
  nickname: string;

  score: number;
  click_num: number;

  currency_url: string;
  currency_price: number;
  currency_name: string;
}

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

  const [activeRecommendIndex, setActiveRecommendIndex] = useState(-1);
  const [recommendList, setRecommendList] = useState<EventInfo[]>([]);
  // eslint-disable-next-line no-null/no-null
  const recommendElRef = useRef<HTMLDivElement>(null);
  const swipeState = useSwipe(recommendElRef);
  const isSwipeRef = useRef(false);
  const autoSwipeRef = useRef<NodeJS.Timeout>();
  const curActiveIndexRef = useRef(0);
  const listNumRef = useRef(0);

  useEffect(() => {
    if (swipeState.swiping) {
      isSwipeRef.current = true;
    } else if (isSwipeRef.current){
      const offset = swipeState.direction === 'left' ? 1 : -1;
      const target = activeRecommendIndex + offset;

      isSwipeRef.current = false;
      setActiveRecommendIndex(clamp(target, 0, recommendList.length - 1));
    }
  }, [swipeState.swiping, swipeState.direction, activeRecommendIndex, recommendList]);

  const startAutoChangeRecommendIndex = () => {
    clearTimeout(autoSwipeRef.current);

    autoSwipeRef.current = setTimeout(() => {
      let target = curActiveIndexRef.current + 1;

      if (target > listNumRef.current - 1) {
        target = 0;
      }

      setActiveRecommendIndex(target);
    }, 2500);
  };

  const initCategoryList = async () => {
    const { list } = await getEventCategoryList();

    updateAigramEventCategory({ categoryList: list });
  };

  const initRecommendList = async () => {
    const { list } = await getRecommendList();

    setRecommendList(list);
    setActiveRecommendIndex(0);
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

  useEffect(() => {
    initCategoryList();
    initRecommendList();

    return () => {
      if (autoSwipeRef.current) {
        clearTimeout(autoSwipeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    listNumRef.current = recommendList.length;
    curActiveIndexRef.current = activeRecommendIndex;

    if (recommendList.length > 1) {
      startAutoChangeRecommendIndex();
    }
  }, [activeRecommendIndex, recommendList]);

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

          <div className='main-content no-scrollbar'>
            <div className='recommend-list' ref={recommendElRef}>
              <div className='list-container' style={`transform: translateX(-${(activeRecommendIndex) * 21.1875}rem)`}>
                {
                  recommendList.map((recommendInfo) => (
                    <div key={recommendInfo.id} className='recommend-item'>
                      <div className='recommend-item-header'>
                        <img
                          className='cover'
                          src={recommendInfo.image}
                          alt='cover'
                        />
                        <div className='currency'>
                          <img
                            className='currency-icon'
                            src={recommendInfo.currency_url}
                            alt='currency'
                          />
                          <span className='smaller-txt'>
                            {recommendInfo.currency_price} {recommendInfo.currency_name}
                          </span>
                        </div>
                        <div className='score'>
                          <span className='smaller-txt'>{recommendInfo.score} Points</span>
                        </div>
                      </div>
                      <div className='recommend-item-content'>
                        <div className='title'>
                          {recommendInfo.name}
                        </div>
                        <div className='detail'>
                          <img
                            className='avatar'
                            src={recommendInfo.avatar}
                            alt='avatar'
                          />
                          <span className='nickname'>
                            {recommendInfo.nickname}
                          </span>
                          <span className='hot'>
                            <img
                              className='hot-icon'
                              src={HotIcon}
                              alt='hot-icon'
                            />
                            {getNumInShortStr(recommendInfo.click_num)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            {
              recommendList.length > 1 && (
                <div className='dot-list'>
                  {
                    recommendList.map((recommendInfo, index) => (
                      <div
                        key={recommendInfo.id}
                        className={buildClassName('dot', index === activeRecommendIndex && 'active')}
                      />
                    ))
                  }
                </div>
              )
            }

            <div className='event-item'>
              <img
                className='cover'
                src="https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/index/Rectangle.png"
                alt='cover'
              />
              <div className='event-item-detail'>
                <div className='title'>
                Follow On Twitter And Win 50 USDT
                </div>
                <div className='owner'>
                  <img
                    className='avatar'
                    src='https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/avatar/Ellipse.png'
                    alt='avatar'
                  />
                  <span className='nickname'>
                  Tear Structure
                  </span>
                  <span className='hot'>
                    <img
                      className='hot-icon'
                      src={HotIcon}
                      alt='hot-icon'
                    />
                    {getNumInShortStr(1483)}
                  </span>
                </div>
              </div>

              <div className='currency'>
                <img
                  className='currency-icon'
                  src='https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/currency/USDT.png'
                  alt='currency'
                />
                <span className='smaller-txt'>
                50 USDT
                </span>
              </div>

              <div className='score'>
                <span className='smaller-txt'>20 Points</span>
              </div>
            </div>

            <div className='event-item'>
              <img
                className='cover'
                src="https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/index/Rectangle.png"
                alt='cover'
              />
              <div className='event-item-detail'>
                <div className='title'>
                Follow On Twitter And Win 50 USDT
                </div>
                <div className='owner'>
                  <img
                    className='avatar'
                    src='https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/avatar/Ellipse.png'
                    alt='avatar'
                  />
                  <span className='nickname'>
                  Tear Structure
                  </span>
                  <span className='hot'>
                    <img
                      className='hot-icon'
                      src={HotIcon}
                      alt='hot-icon'
                    />
                    {getNumInShortStr(1483)}
                  </span>
                </div>
              </div>

              <div className='currency'>
                <img
                  className='currency-icon'
                  src='https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/currency/USDT.png'
                  alt='currency'
                />
                <span className='smaller-txt'>
                50 USDT
                </span>
              </div>

              <div className='score'>
                <span className='smaller-txt'>20 Points</span>
              </div>
            </div>

            <div className='event-item'>
              <img
                className='cover'
                src="https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/index/Rectangle.png"
                alt='cover'
              />
              <div className='event-item-detail'>
                <div className='title'>
                Follow On Twitter And Win 50 USDT
                </div>
                <div className='owner'>
                  <img
                    className='avatar'
                    src='https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/avatar/Ellipse.png'
                    alt='avatar'
                  />
                  <span className='nickname'>
                  Tear Structure
                  </span>
                  <span className='hot'>
                    <img
                      className='hot-icon'
                      src={HotIcon}
                      alt='hot-icon'
                    />
                    {getNumInShortStr(1483)}
                  </span>
                </div>
              </div>

              <div className='currency'>
                <img
                  className='currency-icon'
                  src='https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/currency/USDT.png'
                  alt='currency'
                />
                <span className='smaller-txt'>
                50 USDT
                </span>
              </div>

              <div className='score'>
                <span className='smaller-txt'>20 Points</span>
              </div>
            </div>

            <div className='event-item'>
              <img
                className='cover'
                src="https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/index/Rectangle.png"
                alt='cover'
              />
              <div className='event-item-detail'>
                <div className='title'>
                Follow On Twitter And Win 50 USDT
                </div>
                <div className='owner'>
                  <img
                    className='avatar'
                    src='https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/avatar/Ellipse.png'
                    alt='avatar'
                  />
                  <span className='nickname'>
                  Tear Structure
                  </span>
                  <span className='hot'>
                    <img
                      className='hot-icon'
                      src={HotIcon}
                      alt='hot-icon'
                    />
                    {getNumInShortStr(1483)}
                  </span>
                </div>
              </div>

              <div className='currency'>
                <img
                  className='currency-icon'
                  src='https://config-bucket-579250494100.s3.us-west-2.amazonaws.com/static/currency/USDT.png'
                  alt='currency'
                />
                <span className='smaller-txt'>
                50 USDT
                </span>
              </div>

              <div className='score'>
                <span className='smaller-txt'>20 Points</span>
              </div>
            </div>
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
