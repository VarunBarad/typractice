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
    } else {
      hide(successMessage);
      container.classList.remove("success");
    }
  });
  
  buttonStart.focus();
});

const formattedTime = function (seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${Math.floor(remainingSeconds)}` : `${Math.floor(remainingSeconds)}`;
  
  return `${formattedMinutes}:${formattedSeconds}`;
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

const show = (element) => {
  element.classList.add("show");
  element.classList.remove("hide");
};

const hide = (element) => {
  element.classList.add("hide");
  element.classList.remove("show");
};
