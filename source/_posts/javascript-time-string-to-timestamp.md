---
title: 记一次js处理时间字符串转为时间戳的问题
date: 2017-11-17 16:26:48
tags:
- javascript
categories:
- 编程语言
- javascript
---
今天朋友问我，js应该如何将时间字符串转为时间戳。

我下意识就去百度，结果找到的，写法却是复杂无比，比如下面这个：

````js
(function($) {
    $.extend({
        myTime: {
            /**
             * 当前时间戳
             * @return <int>        unix时间戳(秒)  
             */
            CurTime: function(){
                return Date.parse(new Date())/1000;
            },
            /**              
             * 日期 转换为 Unix时间戳
             * @param <string> 2014-01-01 20:20:20  日期格式              
             * @return <int>        unix时间戳(秒)              
             */
            DateToUnix: function(string) {
                var f = string.split(' ', 2);
                var d = (f[0] ? f[0] : '').split('-', 3);
                var t = (f[1] ? f[1] : '').split(':', 3);
                return (new Date(
                        parseInt(d[0], 10) || null,
                        (parseInt(d[1], 10) || 1) - 1,
                        parseInt(d[2], 10) || null,
                        parseInt(t[0], 10) || null,
                        parseInt(t[1], 10) || null,
                        parseInt(t[2], 10) || null
                        )).getTime() / 1000;
            },
            /**              
             * 时间戳转换日期              
             * @param <int> unixTime    待时间戳(秒)              
             * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)              
             * @param <int>  timeZone   时区              
             */
            UnixToDate: function(unixTime, isFull, timeZone) {
                if (typeof (timeZone) == 'number')
                {
                    unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
                }
                var time = new Date(unixTime * 1000);
                var ymdhis = "";
                ymdhis += time.getUTCFullYear() + "-";
                ymdhis += (time.getUTCMonth()+1) + "-";
                ymdhis += time.getUTCDate();
                if (isFull === true)
                {
                    ymdhis += " " + time.getUTCHours() + ":";
                    ymdhis += time.getUTCMinutes() + ":";
                    ymdhis += time.getUTCSeconds();
                }
                return ymdhis;
            }
        }
    });
})(jQuery);
````

看起来就非常的麻烦。于是我想到去官方文档去了一下，还真让我找到了。于是写了这么一个demo，这里我们并不需要将时间戳转化为字符串。

````js
//时间字符串转化为时间戳
function str2time(data){
	if (data.length == 10) {
		data += ' 00:00:00';
	}

	var date = new Date(data);
	return (date.getTime() / 1000);
}
````

这么一个简单的工作就完成了。

在这里要注意的一个坑就是，注意服务器的时区是否跟浏览器的时区相同，如果不同，那么显示的时间跟服务器就会有几个小时的误差。具体的误差就看差着几个时区了。

我这里对于这个也是抛砖引玉。

具体复杂的，可以看看我列出的参考连接。就是在`new Date`注意看看传入的值就好了。

> 参考文档：
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
