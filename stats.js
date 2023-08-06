"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const records = getRecords();
  updateGraph(records);
  updateTable(records);
});

const updateTable = (records) => {
  const tableBody = document.querySelector('#stats-table > tbody');
  tableBody.innerHTML = '';
  
  if (records.length === 0) {
    const row = document.createElement('tr');
    const emptyCell = document.createElement('td');
    emptyCell.colSpan = 8;
    emptyCell.innerText = 'No records yet.';
    row.appendChild(emptyCell);
    tableBody.appendChild(row);
  } else {
    const groupedRecords = records.reduce((groups, record) => {
      if (!groups[record.paragraphIndex]) {
        groups[record.paragraphIndex] = {
          paragraphIndex: record.paragraphIndex,
          records: [],
        };
      }
      groups[record.paragraphIndex].records.push(record);
      
      return groups;
    }, []);
    
    const summarisedRecords = groupedRecords.map((group) => {
      return {
        paragraphIndex: group.paragraphIndex,
        numberOfAttempts: group.records.length,
        bestTimeInSeconds: Math.min(...group.records.map(record => record.timeTakenInSeconds)),
        worstTimeInSeconds: Math.max(...group.records.map(record => record.timeTakenInSeconds)),
        averageTimeInSeconds: Math.floor(group.records.reduce((sum, record) => sum + record.timeTakenInSeconds, 0) / group.records.length),
        bestWordsPerMinute: Math.min(...group.records.map(record => record.wordsPerMinute)),
        worstWordsPerMinute: Math.max(...group.records.map(record => record.wordsPerMinute)),
        averageWordsPerMinute: Math.floor(group.records.reduce((sum, record) => sum + record.wordsPerMinute, 0) / group.records.length),
      };
    });
    
    summarisedRecords.forEach((recordGroup) => {
      const row = document.createElement('tr');
      
      const cellParagraphIndex = document.createElement('td');
      cellParagraphIndex.innerText = `${parseInt(recordGroup.paragraphIndex) + 1}`;
      row.appendChild(cellParagraphIndex);
      
      const cellNumberOfAttempts = document.createElement('td');
      cellNumberOfAttempts.innerText = `${recordGroup.numberOfAttempts}`;
      row.appendChild(cellNumberOfAttempts);
      
      const cellBestTime = document.createElement('td');
      cellBestTime.innerText = `${formattedTime(recordGroup.bestTimeInSeconds)}`;
      row.appendChild(cellBestTime);
      
      const cellWorstTime = document.createElement('td');
      cellWorstTime.innerText = `${formattedTime(recordGroup.worstTimeInSeconds)}`;
      row.appendChild(cellWorstTime);
      
      const cellAverageTime = document.createElement('td');
      cellAverageTime.innerText = `${formattedTime(recordGroup.averageTimeInSeconds)}`;
      row.appendChild(cellAverageTime);
      
      const cellBestWordsPerMinute = document.createElement('td');
      cellBestWordsPerMinute.innerText = `${recordGroup.bestWordsPerMinute}`;
      row.appendChild(cellBestWordsPerMinute);
      
      const cellWorstWordsPerMinute = document.createElement('td');
      cellWorstWordsPerMinute.innerText = `${recordGroup.worstWordsPerMinute}`;
      row.appendChild(cellWorstWordsPerMinute);
      
      const cellAverageWordsPerMinute = document.createElement('td');
      cellAverageWordsPerMinute.innerText = `${recordGroup.averageWordsPerMinute}`;
      row.appendChild(cellAverageWordsPerMinute);
      
      tableBody.appendChild(row);
    });
  }
};

let graph = null;
const updateGraph = (records) => {
  const canvasElement = document.getElementById("chart");
  const color = getComputedStyle(canvasElement).getPropertyValue('--color-success');
  const colorTranslucent = getComputedStyle(canvasElement).getPropertyValue('--color-success-translucent');
  
  if (graph !== null) {
    graph.destroy();
  }
  graph = new Chart(canvasElement, {
    type: 'line',
    data: {
      labels: records.map(record => record.timestamp),
      datasets: [{
        label: 'Words per minute',
        data: records.map(record => record.wordsPerMinute),
        borderWidth: 1,
        borderColor: color,
        backgroundColor: colorTranslucent,
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            text: 'Words per minute',
            display: true,
          },
        },
        x: {
          title: {
            text: 'Attempted at',
            display: true,
          },
        },
      },
      plugins: {
        legend: {
          display: true
        },
      },
    },
  });
};

const getRecords = () => {
  const database = JSON.parse(localStorage.getItem("database"));
  if (!database) {
    return [];
  }
  
  return Object.entries(database.records).flatMap(([paragraphIndex, paragraphRecords]) => {
    const numberOfWordsInParagraph = paragraphs[paragraphIndex].split(/\s+/).length;
    return paragraphRecords.map(record => {
      const wordsPerMinute = Math.floor(numberOfWordsInParagraph / (record.timeTakenInSeconds / 60));
      const createdAt = new Date(record.createdAt);
      const date = createdAt.toISOString().split('T')[0];
      const time = createdAt.toTimeString().split(' ')[0].split(':').splice(0, 2).join(':');
      
      return {
        createdAt: record.createdAt,
        timestamp: `${date} ${time}`,
        wordsPerMinute: wordsPerMinute,
        timeTakenInSeconds: record.timeTakenInSeconds,
        paragraphIndex: paragraphIndex,
      };
    });
  }).sort((a, b) => (new Date(a.createdAt)) - (new Date(b.createdAt)));
};
