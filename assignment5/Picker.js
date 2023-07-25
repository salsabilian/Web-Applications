import React from 'react';
import './picker.css';
// import ReactDom from 'react-dom';
/**
* Our picker class that creates our calendar
*/
class Picker extends React.Component {
  /**
  *@return {void}
  */
  constructor() {
    super();
    const today = new Date();
    this.state = {
      today: today,
    };
    this.prevMonth = this.prevMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
  }
  /**
  * @param {string} month
  * @param {string} year
  * @return {void}
  */
  getHeader(month, year) {
    const m = ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const header = [<button id = "prev" key = 'prev'
      onClick={this.prevMonth}> &lt; </button>,
    <div id = "display" key = 'display'>{m[month]} {year}</div>,
    <button id = "next" key = 'next' onClick={this.nextMonth}> &gt; </button>];
    return (
      header
    );
  }
  /**
  * @return {void}
  */
  prevMonth() {
    const prev = new Date(this.state.today.getFullYear(),
        this.state.today.getMonth() - 1,
        this.state.today.getDate());
    this.setState((state) => ({
      today: prev,
    }));
  }
  /**
  * @return {void}
  */
  nextMonth() {
    const next = new Date(this.state.today.getFullYear(),
        this.state.today.getMonth() + 1,
        this.state.today.getDate());
    this.setState((state) => ({
      today: next,
    }));
  }
  /**
  * @return {void}
  */
  getDays() {
    const th = [<th key = '6'> S </th>, <th key = '0'> M </th>,
      <th key = '1'> T </th>, <th key = '2'> W </th>,
      <th key = '3'> T </th>, <th key = '4'> F </th>, <th key = '5'>S</th>];
    return (
      th
    );
  }
  /**
  * @param  {object} today
  * @return {void}
  */
  getGrid(today) {
    const numofDays = new Date(today.getFullYear(), today.getMonth()+1, 0)
        .getDate();
    let dayinserter = 1;
    let highlight = 0;
    const curr = new Date();
    if (today.getMonth() == curr.getMonth() &&
    today.getFullYear() == curr.getFullYear()) {
      highlight = 1;
    }
    const cal = new Date(today.getFullYear(), today.getMonth(), 1);
    const td = [];
    const tr = [];
    let j = 0;
    let count = 0;
    for (let i = 0; i<7; i++) {
      if ( i == cal.getDay()) {
        if (highlight && dayinserter == curr.getDay() + 1) {
          td.push(<td id = 'today' key = {'d' + count}>
            {dayinserter}</td>);
        } else {
          td.push(<td id = {'d' + count} key = {'d' + count}>
            {dayinserter}</td>);
        }
        dayinserter++;
      } else if (dayinserter > 1) {
        if (highlight && dayinserter == curr.getDay() + 1) {
          td.push(<td id = 'today' key = {'d' + count}>
            {dayinserter}</td>);
        } else {
          td.push(<td id = {'d' + count} key = {'d' + count}>
            {dayinserter}</td>);
        }
        dayinserter++;
      } else {
        if (highlight && dayinserter == curr.getDay() + 1) {
          td.push(<td id = 'today' key = {'d' + count}>
            {dayinserter}</td>);
        } else {
          td.push(<td id = {'d' + count} key = {'d' + count}>{''}</td>);
        }
      }
      count++;
    }
    tr.push(<tr key = {'d' + j}>{td}</tr>);
    j++;
    const td1 = [];
    for (let i = 0; i<7; i++) {
      if (dayinserter > numofDays) {
        td1.push(<td id = {'d' + count} key = {'d' + count}>{''}</td>);
      } else {
        if (highlight && dayinserter == curr.getDay() + 1) {
          td1.push(<td id = 'today' key = {'d' + count}>
            {dayinserter}</td>);
        } else {
          td1.push(<td id = {'d' + count} key = {'d' + count}>
            {dayinserter}</td>);
        }
      }
      count++;
      dayinserter++;
    }
    tr.push(<tr key = {'d' + j}>{td1}</tr>);
    j++;
    const td2 = [];
    for (let i = 0; i<7; i++) {
      if (dayinserter > numofDays) {
        td2.push(<td id = {'d' + count} key = {'d' + count}>{''}</td>);
      } else {
        if (highlight && dayinserter == curr.getDay() + 1) {
          td2.push(<td id = 'today' key = {'d' + count}>
            {dayinserter}</td>);
        } else {
          td2.push(<td id = {'d' + count} key = {'d' + count}>
            {dayinserter}</td>);
        }
      }
      count++;
      dayinserter++;
    }
    tr.push(<tr key = {'d' + j}>{td2}</tr>);
    j++;
    const td3 = [];
    for (let i = 0; i<7; i++) {
      if (dayinserter > numofDays) {
        td3.push(<td id = {'d' + count} key = {'d' + count}>{''}</td>);
      } else {
        if (highlight && dayinserter == curr.getDay() + 1) {
          td3.push(<td id = 'today' key = {'d' + count}>
            {dayinserter}</td>);
        } else {
          td3.push(<td id = {'d' + count} key = {'d' + count}>
            {dayinserter}</td>);
        }
      }
      count++;
      dayinserter++;
    }
    tr.push(<tr key = {'d' + j}>{td3}</tr>);
    j++;
    const td4 = [];
    for (let i = 0; i<7; i++) {
      if (dayinserter > numofDays) {
        td4.push(<td id = {'d' + count} key = {'d' + count}>{''}</td>);
      } else {
        if (highlight && dayinserter == curr.getDay() + 1) {
          td4.push(<td id = 'today' key = {'d' + count}>
            {dayinserter}</td>);
        } else {
          td4.push(<td id = {'d' + count} key = {'d' + count}>
            {dayinserter}</td>);
        }
      }
      count++;
      dayinserter++;
    }
    tr.push(<tr key = {'d' + j}>{td4}</tr>);
    j++;
    const td5 = [];
    for (let i = 0; i<7; i++) {
      if (dayinserter > numofDays) {
        td5.push(<td id = {'d' + count} key = {'d' + count}>{''}</td>);
      } else {
        if (highlight && i == curr.getDay() + 1) {
          td5.push(<td id = 'today' key = {'d' + count}>
            {dayinserter}</td>);
        } else {
          td5.push(<td id = {'d' + count} key = {'d' + count}>
            {dayinserter}</td>);
        }
      }
      count++;
      dayinserter++;
    }
    tr.push(<tr key = {'d' + j}>{td5}</tr>);
    return (
      tr
    );
  }

  /**
  * @return {void}
  */
  render() {
    return (
      <div id = 'picker'>
        {this.getHeader(this.state.today.getMonth(),
            this.state.today.getFullYear())}
        <table id = 'table'>
          <tbody>
            <tr>
              {this.getDays()}
            </tr>
            {this.getGrid(this.state.today)}
          </tbody>
        </table>
      </div>
    );
  }
}
export default Picker;
