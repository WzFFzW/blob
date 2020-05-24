# 前言
关于this的总结，我们应该不难看到一个通用结论
> const obj = {a: 1, b: function(){console.log(this.a);}}
- 作为对象方法调用，obj.b(), this指向obj
- 作为函数直接调用， const b = obj.b; b(); this指向window // strict模式指向undefined
- 作为构造函数调用 const Fn = obj.b; const fn = new Fn(); this指向当前实例对象
- 作为call，apply调用，this指向第一个参数

在上一篇blob中，留下了一个问题
```js
class CaptchaMachine {
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
```
这两个输出的this是undefined，为什么呢？

按照上面的通用理解，应该是window才对啊。结果确实undefined。

这个是mdn已经指出：在class内，会是strict模式的，即使没有显示声明。以下为mdn的解释
> Note: Classes are always strict mode code. Calling methods with an undefined this will throw an error.

# 正文
看起来关于this的总结，好像没有什么问题。只是class内部默认strict模式，所以this变成了undefined。上面这个总结是不是对的呢？我们在看看下面的代码
> (false || obj.b)(); // undefined

这个又是为什么呢。

我们先来看看this普遍使用在哪里
1. 函数内部
2. 全局代码（不多）

我们去看看函数调用的规范
```
11.2.3 Function Calls
The production CallExpression : MemberExpression Arguments is evaluated as follows:

1.Let ref be the result of evaluating MemberExpression.

2.Let func be GetValue(ref).

3.Let argList be the result of evaluating Arguments, producing an internal list of argument values (see 11.2.4).

4.If Type(func) is not Object, throw a TypeError exception.

5.If IsCallable(func) is false, throw a TypeError exception.

6.If Type(ref) is Reference, then

    a.If IsPropertyReference(ref) is true, then

        Let thisValue be GetBase(ref).

    b.Else, the base of ref is an Environment Record

        Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref).

7. Else, Type(ref) is not Reference.

      a.Let thisValue be undefined.

8.Return the result of calling the [[Call]] internal method on func, providing thisValue as the this value and providing the list argList as the argument values.
```
只需要看1、6、7，其他与本次主题无关
![逻辑图](http://liyangready.github.io/2016/07/31/%E6%A0%B9%E6%B2%BBJavaScript%E4%B8%AD%E7%9A%84this-ECMAScript%E8%A7%84%E8%8C%83%E8%A7%A3%E8%AF%BB/1.jpg)

## 解释Reference
Reference type按字面翻译就是引用类型，但是它并不是我们常说的JavaScript中的引用类型，它是一个规范类型（实际并不存在），也就是说是为了解释规范某些行为而存在的，比如delete、typeof、赋值语句等。

通俗一点，js内部有一种数据结构，是这一个样子的
```js
base value: 指向引用的原值
referenced name：reference的名字
strict reference flag：标示是否严格模式
举例
const a = 1

// a的reference
base value：EnvironmentRecord
reference name：a
strict： false
```
怎么生成的？
可以按照下面的路径去看规范
1. 11.1.2查看表达式如何解析，这里说要参照10.3.1
2. 10.3.1规定，env为当前的词法环境（Lexical Environments，也就是EnvironmentRecord），Identifier为‘a’，strict为当前是否严格模式的值，传入GetIdentifierReference（10.2.2.1）去获取结果
3. 10.2.2.1说明结果是base value是Lexical Environments，name是‘a’，strict是false（这里也涉及了作用域链，规范中的第5小点）

## 现在我们来解释(false || obj.b)()
> MemberExpression = (false || obj.b)

参照上面的查找方法
1. ref 是MemberExpression的执行结果，
2. 根据11.11，知道ref是getValue(obj.b)的返回
3. 根据8.7.1，getValue返回的是reference的base value或者是js的基础值（string，null，boolean...）
4. 走计算的第7点*Else, Type(ref) is not Reference.Let thisValue be undefined.*

看起来，流程已经结束了，那么this应该是undefined，执行应该报错，但是实际却没有
这里还差一步
```
10.4.3
1. If the function code is strict code, set the ThisBinding to thisArg.
2. Else if thisArg is null or undefined, set the ThisBinding to the global object.(在浏览器环境就是window)
```
至此，this就被确定下来了。

# 关于箭头函数
**箭头函数没有 this，所以需要通过查找作用域链来确定 this 的值。**
这就意味着如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this。

# 总结
开篇提出的关于this的通用结论，是不是正确的呢？是，但是总结的不全面。这个通用结论可以在日常工作中去帮助我们快速判断this的指向。但是遇到比较奇怪的bug或者问题的时候，我们可以跟着规范去进行一步步解析this。

# 引用
http://liyangready.github.io/2016/07/31/%E6%A0%B9%E6%B2%BBJavaScript%E4%B8%AD%E7%9A%84this-ECMAScript%E8%A7%84%E8%8C%83%E8%A7%A3%E8%AF%BB/

