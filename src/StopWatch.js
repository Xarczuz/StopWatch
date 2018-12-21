import React, {Component} from 'react';

import './StopWatch.css';

function Split(prop) {
  const split = prop.split;
  const listTimes = split.map((time, index) => <li key={index}>{time}</li>);
  return <ul>{listTimes}</ul>;
}

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: false, reset: false, timeStart: new Date().getTime(),pause:false,prevWatch:0, watch: 0, time: '00:00:00 000', mili: 0, sec: 0, min: 0, hour: 0};
  }
  componentDidMount() {
    if (this.state.isToggleOn && this.state.reset === false) {
      this.timerID = setInterval(() => this.tick(), 100);
      this.setState({isToggleOn: false});
    } else {
      clearInterval(this.timerID);
      this.setState({isToggleOn: true});
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  startStop() {
    if (this.state.isToggleOn) {
      clearInterval(this.timerID);
      this.timerID = setInterval(() => this.tick(), 100);
      this.setState({
        timeStart: new Date().getTime(),
        isToggleOn: false
      });
      return;
    } else if (!this.state.isToggleOn) {

      clearInterval(this.timerID);
      this.setState({
        isToggleOn: true,
        pause:true,
        prevWatch: this.state.watch
      });
      return;
    } else if (this.state.reset) {
      clearInterval(this.timerID);
      this.timerID = setInterval(() => this.tick(), 100);
      this.setState({
        timeStart: new Date().getTime(),
        reset: false
      });
      return;
    }
  }
  reset() {
    clearInterval(this.timerID);
    this.setState({isToggleOn: true,timeStart: 0,watch:0,prevWatch:0, reset: true, time: '00:00:00 000', mili: 0, sec: 0, min: 0, hour: 0});
  }
  splitTime() {
    this.setState({time: '00:00:00 000',timeStart:new Date().getTime(), watch: 0, mili: 0, sec: 0, min: 0, hour: 0});
  }
  tick() {
    let timeNow = new Date().getTime();
    let watch = timeNow - this.state.timeStart;
    let time = watch + this.state.prevWatch
    this.setState({watch: time});
    this.time();
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
    return <h1>{this.state.time}</h1>;
  }
}

class StopWatch extends Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true, isSplitToggleOn: false, split: []};
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
    this.timer.current.startStop();
    this.splitTimer.current.startStop();
    if (this.state.isToggleOn) {
      this.setState({
        isToggleOn: false
      });
    } else {
      this.setState({
        isToggleOn: true
      });
    }
  }
  reset() {
    this.timer.current.reset();
    this.splitTimer.current.reset();
    this.setState({isToggleOn: true, split: []});
  }
  split() {
    this.setState({
      split: [...this.state.split, this.splitTimer.current.state.time]
    });
    this.splitTimer.current.splitTime();
  }

  render() {
    return (
      <div>
        <h1>StopWatch</h1>
        <div>
          timer <Timer ref={this.timer} isToggleOn={this.state.isToggleOn} />
        </div>
        <div>
          split timer <Timer ref={this.splitTimer} isToggleOn={this.state.isToggleOn} />
        </div>
        <button onClick={this.startStop}> {this.state.isToggleOn ? 'Start' : 'Stop'}</button>
        <button onClick={this.split}>Split</button>
        <button onClick={this.reset}>Reset</button>
        <Split split={this.state.split} />
      </div>
    );
  }
}

export default StopWatch;