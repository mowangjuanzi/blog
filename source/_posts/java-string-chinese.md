---
title: Java中json字符串中文的处理
date: 2018-04-19 17:37:52
tags:
- java
- json
categories:
- 编程语言
- java
---
这两天让安卓将json转成字符串传递给我，结果在传递中文时，PHP不能正常解析。

中间想过先把中文转成unicode。但是`\u`会变成`\\u`，还是有问题，无奈之下，只好自己上场，写了一个JAVA脚本提供给安卓了。

以下是所有的JAVA代码：

```java
import net.sf.json.JSONObject;
import java.lang.Character.UnicodeBlock;

public class Main {

    public static void main(String[] args) {
        JSONObject json = new JSONObject();
        json.put("name", "包裹小");
        String result = json.toString();
        System.out.println(result);

        result = jsonParse(result);

        System.out.println(result);
    }

    public static String jsonParse(String jsonStr) {
        char[] myBuffer = jsonStr.toCharArray();

        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < jsonStr.length(); i++) {
            UnicodeBlock ub = UnicodeBlock.of(myBuffer[i]);
			// 判断是否是中日韩文字
            if (ub == UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS) {
                char c = jsonStr.charAt(i);
                sb.append("\\u");
                int j = (c >>>8); //取出高8位
                String tmp = Integer.toHexString(j);
                if (tmp.length() == 1)
                    sb.append("0");
                sb.append(tmp);
                j = (c & 0xFF); //取出低8位
                tmp = Integer.toHexString(j);
                if (tmp.length() == 1)
                    sb.append("0");
                sb.append(tmp);
            } else {
                sb.append(myBuffer[i]);
            }
        }

        return sb.toString();
    }
}
``` 
