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
    this.state = { timerOn: true, timeStart: 0, prevTimeElapsed: 0, timeElapsed: 0, time: '00:00:00 000' };
  }
  startStop(timeNow) {
    if (this.state.timerOn) {
      this.setState({
        timeStart: timeNow,
        timerOn: false
      });
    } else if (!this.state.timerOn) {
      this.setState({
        timerOn: true,
        prevTimeElapsed: this.state.timeElapsed
      });
    }
  }
  reset() {
    this.setState({ timerOn: true, timeStart: 0, timeElapsed: 0, prevTimeElapsed: 0, time: '00:00:00 000' });
  }
  splitTime() {
    this.setState({ time: '00:00:00 000', timeStart: new Date().getTime(), prevTimeElapsed: 0, timeElapsed: 0 });
  }
  tick(timeNow) {
    let timeElapsed = timeNow - this.state.timeStart + this.state.prevTimeElapsed;
    this.setState({ timeElapsed: timeElapsed }, () => this.time());
  }
  time() {
    let timeElapsed = new Date(this.state.timeElapsed);
    let mili = timeElapsed.getUTCMilliseconds();
    let hour = timeElapsed.getUTCHours();
    let min = timeElapsed.getUTCMinutes();
    let sec = timeElapsed.getUTCSeconds();

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
    return <span className="timer">{this.state.time}</span>;
  }
}

class StopWatch extends Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true, isSplitToggleOn: false, split: [] };
    this.startStop = this.startStop.bind(this);
    this.reset = this.reset.bind(this);
    this.split = this.split.bind(this);
    this.saveToFile = this.saveToFile.bind(this);
    this.timer = React.createRef();
    this.splitTimer = React.createRef();
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  startStop() {
    let timeNow = new Date().getTime();
    if (this.state.isToggleOn) {
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
      <div id="stopWatch">
        <h1>StopWatch</h1>
        <div>
          <p className="label" id="timer">
            Timer: <Timer ref={this.timer} isToggleOn={this.state.isToggleOn} />
          </p>
        </div>
        <div>
          <p className="label" id="splitTimer">
            Split timer:
            <Timer ref={this.splitTimer} isToggleOn={this.state.isToggleOn} />
          </p>
        </div>
        <button id="start" onClick={this.startStop}>
          {this.state.isToggleOn ? 'Start' : 'Stop'}
        </button>
        <button id="split" onClick={this.split}>
          Split
        </button>
        <button id="reset" onClick={this.reset}>
          Reset
        </button>
        <button id="save" onClick={this.saveToFile}>
          Save Times
        </button>
        <Split split={this.state.split} />
      </div>
    );
  }
  
  saveToFile(){
    let filename = "times.txt";
    let text = this.state.split.toString();
    var link = document.createElement("a");
    link.setAttribute("href","data:text/plain," + text);
    link.setAttribute("download",filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default StopWatch;