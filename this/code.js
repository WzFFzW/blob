class CaptchaMachine {
  constructor() {
    this.state = 'init';
  }
  clickEvent() {
    const _this = this;
    function countdown() {
      console.log(this) // 此时this的指向是？
      console.log('进入倒计时，倒计时60s');
      setTimeout(() => {
        console.log(this) // 此时this的指向是？
        _this.state = 'init';
      }, 1 * 1000); // 演示效果，调成1s
    }
    function _clickEvent() {
      switch (this.state) {
        case 'init':
          this.state = 'countDown';
          countdown();
          break;
        case 'countDown':
          console.log('nothing');
          break;
      }
    }
    this.clickEvent = _clickEvent;
    this.clickEvent();
  }
}

function captchaTest() {
  const captchaMachine = new CaptchaMachine();
  captchaMachine.clickEvent();
}

captchaTest();