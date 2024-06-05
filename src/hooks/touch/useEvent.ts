import { useEffect } from '../../lib/teact/teact';

import type { RefObject } from './shared/types';

import createHandlerSetter from './factory/createHandlerSetter';
import safeHasOwnProperty from './shared/safeHasOwnProperty';

/**
 * Accepts the reference to an HTML Element and an event name then performs the necessary operations to listen to the event
 * when fired from that HTML Element.
 */
const useEvent = <TEvent extends Event, TElement extends HTMLElement = HTMLElement>
  (target: RefObject<TElement>, eventName: string, options?: AddEventListenerOptions) => {
  const [handler, setHandler] = createHandlerSetter<TEvent>();

  if (!!target && !safeHasOwnProperty(target, 'current')) {
    throw new Error('Unable to assign any scroll event to the given ref');
  }

  useEffect(() => {
    const cb: any = (event: TEvent) => {
      if (handler.current) {
        handler.current(event);
      }
    };

    if (target.current?.addEventListener && handler.current) {
      target.current.addEventListener(eventName, cb, options);
    }

    return () => {
      // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
      if (target.current?.addEventListener && handler.current) {
        // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
        target.current.removeEventListener(eventName, cb, options);
      }
    };
  }, [eventName, options, handler, target]);

  return setHandler;
};

export default useEvent;
