import React, { Component } from 'react';

import './StopWatch.css';

function Split(prop) {
  const split = prop.split;
  const listTimes = split.map((time, index) => (
    <li key={index}>
      <p>{time[0]}</p>
      <p>{time[1]}</p>
    </li>
  ));
  return <ol>{listTimes}</ol>;
}

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: false, reset: false, timeStart: new Date().getTime(), pause: false, prevWatch: 0, watch: 0, time: '00:00:00 000', mili: 0, sec: 0, min: 0, hour: 0 };
  }
  componentDidMount() {
    if (this.state.isToggleOn && this.state.reset === false) {
      this.timerID = setInterval(() => this.tick(), 100);
      this.setState({ isToggleOn: false });
    } else {
      clearInterval(this.timerID);
      this.setState({ isToggleOn: true });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  startStop(timeNow) {
    if (this.state.isToggleOn) {
      this.setState({
        timeStart: timeNow,
        isToggleOn: false
      });
      return;
    } else if (!this.state.isToggleOn) {
      this.setState({
        isToggleOn: true,
        pause: true,
        prevWatch: this.state.watch
      });
      return;
    } else if (this.state.reset) {
      this.setState({
        timeStart: timeNow,
        reset: false,
        isToggleOn: false
      });
      return;
    }
  }
  reset() {
    clearInterval(this.timerID);
    this.setState({ isToggleOn: true, timeStart: 0, watch: 0, prevWatch: 0, reset: true, time: '00:00:00 000', mili: 0, sec: 0, min: 0, hour: 0 });
  }
  splitTime() {
    this.setState({ time: '00:00:00 000', timeStart: new Date().getTime(), prevWatch: 0, watch: 0, mili: 0, sec: 0, min: 0, hour: 0 });
  }
  tick(timeNow) {
    let watch = timeNow - this.state.timeStart;
    let time = watch + this.state.prevWatch;
    this.setState({ watch: time }, () => this.time());
  }
  time() {
    let watch = new Date(this.state.watch);
    let mili = watch.getUTCMilliseconds();
    let hour = watch.getUTCHours();
    let min = watch.getUTCMinutes();
    let sec = watch.getUTCSeconds();

    if (mili < 10) {
      mili = '00' + mili;
    } else if (mili < 100) {
      mili = '0' + mili;
    }
    if (sec < 10) {
      sec = '0' + sec;
    }

    if (min < 10) {
      min = '0' + min;
    }

    if (hour < 10) {
      hour = '0' + hour;
    }

    let time = hour.toString() + ':' + min.toString() + ':' + sec.toString() + ' ' + mili.toString();
    this.setState({
      time: time
    });
  }
  render() {
    return <span className='timer'>{this.state.time}</span>;
  }
}

class StopWatch extends Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true, isSplitToggleOn: false, split: [] };
    this.startStop = this.startStop.bind(this);
    this.reset = this.reset.bind(this);
    this.split = this.split.bind(this);
    this.timer = React.createRef();
    this.splitTimer = React.createRef();
  }
  componentDidMount() {}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  startStop() {
    let timeNow = new Date().getTime();
    if (this.state.isToggleOn) {
      clearInterval(this.timerID);
      this.timer.current.startStop(timeNow);
      this.splitTimer.current.startStop(timeNow);
      this.setState({
        isToggleOn: false
      });
      this.timerID = setInterval(() => this.tick(), 100);
    } else {
      clearInterval(this.timerID);
      this.timer.current.startStop(timeNow);
      this.splitTimer.current.startStop(timeNow);
      this.setState({
        isToggleOn: true
      });
    }
  }
  tick() {
    let timeNow = new Date().getTime();
    this.timer.current.tick(timeNow);
    this.splitTimer.current.tick(timeNow);
  }
  reset() {
    clearInterval(this.timerID);
    this.timer.current.reset();
    this.splitTimer.current.reset();
    this.setState({ isToggleOn: true, split: [] });
  }
  split() {
    this.setState({
      split: [...this.state.split, ['Split Time: ' + this.splitTimer.current.state.time, ' Total Time: ' + this.timer.current.state.time]]
    });
    this.splitTimer.current.splitTime();
  }

  render() {
    return (
      <div>
        <h1>StopWatch</h1>
        <div>
          <p className='label' id='timer'> Timer: <Timer ref={this.timer} isToggleOn={this.state.isToggleOn} /></p>
        </div>
        <div>
          <p className='label' id ='splitTimer'> Split timer:<Timer ref={this.splitTimer} isToggleOn={this.state.isToggleOn} /></p>
        </div>
        <button id='start' onClick={this.startStop}> {this.state.isToggleOn ? 'Start' : 'Stop'}</button>
        <button id='split' onClick={this.split}>Split</button>
        <button id='reset' onClick={this.reset}>Reset</button>
        <Split split={this.state.split} />
      </div>
    );
  }
}

export default StopWatch;
