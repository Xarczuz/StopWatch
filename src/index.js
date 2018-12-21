import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import StopWatch from './StopWatch.js';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<StopWatch />, document.getElementById('root'));


serviceWorker.unregister();
