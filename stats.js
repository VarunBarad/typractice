"use strict";

let graph = null;
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");
  
  const canvasElement = document.getElementById("chart");
  const color = getComputedStyle(canvasElement).getPropertyValue('--color-success');
  const colorTranslucent = getComputedStyle(canvasElement).getPropertyValue('--color-success-translucent');
  
  const records = getRecords();
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
});

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
