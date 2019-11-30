const QuickifyMessages = {
  PLAY_OR_PAUSE: 'q play/pause',
  NEXT: 'q next',
  PREVIOUS: 'q prev',
  SAVE: 'q save',
  REPEAT: 'q repeat',
  SHUFFLE: 'q shuffle',
  POPUP_ON: 'q popup on',
  POPUP_OFF: 'q popup off',
  STATUS: 'q status',
  CHANGE_VOLUME: 'q change-volume',
  CHANGE_TRACK_PROGRESS: 'q change-track-progress'
};

const QuickifyUrl = 'https://open.spotify.com/*';

const QuickifySendToContent = function (msg) {
  chrome.tabs.query({url: QuickifyUrl},
    function (tabs) {
      // Open a spotify tab if one does not exist yet.
      if (tabs.length === 0) {
        chrome.tabs.create({url: 'https://open.spotify.com'},
          function onCreated(tab) {
            chrome.tabs.sendMessage(tab.id, msg);
          });
      }
      for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, msg);
      }
    });
};
