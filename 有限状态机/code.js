class LampStateMachine {
  constructor(initState) {
    this.state = initState;
  }
  changeState(state) {
    this.state = state;
  }
  clickEvent() {
    switch (this.state) {
      case 'on':
        this.changeState('off');
        // 触发关灯事件
        // doSomeThing();
        console.log('关灯')
        break;
      case 'off':
        this.changeState('on');
        // 触发开灯事件
        // doSomeThing();
        console.log('开灯');
        break;
    }
  }
}

function test() {
  const lampStateMachine = new LampStateMachine('off');
  for (let i = 0; i < 10; i++) {
    lampStateMachine.clickEvent();
  }
}
// test();

/**
 * state 包括 init countDown 
 */
class CaptchaMachine {
  constructor() {
    this.state = 'init';
  }
  clickEvent() {
    const _this = this;
    function countdown() {
      // console.log(this) 此时this的指向是？
      console.log('进入倒计时，倒计时60s');
      setTimeout(() => {
        // console.log(this) 此时this的指向是？
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

  captchaMachine.clickEvent(); // 并不会更改状态
  console.log('当前状态:', captchaMachine.state); // countDown
  
  captchaMachine.clickEvent(); // 并不会更改状态
  console.log('当前状态:', captchaMachine.state); // countDown

  captchaMachine.clickEvent(); // 并不会更改状态
  console.log('当前状态:', captchaMachine.state); // countDown

  captchaMachine.clickEvent(); // 并不会更改状态
  console.log('当前状态:', captchaMachine.state); // countDown
  setTimeout(() => {
    console.log('2s后的状态', captchaMachine.state);
  }, 2 * 1000); // 为了验证结果，调成2s
  console.log('状态检查结束', captchaMachine.state);
}

captchaTest();