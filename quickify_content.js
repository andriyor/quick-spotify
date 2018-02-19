window.console.log('this is content, quality content');
var Quickify = {};

// Whether we are broadcasting.
Quickify.isIdle = true;

// Variable for broadcasting.
Quickify.broadcastInterval = undefined;

// Time since last popup messaging.
Quickify.age = 0;

// Interval time in ms.
Quickify.interval = 400;


Quickify.setIdle = function(idle) {
  if (idle == Quickify.isIdle) return;
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
  var statusMsg = {};
  statusMsg.type = QuickifyMessages.STATUS;

  var trackName = document.querySelector('.track-info .track-info__name a');
  var trackArtist = document.querySelector('.track-info .track-info__artists a');

  var trackCurrentDiv = document.querySelector(".playback-bar__progress-time");
  var trackLengthDiv = document.querySelectorAll(".playback-bar__progress-time")[1];  

  var shuffleButton = document.querySelector("button.control-button[class*='spoticon-shuffle']");
  var repeatButton = document.querySelector("button.control-button[class*='spoticon-repeat']");
  var pauseButton = document.querySelector("button.control-button[class*='spoticon-pause']")
  var addedButton = document.querySelector("button.control-button[class*='spoticon-added']")

  statusMsg.song = trackName.textContent;
  statusMsg.artist = trackArtist.textContent;

  statusMsg.songLength = trackLengthDiv.textContent;
  statusMsg.currentTime = trackCurrentDiv.textContent;

  statusMsg.isPlaying = pauseButton ? true : false;
  statusMsg.isSaved = addedButton ? true : false;
  statusMsg.isShuffled = shuffleButton.classList.contains("control-button--active");  
  statusMsg.isRepeated = repeatButton.classList.contains("control-button--active");

  browser.runtime.sendMessage(statusMsg);
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
  (document.querySelector("button.control-button[class*='spoticon-add']") || document.querySelector("button.control-button[class*='spoticon-added']")).click();
};


Quickify.repeat = function() {
  document.querySelector("button.control-button[class*='spoticon-repeat']").click();
};


Quickify.shuffle  = function() {
  document.querySelector("button.control-button[class*='spoticon-shuffle']").click();
};


Quickify.init = function() {
  // Setup listeners.
  browser.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        switch (request) {
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
          default:
            Quickify.log("I don't know how to handle this message: " + request);
            return;
        }
        Quickify.resetAge();
        Quickify.broadcast();
      });
};

Quickify.init();
