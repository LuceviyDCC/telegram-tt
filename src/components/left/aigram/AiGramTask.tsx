import { type FC,memo } from "../../../lib/teact/teact";
import React from "../../../lib/teact/teact";
import { withGlobal } from "../../../global";

import './AiGramTask.scss';

interface StateProps {};

const AiGramTask: FC<StateProps> = () => {
  return (
    <div id="AiGram_Task" className="AiGram_Task">123</div>
  );
};

export default memo(withGlobal(
  (global): StateProps => {
    return {
      authState: global.authState,
    };
  },
)(AiGramTask));
