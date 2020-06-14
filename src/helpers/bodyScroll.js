const bodyScroll = require('body-scroll-toggle');

let locked = 0;

const scrollLock = () => {
  if (!locked) {
    bodyScroll.disable();
  }

  locked++;
};

const scrollUnlock = () => {
  locked = Math.max(locked - 1, 0);

  if (!locked) {
    bodyScroll.enable();
  }
};

module.exports = { scrollLock, scrollUnlock };
