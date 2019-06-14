var QuickifyMessages = {
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
  CHANGE_TRACK_PROGRESS : 'q change-track-progress'
};

var QuickifyUrl = 'https://open.spotify.com/*';

var QuickifySendToContent = function(msg) {
  browser.tabs.query({url: QuickifyUrl},
      function(tabs) {
        // Open a spotify tab if one does not exist yet.
        if (tabs.length === 0) {
          browser.tabs.create({url: 'https://open.spotify.com'},
            function onCreated(tab) {
              browser.tabs.sendMessage(tab.id, msg);
            });
        }
        for (var i = 0; i < tabs.length; i++) {
          browser.tabs.sendMessage(tabs[i].id, msg);
        };
      });
};
