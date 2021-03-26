
下面都是一些碎碎念啦，会有彩蛋吗？
------------------------------------------------------------------------------

3.22 周一 晴

今天看了下umi-request的源码，这些源码都很简单。不过我依旧花了一点时间才搞明白了一个问题。想明白了以后就被自己蠢哭，这种半个小时就能看出来的问题，我竟然摸了那么久的<・)))><<
同一个接口分片并发时，由于在拦截器里配了baseUrl，导致baseUrl累加。这个问题只要把拦截器设置global: true即可。
但是，我个人感觉，既然全局拦截器里无论如何都有一个 addfix 函数来处理prefix，那就把baseUrl放prefix里吧~
global属性为true，拦截器handler被push到 原型 Core的requestInterceptors数组里。
glabal为false，则push到当前实例：

```javascript
if (opt.global) {
   Core.requestInterceptors.push(handler);
} else {
   this.instanceRequestInterceptors.push(handler);
}
```

而源码又是如何处理拦截器的handlers呢？每个handler都是一个promise，返回值分配给累加器。源码不贴了。太简单了，很好找。

------分割线------

最开始的日记。

这一切是怎么变成如今这么乱七八糟的模样的呢...

我想尝试下神往已久的graphql。于是我注释掉了router，新建了schema，引入了graphql。

redux怎么比vuex还啰嗦。简直就是又臭又长又各种打结的裹脚布啊！

@apollo/client 还有状态管理功能？果然尝试！啊，好像不太好使诶...

试试dva，看上去和vuex差不多。

这就是umi-test目录的由来啦。

话说umi-request看上去不错诶..

Finally, it works~

Big Sur 真坑。系统升级后，git 报了一个443错误，第一反应是梯子的原因。想不到得重新install一些依赖。

`xcode-select --install`

然后就是gitub了，默认分支从master改成main了。吭哧吭哧的，就push到master了。只好吭哧吭哧各种补救。
