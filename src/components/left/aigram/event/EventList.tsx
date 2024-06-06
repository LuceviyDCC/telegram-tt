import type { FC } from '../../../../lib/teact/teact';
import React, { memo, useCallback, useEffect, useRef, useState } from '../../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../../global';

import { AiGramPageStatus } from '../../../../types';

import buildClassName from '../../../../util/buildClassName';
import { clamp, getNumInShortStr } from '../../../../util/math';
import { getEventCategoryList, getRecommendList } from '../../../../api/axios/event';

import useSwipe from '../../../../hooks/touch/useSwipe';

import Button from '../../../ui/Button';
import InfiniteScroll from '../../../ui/InfiniteScroll';
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

// const PAGE_SIZE = 20;

const EventList: FC<OwnProps & StateProps> = ({
  categoryList
}) => {
  const {
    changeAiGramPage,
    updateAigramEventCategory,
  } = getActions();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(0);
  const [sortKey, setSortKey] = useState<'earliest' | 'newest' | 'trending'>('earliest');
  const [page, setPage] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [eventList, setEventList] = useState<EventInfo[]>([]);
  const totalEventListRef = useRef(0);

  // 推荐容器
  const [recommendList, setRecommendList] = useState<EventInfo[]>([]);
  // eslint-disable-next-line no-null/no-null
  const recommendElRef = useRef<HTMLDivElement>(null);
  // 推荐容器滑动切换相关
  const [activeRecommendIndex, setActiveRecommendIndex] = useState(-1);
  const swipeState = useSwipe(recommendElRef);
  const isSwipeRef = useRef(false);
  const autoSwipeRef = useRef<NodeJS.Timeout>();
  const curActiveIndexRef = useRef(0);
  const listNumRef = useRef(0);

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

  // const onGetEventList = async () => {
  //   setIsLoading(true);

  //   const { total, list } = await getEventList({
  //     keyword,
  //     offset: page
  //   });

  //   setIsLoading(false);
  //   setEventList([...eventList, ...list]);
  //   totalEventListRef.current = total;
  // };

  const resetListParams = () => {
    setPage(0);
    setEventList([]);
  };

  const onBack = useCallback(() => {
    changeAiGramPage({ pageStatus: AiGramPageStatus.Index });
  }, []);

  const handleSearchInputChange = useCallback((newVal: string) => {
    setKeyword(newVal);
  }, []);

  const handleSearch = useCallback( () => {
    resetListParams();
  }, []);

  const onLoadMore = useCallback(() => {
    if (eventList.length >= totalEventListRef.current) {
      return;
    }

    setPage(page + 1);
  }, [page, eventList]);

  // 初始化
  useEffect(() => {
    initCategoryList();
    initRecommendList();

    // todo:
    setSortKey('earliest');
    setIsLoading(false);

    return () => {
      if (autoSwipeRef.current) {
        clearTimeout(autoSwipeRef.current);
      }
    };
  }, []);

  // 左右滑动
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
  // 自动左右滑
  useEffect(() => {
    listNumRef.current = recommendList.length;
    curActiveIndexRef.current = activeRecommendIndex;

    if (recommendList.length > 1) {
      startAutoChangeRecommendIndex();
    }
  }, [activeRecommendIndex, recommendList]);


  useEffect(() => {
    resetListParams();
  }, [category, sortKey]);

  useEffect(() => {

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
            <InfiniteScroll
              items={eventList}
              onLoadMore={onLoadMore}
            >
              <div key='recommend-list' className='recommend-list' ref={recommendElRef}>
                <div
                  className='list-container'
                  style={`transform: translateX(-${(activeRecommendIndex) * 21.1875}rem)`}
                >
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

              {
                eventList.map(eventInfo => (
                  <div key={eventInfo.id} className='event-item'>
                    <img
                      className='cover'
                      src={eventInfo.image}
                      alt='cover'
                    />
                    <div className='event-item-detail'>
                      <div className='title'>{eventInfo.name}</div>
                      <div className='owner'>
                        <img
                          className='avatar'
                          src={eventInfo.avatar}
                          alt='avatar'
                        />
                        <span className='nickname'>{eventInfo.nickname}</span>
                        <span className='hot'>
                          <img
                            className='hot-icon'
                            src={HotIcon}
                            alt='hot-icon'
                          />
                          {getNumInShortStr(eventInfo.click_num)}
                        </span>
                      </div>
                    </div>

                    <div className='currency'>
                      <img
                        className='currency-icon'
                        src={eventInfo.currency_url}
                        alt='currency'
                      />
                      <span className='smaller-txt'>{eventInfo.currency_price} {eventInfo.currency_name}</span>
                    </div>

                    <div className='score'>
                      <span className='smaller-txt'>{eventInfo.score} Points</span>
                    </div>
                  </div>
                ))
              }
            </InfiniteScroll>
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
