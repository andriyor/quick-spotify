window.console.log('this is content, quality content');
const Quickify = {};

// Whether we are broadcasting.
Quickify.isIdle = true;

// Variable for broadcasting.
Quickify.broadcastInterval = undefined;

// Time since last popup messaging.
Quickify.age = 0;

// Interval time in ms.
Quickify.interval = 400;


Quickify.setIdle = function(idle) {
  if (idle === Quickify.isIdle) return;
  Quickify.log('Set idle to ' + idle);
  Quickify.isIdle = idle;
  if (idle) {
    // Kill broadcasting.
    window.clearInterval(Quickify.broadcastInterval);
    Quickify.broadcastInterval = undefined;
  } else {
    // Start broadcasting.
    Quickify.age = -Quickify.interval;
    Quickify.broadcast();
    Quickify.broadcastInterval = window.setInterval(
        Quickify.broadcast, Quickify.interval);
  }
};


Quickify.broadcast = function() {
  // Set idle if there has been 5min of inactivity with the popup.
  Quickify.age += Quickify.interval;
  if (Quickify.age > 1000 * 60 * 5) {
    Quickify.setIdle(true);
    return;
  }
  const statusMsg = {};
  statusMsg.type = QuickifyMessages.STATUS;

  const trackName = document.querySelector('.track-info .track-info__name a');
  const trackArtist = document.querySelector('.track-info .track-info__artists a');

  const artCoverUrl = document.querySelector("div.now-playing__cover-art .cover-art-image").style.backgroundImage;

  const trackCurrentDiv = document.querySelector(".playback-bar__progress-time");
  const trackLengthDiv = document.querySelectorAll(".playback-bar__progress-time")[1];

  const shuffleButton = document.querySelector("button.control-button[class*='spoticon-shuffle']");
  const repeatButton = document.querySelector("button.control-button[class*='spoticon-repeat']");

  const pauseButton = document.querySelector("button.control-button[class*='spoticon-pause']");
  const addedButton = document.querySelector("button.control-button[class*='spoticon-heart-active-16']");

  statusMsg.song = trackName.textContent;
  statusMsg.artist = trackArtist.textContent;
  statusMsg.artCoverUrl = artCoverUrl;

  statusMsg.songLength = trackLengthDiv.textContent;
  statusMsg.currentTime = trackCurrentDiv.textContent;

  statusMsg.isPlaying = !!pauseButton;
  statusMsg.isSaved = !!addedButton;
  statusMsg.isShuffled = shuffleButton.classList.contains("control-button--active");

  if(repeatButton.classList.contains("control-button--active")){
    if(repeatButton.classList.contains("spoticon-repeatonce-16")){
      statusMsg.repeatMode = "once";
    } else {
      statusMsg.repeatMode = "repeat";
    }
  } else {
    statusMsg.repeatMode = 'off';
  }

  // Retrieve and format the volume value
  const volumeProgressBar = document.querySelector(".volume-bar").querySelector(".progress-bar__fg");
  const width = volumeProgressBar.getBoundingClientRect().width;
  const style = window.getComputedStyle(volumeProgressBar);
  const translate = new WebKitCSSMatrix(style.webkitTransform).m41;
  statusMsg.currentVolume = 1-Math.abs(((translate/width)));
  chrome.runtime.sendMessage(statusMsg);
};


Quickify.log = function(msg) {
  window.console.log('[Quickify] ' + msg);
};

Quickify.resetAge = function() {
  Quickify.age = 0;
};


Quickify.playOrPause = function() {
  (document.querySelector("button.control-button[class*='spoticon-play']") || document.querySelector("button.control-button[class*='spoticon-pause']")).click()
};


Quickify.next = function() {
  document.querySelector("button.control-button[class*='spoticon-skip-forward']").click();
};


Quickify.previous = function() {
  document.querySelector("button.control-button[class*='spoticon-skip-back']").click();
};


Quickify.save = function() {
  (document.querySelector("button.control-button[class*='spoticon-heart-16']") || document.querySelector("button.control-button[class*='spoticon-heart-active-16']")).click();
};


Quickify.repeat = function() {
  document.querySelector("button.control-button[class*='spoticon-repeat']").click();
};


Quickify.shuffle  = function() {
  document.querySelector("button.control-button[class*='spoticon-shuffle']").click();
};


Quickify.changeVolume = function(volume){
  const progressBar = document.querySelector(".volume-bar").querySelector(".progress-bar");
  const left = progressBar.getBoundingClientRect().left;
  const width = progressBar.getBoundingClientRect().width;
  const clientX = left + volume * width;

  progressBar.dispatchEvent(new MouseEvent('mousedown', {bubbles:true, clientX}));
  progressBar.dispatchEvent(new MouseEvent('mouseup', {bubbles:true, clientX}));
};

Quickify.changeTrackProgress = function(progress){
  const progressBar = document.querySelector(".playback-bar").querySelector(".progress-bar");
  const left = progressBar.getBoundingClientRect().left;
  const width = progressBar.getBoundingClientRect().width;
  const clientX = left + progress * width;

  progressBar.dispatchEvent(new MouseEvent('mousedown', {bubbles:true, clientX}));
  progressBar.dispatchEvent(new MouseEvent('mouseup', {bubbles:true, clientX}));
};

Quickify.init = function() {
  // Setup listeners.
  chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        switch (request.command) {
          case QuickifyMessages.POPUP_ON:
            Quickify.setIdle(false);
            break;
          case QuickifyMessages.POPUP_OFF:
            Quickify.setIdle(true);
            return;
          case QuickifyMessages.PLAY_OR_PAUSE:
            Quickify.playOrPause();
            break;
          case QuickifyMessages.NEXT:
            Quickify.next();
            break;
          case QuickifyMessages.PREVIOUS:
            Quickify.previous();
            break;
          case QuickifyMessages.SAVE:
            Quickify.save();
            break;
          case QuickifyMessages.REPEAT:
            Quickify.repeat();
            break;
          case QuickifyMessages.SHUFFLE:
            Quickify.shuffle();
            break;

          case QuickifyMessages.CHANGE_VOLUME:
            Quickify.changeVolume(request.volume);
            break;
          case QuickifyMessages.CHANGE_TRACK_PROGRESS:
            Quickify.changeTrackProgress(request.progress);
            break;
          default:
            Quickify.log("I don't know how to handle this message: " + request);
            return;
        }
        Quickify.resetAge();
        Quickify.broadcast();
      });
};

Quickify.init();
