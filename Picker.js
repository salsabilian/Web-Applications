/**
 * CSE183 Assignment 4 - Advanced
 */
class Picker {
  /**
   * Create a date picker
   * @param {string} containerId id of a node the Picker will be a child of
   */
  constructor(containerId) {
    const div = document.getElementById(containerId);
    const previous = document.createElement('button');
    let buttontext = document.createTextNode('<');
    previous.id = 'previous';
    previous.append(buttontext);
    div.append(previous);
    const next = document.createElement('button');
    buttontext = document.createTextNode('>');
    next.id = 'next';
    next.append(buttontext);
    div.append(next);
    const month = document.createElement('p');
    const monthtext = document.createTextNode('{{month}}');
    month.id = 'month';
    month.append(monthtext);
    div.append(month);
    const table = document.createElement('table');
    let x = 0;
    for (let i = 0; i<7; i++) {
      const tr = document.createElement('tr');
      if (i==0) {
        for (let j = 0; j<7; j++) {
          const th = document.createElement('th');
          const text = document.createTextNode('{{d'+ x + '}}');
          th.id = 'head';
          th.append(text);
          tr.append(th);
        }
      } else {
        for (let j = 0; j<7; j++) {
          const td = document.createElement('td');
          const text = document.createTextNode('{{d'+ x + '}}');
          td.id = 'd'+x;
          x++;
          td.append(text);
          tr.append(td);
        }
      }
      table.append(tr);
    }
    div.append(table);
    const today = new Date();
    const that = this;
    next.addEventListener('click', function(e) {
      today.setMonth(today.getMonth()+1);
      that.setDate(containerId, today.getMonth(), today.getFullYear());
    });
    previous.addEventListener('click', function(e) {
      today.setMonth(today.getMonth()-1);
      that.setDate(containerId, today.getMonth(), today.getFullYear());
    });
    this.setDate(containerId, today.getMonth(), today.getFullYear());
  }

  /**
   * sets the date
   * @param {string} containerId id of a node the Picker will be a child of
   * @param {int} mm
   * @param {int} year
   */
  setDate(containerId, mm, year) {
    const m = document.getElementById('month');
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    m.innerHTML = month[mm] + ' ' + year;
    const table = document.getElementsByTagName('tr');
    table[0].cells[0].innerHTML = 'S';
    table[0].cells[1].innerHTML = 'M';
    table[0].cells[2].innerHTML = 'T';
    table[0].cells[3].innerHTML = 'W';
    table[0].cells[4].innerHTML = 'T';
    table[0].cells[5].innerHTML = 'F';
    table[0].cells[6].innerHTML = 'S';
    const numofDays = new Date(year, mm+1, 0).getDate();
    let dayinserter = 1;
    const today = new Date();
    let highlight = 0;
    if (today.getMonth() == mm && today.getFullYear() == year) {
      highlight = 1;
    }
    const cal = new Date(year, mm, 1);
    for (let x = 0; x<table.length; x++) {
      if (x == cal.getDay()) {
        table[1].cells[x].innerHTML = dayinserter;
        dayinserter++;
      } else if (dayinserter>1) {
        table[1].cells[x].innerHTML = dayinserter;
        dayinserter++;
      } else {
        table[1].cells[x].innerHTML = '';
      }
      if (dayinserter == today.getDate()+1 && highlight == 1) {
        table[1].cells[x].className = 'highlight';
      } else {
        table[1].cells[x].className = '';
      }
    }
    for (let i = 2; i<table.length; i++) {
      for (let j = 0; j<table[i].cells.length; j++) {
        if (dayinserter > numofDays) {
          table[i].cells[j].innerHTML = '';
        } else {
          table[i].cells[j].innerHTML = dayinserter;
          dayinserter++;
        }
        if (dayinserter == today.getDate()+1 && highlight == 1) {
          table[i].cells[j].className = 'highlight';
        } else {
          table[i].cells[j].className = '';
        }
      }
    }
  }
}

