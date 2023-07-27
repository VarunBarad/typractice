"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");
  
  const selectedParagraphId = Math.floor(Math.random() * paragraphs.length);
  const selectedParagraph = paragraphs[selectedParagraphId];
  
  const dynamicParagraph = document.getElementById("dynamic-paragraph");
  const userInput = document.getElementById("user-input");
  const buttonStart = document.getElementById("button-start");
  const timerElement = document.getElementById("timer");
  const successMessage = document.getElementById("success-message");
  
  let intervalHandle = null;
  
  dynamicParagraph.textContent = selectedParagraph;
  
  buttonStart.addEventListener('click', function () {
    show(userInput);
    hide(buttonStart);
    userInput.focus({focusVisible: true});
    
    intervalHandle = setInterval(
      function () {
        timerElement.innerText = `Timer: ${formattedTime(durationInSeconds())}`;
      },
      10,
    );
    startTimer();
  });
  
  userInput.addEventListener("input", function () {
    if (userInput.value === selectedParagraph) {
      userInput.disabled = true;
      
      clearInterval(intervalHandle);
      endTimer();
      const time = durationInSeconds();
      timerElement.innerText = `Timer: ${formattedTime(time)}`;
      
      const numberOfWords = selectedParagraph.split(/\s+/).length;
      const wordsPerMinute = Math.floor(numberOfWords / (time / 60));
      
      successMessage.innerText = `Congratulations! You completed the paragraph at ${wordsPerMinute} words per minute.`;
      
      show(successMessage);
      container.classList.add("success");
      
      updateRecords(selectedParagraphId, time);
    } else {
      hide(successMessage);
      container.classList.remove("success");
    }
  });
  
  buttonStart.focus();
});

const updateRecords = function (selectedParagraphId, timeTakenInSeconds) {
  let database = JSON.parse(localStorage.getItem("database"));
  if (!database) {
    database = {
      versionCode: 1,
      records: {},
    };
  }
  
  if (!database.records[`${selectedParagraphId}`]) {
    database.records[`${selectedParagraphId}`] = [];
  }
  
  database.records[`${selectedParagraphId}`].push({
    createdAt: (new Date()).toISOString(),
    timeTakenInSeconds: timeTakenInSeconds,
  });
  
  localStorage.setItem("database", JSON.stringify(database));
};

let startTime = null;
let endTime = null;

const startTimer = function () {
  startTime = new Date();
};

const endTimer = function () {
  endTime = new Date();
};

const durationInSeconds = function () {
  if (endTime === null) {
    const now = new Date();
    return (now - startTime) / 1000;
  } else {
    return (endTime - startTime) / 1000;
  }
};
