window.console.log('This is popping!');
QuickifyPopup = {};

QuickifyPopup.handleStatus = function(request, sender, sendResponse) {
  if (request.type != QuickifyMessages.STATUS) return;
  QuickifyPopup.song.textContent = request.song;
  QuickifyPopup.artist.textContent = request.artist;
  QuickifyPopup.playpauseBtn.classList.toggle('pause', request.isPlaying);
  QuickifyPopup.shuffleBtn.classList.toggle('on', request.isShuffled);
  QuickifyPopup.repeatBtn.classList.toggle('on', request.isRepeated);
  QuickifyPopup.addBtn.classList.toggle('done', request.isSaved);
  QuickifyPopup.artCover.style.backgroundImage = request.artCoverUrl;
  var volumeSize = 100;
  QuickifyPopup.volumeProgress.style.transform = "translateY(" + (volumeSize - (request.currentVolume * volumeSize)) + "px)";
  QuickifyPopup.volumeProgress.style.height = (request.currentVolume * volumeSize);

  // Calculate and display time differently for normal and beta players.
  var percent = 0;
  var cTime = parseTime(request.currentTime);
  if (request.songLength) {
    percent = cTime / parseTime(request.songLength);
  } else if (request.remainingTime) {
    percent = cTime / (cTime + parseTime(request.remainingTime));
  }
  QuickifyPopup.setTime(
      request.currentTime,
      request.songLength || request.remainingTime,
      percent);

  // Parse time to set progress accordingly.
  function parseTime(time) {
    var tArr = time.split(':');
    var secs = 0;
    var mult = 1;
    for (var i = tArr.length - 1; i >=0; i--) {
      secs += Number(tArr[i]) * mult;
      mult *= 60;
    }
    return secs;
  };
};

QuickifyPopup.setTime = function(currentTime, songLength, percent) {
  QuickifyPopup.currentTime.textContent = currentTime;
  QuickifyPopup.songLength.textContent = songLength;
  var newWidth = percent * 280;
  QuickifyPopup.timeProgress.style.width = Math.round(newWidth) + 'px';
  // TODO handle be able to drag/drop time.
};



QuickifyPopup.init = function() {
  QuickifyPopup.song = document.getElementById('song');
  QuickifyPopup.artist = document.getElementById('artist');
  QuickifyPopup.prevBtn = document.getElementById('prev');
  QuickifyPopup.nextBtn = document.getElementById('next');
  QuickifyPopup.playpauseBtn = document.getElementById('playpause');
  QuickifyPopup.addBtn = document.getElementById('add');
  QuickifyPopup.shuffleBtn = document.getElementById('shuffle');
  QuickifyPopup.repeatBtn = document.getElementById('repeat');
  QuickifyPopup.currentTime = document.getElementById('current');
  QuickifyPopup.timeProgress = document.getElementById('progress');
  QuickifyPopup.songLength = document.getElementById('end');
  QuickifyPopup.openLinkBtn = document.getElementById('link');
  QuickifyPopup.artCover = document.getElementById('artCover');
  QuickifyPopup.volumeBar = document.getElementById('volume');
  QuickifyPopup.volumeProgress = document.getElementById('volume-progress');
  

  // Add listeners for buttons.
  QuickifyPopup.prevBtn.addEventListener('click', function() {
    QuickifySendToContent({'command' : QuickifyMessages.PREVIOUS});
  });
  QuickifyPopup.nextBtn.addEventListener('click', function() {
    QuickifySendToContent({'command' : QuickifyMessages.NEXT});
  });
  QuickifyPopup.playpauseBtn.addEventListener('click', function() {
    QuickifySendToContent({'command' : QuickifyMessages.PLAY_OR_PAUSE});
  });
  QuickifyPopup.addBtn.addEventListener('click', function() {
    QuickifySendToContent({'command' : QuickifyMessages.SAVE});
  });
  QuickifyPopup.shuffleBtn.addEventListener('click', function() {
    QuickifySendToContent({'command' : QuickifyMessages.SHUFFLE});
  });
  QuickifyPopup.repeatBtn.addEventListener('click', function() {
    QuickifySendToContent({'command' : QuickifyMessages.REPEAT});
  });
  QuickifyPopup.openLinkBtn.addEventListener('click', function() {
    browser.tabs.query({url: QuickifyUrl},
      function(tabs) {
        if (tabs.length) {
          browser.tabs.update(tabs[0].id, {active: true});
        }
      });
  });

  QuickifyPopup.volumeBar.addEventListener('click', function(event) {
    var volume = 0;
    var bottom = QuickifyPopup.volumeBar.getBoundingClientRect().bottom;
    var height = QuickifyPopup.volumeBar.getBoundingClientRect().height;
    volume = (bottom - event.clientY) / height;
    QuickifySendToContent({'command' : QuickifyMessages.CHANGE_VOLUME, 'volume' : volume});
  });

  // Set up update listener.
  browser.runtime.onMessage.addListener(QuickifyPopup.handleStatus);

  // Notify content we have started.
  QuickifySendToContent({'command' : QuickifyMessages.POPUP_ON});
};

QuickifyPopup.exit = function() {
  QuickifySendToContent({'command' : QuickifyMessages.POPUP_OFF});
};

window.onload = QuickifyPopup.init;
// TODO: This isn't working, nbd but should figure it out eventually.
window.onbeforeunload = QuickifyPopup.exit;
