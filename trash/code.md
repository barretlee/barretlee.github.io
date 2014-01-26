---
layout: page
title: 浅谈文字编码和Unicode(转)
published: false
---

原文地址：<http://www.fmddlmyy.cn/text17.html>

<H1 style="font-size:30px;">浅谈文字编码和Unicode（下）</H1>
<H2>3 字符编码模型</H2>
<P>
程序员经常会面对复杂的问题，而降低复杂性的最简单的方法就是分而治之。Peter Constable在他的文章<A HREF="http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&item_id=IWS-Chapter03" target="_top">"Character set encoding basics 
Understanding character set encodings and legacy encodings"</A>中描述了字符编码的四层模型。我觉得这种说法确实可以更清晰地展现字符编码中发生的事情，所以在这里也介绍一下。
</P>
<H3>3.1 字符的范围（Abstract character repertoire）</H3>
<P>设计字符编码的第一层就是确定字符的范围，即要支持哪些字符。有些编码方案的字符范围是固定的，例如ASCII、ISO 8859 系列。有些编码方案的字符范围是开放的，例如Unicode的字符范围就是世界上所有的字符。</P>
<H3>3.2 用数字表示字符（Coded character set）</H3>
<P>设计字符编码的第二层是将字符和数字对应起来。可以将这个层次理解成数学家（即从数学角度）看到的字符编码。数学家看到的字符编码是一个正整数。例如在Unicode中：汉字“&#23383;”对应的数字是23383。汉字“<IMG SRC="http://www.fmddlmyy.cn/images/134192.png" WIDTH="14" HEIGHT="15" BORDER="0" ALT="">”对应的数字是134192。</P>
<P>在写html文件时，可以通过输入"&amp;#23383;"来插入字符“字”。不过在设计字符编码时，我们还是习惯用16进制表示数字。即将23383写成0x5BD7，将134192写成0x20C30。</P>
<H3>3.3 用基本数据类型表示字符（Character encoding form）</H3>
<P>设计字符编码的第三层是用编程语言中的基本数据类型来表示字符。可以将这个层次理解成程序员看到的字符编码。在Unicode中，我们有很多方式将数字23383表示成程序中的数据，包括：UTF-8、UTF-16、UTF-32。UTF是“UCS Transformation Format”的缩写，可以翻译成Unicode字符集转换格式，即怎样将Unicode定义的数字转换成程序数据。例如，“汉字”对应的数字是0x6c49和0x5b57，而编码的程序数据是：</P>
<P>
<PRE>
	BYTE data_utf8[] = {0xE6, 0xB1, 0x89, 0xE5, 0xAD, 0x97};	// UTF-8编码
	WORD data_utf16[] = {0x6c49, 0x5b57};				// UTF-16编码
	DWORD data_utf32[] = {0x6c49, 0x5b57};				// UTF-32编码</PRE></P>
<P>这里用BYTE、WORD、DWORD分别表示无符号8位整数，无符号16位整数和无符号32位整数。UTF-8、UTF-16、UTF-32分别以BYTE、WORD、DWORD作为编码单位。</P>
<P>“汉字”的UTF-8编码需要6个字节。“汉字”的UTF-16编码需要两个WORD，大小是4个字节。“汉字”的UTF-32编码需要两个DWORD，大小是8个字节。4.2节会介绍将数字映射到UTF编码的规则。
</P>
<H3>3.4 作为字节流的字符（Character encoding scheme）</H3>
<P>字符编码的第四层是计算机看到的字符，即在文件或内存中的字节流。例如，“字”的UTF-32编码是0x5b57，如果用little endian表示，字节流是“57 5b 00 00”。如果用big endian表示，字节流是“00 00 5b 57”。</P>
<P>字符编码的第三层规定了一个字符由哪些编码单位按什么顺序表示。字符编码的第四层在第三层的基础上又考虑了编码单位内部的字节序。UTF-8的编码单位是字节，不受字节序的影响。UTF-16、UTF-32根据字节序的不同，又衍生出UTF-16LE、UTF-16BE、UTF-32LE、UTF-32BE四种编码方案。LE和BE分别是Little Endian和Big Endian的缩写。</P>
<H3>3.5 小结</H3>
<P>通过四层模型，我们又把字符编码中发生的这些事情梳理了一遍。其实大多数代码页都不需要完整的四层模型，例如GB18030以字节为编码单位，直接规定了字节序列和字符的映射关系，跳过了第二层，也不需要第四层。</P>
<H2>4 再谈Unicode</H2>
<P>Unicode是国际组织制定的可以容纳世界上所有文字和符号的字符编码方案。Unicode用数字0-0x10FFFF来映射这些字符，最多可以容纳1114112个字符，或者说有1114112个码位。码位就是可以分配给字符的数字。UTF-8、UTF-16、UTF-32都是将数字转换到程序数据的编码方案。</P>
<P>Unicode字符集可以简写为UCS（Unicode Character Set）。早期的Unicode标准有UCS-2、UCS-4的说法。UCS-2用两个字节编码，UCS-4用4个字节编码。UCS-4根据最高位为0的最高字节分成2^7=128个group。每个group再根据次高字节分为256个平面（plane）。每个平面根据第3个字节分为256行 （row），每行有256个码位（cell）。group 0的平面0被称作BMP（Basic Multilingual Plane）。将UCS-4的BMP去掉前面的两个零字节就得到了UCS-2。</P>
<P>Unicode标准计划使用group 0 的17个平面: 从BMP（平面0）到平面16，即数字0-0x10FFFF。《谈谈Unicode编码》主要介绍了BMP的编码，本文将介绍完整的Unicode编码，并从多个角度浏览Unicode。本文的介绍基于Unicode 5.0.0版本。</P>
<H3>4.1 浏览Unicode</H3>
<P>先看一些数字：每个平面有2^16=65536个码位。Unicode计划使用了17个平面，一共有17*65536=1114112个码位。其实，现在已定义的码位只有238605个，分布在平面0、平面1、平面2、平面14、平面15、平面16。其中平面15和平面16上只是定义了两个各占65534个码位的专用区（Private Use Area），分别是0xF0000-0xFFFFD和0x100000-0x10FFFD。所谓专用区，就是保留给大家放自定义字符的区域，可以简写为PUA。</P>
<P>平面0也有一个专用区：0xE000-0xF8FF，有6400个码位。平面0的0xD800-0xDFFF，共2048个码位，是一个被称作代理区（Surrogate）的特殊区域。它的用途将在4.2节介绍。</P>
<P>238605-65534*2-6400-2408=99089。余下的99089个已定义码位分布在平面0、平面1、平面2和平面14上，它们对应着Unicode目前定义的99089个字符，其中包括71226个汉字。平面0、平面1、平面2和平面14上分别定义了52080、3419、43253和337个字符。平面2的43253个字符都是汉字。平面0上定义了27973个汉字。</P>
<P>在更深入地了解Unicode字符前，我们先了解一下UCD。</P>
<H4>4.1.1 什么是UCD</H4>
<P>UCD是Unicode字符数据库（Unicode Character Database）的缩写。UCD由一些描述Unicode字符属性和内部关系的纯文本或html文件组成。大家可以在Unicode组织的网站看到UCD的<A HREF="http://www.unicode.org/ucd/">最新版本</A>。
</P>
<P>UCD中的文本文件大都是适合于程序分析的Unicode相关数据。其中的html文件解释了数据库的组织，数据的格式和含义。UCD中最庞大的文件无疑就是描述汉字属性的文件Unihan.txt。在UCD 5.0,0中，Unihan.txt文件大小有28,221K字节。Unihan.txt中包含了很多有参考价值的索引，例如汉字部首、笔划、拼音、使用频度、四角号码排序等。这些索引都是基于一些比较权威的辞典，但大多数索引只能检索部分汉字。</P>
<P>我介绍UCD的目的主要是为了使用其中的两个概念：Block和Script。</P>
<H4>4.1.2 Block</H4>
<P>UCD中的Blocks.txt将Unicode的码位分割成一些连续的Block，并描述了每个Block的用途：</P>
<TABLE border="1">
<TR><TD>开始码位</TD><TD>结束码位</TD><TD>Block名称（英文）</TD><TD>Block名称（中文）</TD></TR>
<TR><TD>0000</TD><TD>007F</TD><TD>Basic Latin</TD><TD>基本拉丁字母</TD></TR>
<TR><TD>0080</TD><TD>00FF</TD><TD>Latin-1 Supplement</TD><TD>拉丁字母补充-1</TD></TR>
<TR><TD>0100</TD><TD>017F</TD><TD>Latin Extended-A</TD><TD>拉丁字母扩充-A</TD></TR>
<TR><TD>0180</TD><TD>024F</TD><TD>Latin Extended-B</TD><TD>拉丁字母扩充-B</TD></TR>
<TR><TD>0250</TD><TD>02AF</TD><TD>IPA Extensions</TD><TD>国际音标扩充</TD></TR>
<TR><TD>02B0</TD><TD>02FF</TD><TD>Spacing Modifier Letters</TD><TD>进格修饰字符</TD></TR>
<TR><TD>0300</TD><TD>036F</TD><TD>Combining Diacritical Marks</TD><TD>组合附加符号</TD></TR>
<TR><TD>0370</TD><TD>03FF</TD><TD>Greek and Coptic</TD><TD>希腊文和哥普特文</TD></TR>
<TR><TD>0400</TD><TD>04FF</TD><TD>Cyrillic</TD><TD>西里尔文</TD></TR>
<TR><TD>0500</TD><TD>052F</TD><TD>Cyrillic Supplement</TD><TD>西里尔文补充</TD></TR>
<TR><TD>0530</TD><TD>058F</TD><TD>Armenian</TD><TD>亚美尼亚文</TD></TR>
<TR><TD>0590</TD><TD>05FF</TD><TD>Hebrew</TD><TD>希伯来文</TD></TR>
<TR><TD>0600</TD><TD>06FF</TD><TD>Arabic</TD><TD>基本阿拉伯文</TD></TR>
<TR><TD>0700</TD><TD>074F</TD><TD>Syriac</TD><TD>叙利亚文</TD></TR>
<TR><TD>0750</TD><TD>077F</TD><TD>Arabic Supplement</TD><TD>阿拉伯文补充</TD></TR>
<TR><TD>0780</TD><TD>07BF</TD><TD>Thaana</TD><TD>塔纳文</TD></TR>
<TR><TD>07C0</TD><TD>07FF</TD><TD>NKo</TD><TD>N'Ko字母表</TD></TR>
<TR><TD>0900</TD><TD>097F</TD><TD>Devanagari</TD><TD>天成文书（梵文）</TD></TR>
<TR><TD>0980</TD><TD>09FF</TD><TD>Bengali</TD><TD>孟加拉文</TD></TR>
<TR><TD>0A00</TD><TD>0A7F</TD><TD>Gurmukhi</TD><TD>锡克教文</TD></TR>
<TR><TD>0A80</TD><TD>0AFF</TD><TD>Gujarati</TD><TD>古吉拉特文</TD></TR>
<TR><TD>0B00</TD><TD>0B7F</TD><TD>Oriya</TD><TD>奥里亚文</TD></TR>
<TR><TD>0B80</TD><TD>0BFF</TD><TD>Tamil</TD><TD>泰米尔文</TD></TR>
<TR><TD>0C00</TD><TD>0C7F</TD><TD>Telugu</TD><TD>泰卢固文</TD></TR>
<TR><TD>0C80</TD><TD>0CFF</TD><TD>Kannada</TD><TD>卡纳达文</TD></TR>
<TR><TD>0D00</TD><TD>0D7F</TD><TD>Malayalam</TD><TD>德拉维族文</TD></TR>
<TR><TD>0D80</TD><TD>0DFF</TD><TD>Sinhala</TD><TD>僧伽罗文</TD></TR>
<TR><TD>0E00</TD><TD>0E7F</TD><TD>Thai</TD><TD>泰文</TD></TR>
<TR><TD>0E80</TD><TD>0EFF</TD><TD>Lao</TD><TD>老挝文</TD></TR>
<TR><TD>0F00</TD><TD>0FFF</TD><TD>Tibetan</TD><TD>藏文</TD></TR>
<TR><TD>1000</TD><TD>109F</TD><TD>Myanmar</TD><TD>缅甸文</TD></TR>
<TR><TD>10A0</TD><TD>10FF</TD><TD>Georgian</TD><TD>格鲁吉亚文</TD></TR>
<TR><TD>1100</TD><TD>11FF</TD><TD>Hangul Jamo</TD><TD>朝鲜文</TD></TR>
<TR><TD>1200</TD><TD>137F</TD><TD>Ethiopic</TD><TD>埃塞俄比亚文</TD></TR>
<TR><TD>1380</TD><TD>139F</TD><TD>Ethiopic Supplement</TD><TD>埃塞俄比亚文补充</TD></TR>
<TR><TD>13A0</TD><TD>13FF</TD><TD>Cherokee</TD><TD>切罗基文</TD></TR>
<TR><TD>1400</TD><TD>167F</TD><TD>Unified Canadian Aboriginal Syllabics</TD><TD>加拿大印第安方言</TD></TR>
<TR><TD>1680</TD><TD>169F</TD><TD>Ogham</TD><TD>欧甘文</TD></TR>
<TR><TD>16A0</TD><TD>16FF</TD><TD>Runic</TD><TD>北欧古字</TD></TR>
<TR><TD>1700</TD><TD>171F</TD><TD>Tagalog</TD><TD>塔加路文</TD></TR>
<TR><TD>1720</TD><TD>173F</TD><TD>Hanunoo</TD><TD>哈努诺文</TD></TR>
<TR><TD>1740</TD><TD>175F</TD><TD>Buhid</TD><TD>布迪文</TD></TR>
<TR><TD>1760</TD><TD>177F</TD><TD>Tagbanwa</TD><TD>Tagbanwa文</TD></TR>
<TR><TD>1780</TD><TD>17FF</TD><TD>Khmer</TD><TD>高棉文</TD></TR>
<TR><TD>1800</TD><TD>18AF</TD><TD>Mongolian</TD><TD>蒙古文</TD></TR>
<TR><TD>1900</TD><TD>194F</TD><TD>Limbu</TD><TD>林布文</TD></TR>
<TR><TD>1950</TD><TD>197F</TD><TD>Tai Le</TD><TD>德宏傣文</TD></TR>
<TR><TD>1980</TD><TD>19DF</TD><TD>New Tai Lue</TD><TD>新傣文</TD></TR>
<TR><TD>19E0</TD><TD>19FF</TD><TD>Khmer Symbols</TD><TD>高棉文</TD></TR>
<TR><TD>1A00</TD><TD>1A1F</TD><TD>Buginese</TD><TD>布吉文</TD></TR>
<TR><TD>1B00</TD><TD>1B7F</TD><TD>Balinese</TD><TD>巴厘文</TD></TR>
<TR><TD>1D00</TD><TD>1D7F</TD><TD>Phonetic Extensions</TD><TD>拉丁字母音标扩充</TD></TR>
<TR><TD>1D80</TD><TD>1DBF</TD><TD>Phonetic Extensions Supplement</TD><TD>拉丁字母音标扩充增补</TD></TR>
<TR><TD>1DC0</TD><TD>1DFF</TD><TD>Combining Diacritical Marks Supplement</TD><TD>组合附加符号补充</TD></TR>
<TR><TD>1E00</TD><TD>1EFF</TD><TD>Latin Extended Additional</TD><TD>拉丁字母扩充附加</TD></TR>
<TR><TD>1F00</TD><TD>1FFF</TD><TD>Greek Extended</TD><TD>希腊文扩充</TD></TR>
<TR><TD>2000</TD><TD>206F</TD><TD>General Punctuation</TD><TD>一般标点符号</TD></TR>
<TR><TD>2070</TD><TD>209F</TD><TD>Superscripts and Subscripts</TD><TD>上标和下标</TD></TR>
<TR><TD>20A0</TD><TD>20CF</TD><TD>Currency Symbols</TD><TD>货币符号</TD></TR>
<TR><TD>20D0</TD><TD>20FF</TD><TD>Combining Diacritical Marks for Symbols</TD><TD>符号用组合附加符号</TD></TR>
<TR><TD>2100</TD><TD>214F</TD><TD>Letterlike Symbols</TD><TD>似字母符号</TD></TR>
<TR><TD>2150</TD><TD>218F</TD><TD>Number Forms</TD><TD>数字形式</TD></TR>
<TR><TD>2190</TD><TD>21FF</TD><TD>Arrows</TD><TD>箭头符号</TD></TR>
<TR><TD>2200</TD><TD>22FF</TD><TD>Mathematical Operators</TD><TD>数学运算符号</TD></TR>
<TR><TD>2300</TD><TD>23FF</TD><TD>Miscellaneous Technical</TD><TD>零杂技术用符号</TD></TR>
<TR><TD>2400</TD><TD>243F</TD><TD>Control Pictures</TD><TD>控制图符</TD></TR>
<TR><TD>2440</TD><TD>245F</TD><TD>Optical Character Recognition</TD><TD>光学字符识别</TD></TR>
<TR><TD>2460</TD><TD>24FF</TD><TD>Enclosed Alphanumerics</TD><TD>带括号的字母数字</TD></TR>
<TR><TD>2500</TD><TD>257F</TD><TD>Box Drawing</TD><TD>制表符</TD></TR>
<TR><TD>2580</TD><TD>259F</TD><TD>Block Elements</TD><TD>方块元素</TD></TR>
<TR><TD>25A0</TD><TD>25FF</TD><TD>Geometric Shapes</TD><TD>几何形状</TD></TR>
<TR><TD>2600</TD><TD>26FF</TD><TD>Miscellaneous Symbols</TD><TD>零杂符号</TD></TR>
<TR><TD>2700</TD><TD>27BF</TD><TD>Dingbats</TD><TD>杂锦字型</TD></TR>
<TR><TD>27C0</TD><TD>27EF</TD><TD>Miscellaneous Mathematical Symbols-A</TD><TD>零杂数学符号-A</TD></TR>
<TR><TD>27F0</TD><TD>27FF</TD><TD>Supplemental Arrows-A</TD><TD>箭头符号补充-A</TD></TR>
<TR><TD>2800</TD><TD>28FF</TD><TD>Braille Patterns</TD><TD>盲文</TD></TR>
<TR><TD>2900</TD><TD>297F</TD><TD>Supplemental Arrows-B</TD><TD>箭头符号补充-B</TD></TR>
<TR><TD>2980</TD><TD>29FF</TD><TD>Miscellaneous Mathematical Symbols-B</TD><TD>零杂数学符号-B</TD></TR>
<TR><TD>2A00</TD><TD>2AFF</TD><TD>Supplemental Mathematical Operators</TD><TD>数学运算符号</TD></TR>
<TR><TD>2B00</TD><TD>2BFF</TD><TD>Miscellaneous Symbols and Arrows</TD><TD>零杂符号和箭头</TD></TR>
<TR><TD>2C00</TD><TD>2C5F</TD><TD>Glagolitic</TD><TD>格拉哥里字母表</TD></TR>
<TR><TD>2C60</TD><TD>2C7F</TD><TD>Latin Extended-C</TD><TD>拉丁字母扩充-C</TD></TR>
<TR><TD>2C80</TD><TD>2CFF</TD><TD>Coptic</TD><TD>科普特文</TD></TR>
<TR><TD>2D00</TD><TD>2D2F</TD><TD>Georgian Supplement</TD><TD>格鲁吉亚文补充</TD></TR>
<TR><TD>2D30</TD><TD>2D7F</TD><TD>Tifinagh</TD><TD>提非纳字母</TD></TR>
<TR><TD>2D80</TD><TD>2DDF</TD><TD>Ethiopic Extended</TD><TD>埃塞俄比亚文扩充</TD></TR>
<TR><TD>2E00</TD><TD>2E7F</TD><TD>Supplemental Punctuation</TD><TD>标点符号补充</TD></TR>
<TR><TD>2E80</TD><TD>2EFF</TD><TD>CJK Radicals Supplement</TD><TD>中日韩部首补充</TD></TR>
<TR><TD>2F00</TD><TD>2FDF</TD><TD>Kangxi Radicals</TD><TD>康熙字典部首</TD></TR>
<TR><TD>2FF0</TD><TD>2FFF</TD><TD>Ideographic Description Characters</TD><TD>汉字结构描述字符</TD></TR>
<TR><TD>3000</TD><TD>303F</TD><TD>CJK Symbols and Punctuation</TD><TD>中日韩符号和标点 </TD></TR>
<TR><TD>3040</TD><TD>309F</TD><TD>Hiragana</TD><TD>平假名</TD></TR>
<TR><TD>30A0</TD><TD>30FF</TD><TD>Katakana</TD><TD>片假名</TD></TR>
<TR><TD>3100</TD><TD>312F</TD><TD>Bopomofo</TD><TD>注音符号</TD></TR>
<TR><TD>3130</TD><TD>318F</TD><TD>Hangul Compatibility Jamo</TD><TD>朝鲜文兼容字母</TD></TR>
<TR><TD>3190</TD><TD>319F</TD><TD>Kanbun</TD><TD>日文的汉字批注</TD></TR>
<TR><TD>31A0</TD><TD>31BF</TD><TD>Bopomofo Extended</TD><TD>注音符号扩充</TD></TR>
<TR><TD>31C0</TD><TD>31EF</TD><TD>CJK Strokes</TD><TD>中日韩笔划</TD></TR>
<TR><TD>31F0</TD><TD>31FF</TD><TD>Katakana Phonetic Extensions</TD><TD>片假名音标扩充</TD></TR>
<TR><TD>3200</TD><TD>32FF</TD><TD>Enclosed CJK Letters and Months</TD><TD>带括号的中日韩字母及月份</TD></TR>
<TR><TD>3300</TD><TD>33FF</TD><TD>CJK Compatibility</TD><TD>中日韩兼容字符</TD></TR>
<TR><TD>3400</TD><TD>4DBF</TD><TD>CJK Unified Ideographs Extension A</TD><TD>中日韩统一表意文字扩充A</TD></TR>
<TR><TD>4DC0</TD><TD>4DFF</TD><TD>Yijing Hexagram Symbols</TD><TD>易经六十四卦象</TD></TR>
<TR><TD>4E00</TD><TD>9FFF</TD><TD>CJK Unified Ideographs</TD><TD>中日韩统一表意文字</TD></TR>
<TR><TD>A000</TD><TD>A48F</TD><TD>Yi Syllables</TD><TD>彝文音节</TD></TR>
<TR><TD>A490</TD><TD>A4CF</TD><TD>Yi Radicals</TD><TD>彝文字根</TD></TR>
<TR><TD>A700</TD><TD>A71F</TD><TD>Modifier Tone Letters</TD><TD>声调修饰字母</TD></TR>
<TR><TD>A720</TD><TD>A7FF</TD><TD>Latin Extended-D</TD><TD>拉丁字母扩充-D</TD></TR>
<TR><TD>A800</TD><TD>A82F</TD><TD>Syloti Nagri</TD><TD>Syloti Nagri字母表</TD></TR>
<TR><TD>A840</TD><TD>A87F</TD><TD>Phags-pa</TD><TD>Phags-pa字母表</TD></TR>
<TR><TD>AC00</TD><TD>D7AF</TD><TD>Hangul Syllables</TD><TD>朝鲜文音节</TD></TR>
<TR><TD>D800</TD><TD>DB7F</TD><TD>High Surrogates</TD><TD>高位替代</TD></TR>
<TR><TD>DB80</TD><TD>DBFF</TD><TD>High Private Use Surrogates</TD><TD>高位专用替代</TD></TR>
<TR><TD>DC00</TD><TD>DFFF</TD><TD>Low Surrogates</TD><TD>低位替代</TD></TR>
<TR><TD>E000</TD><TD>F8FF</TD><TD>Private Use Area</TD><TD>专用区</TD></TR>
<TR><TD>F900</TD><TD>FAFF</TD><TD>CJK Compatibility Ideographs</TD><TD>中日韩兼容表意文字</TD></TR>
<TR><TD>FB00</TD><TD>FB4F</TD><TD>Alphabetic Presentation Forms</TD><TD>字母变体显现形式</TD></TR>
<TR><TD>FB50</TD><TD>FDFF</TD><TD>Arabic Presentation Forms-A</TD><TD>阿拉伯文变体显现形式-A </TD></TR>
<TR><TD>FE00</TD><TD>FE0F</TD><TD>Variation Selectors</TD><TD>字型变换选取器</TD></TR>
<TR><TD>FE10</TD><TD>FE1F</TD><TD>Vertical Forms</TD><TD>竖排标点符号</TD></TR>
<TR><TD>FE20</TD><TD>FE2F</TD><TD>Combining Half Marks</TD><TD>组合半角标示</TD></TR>
<TR><TD>FE30</TD><TD>FE4F</TD><TD>CJK Compatibility Forms</TD><TD>中日韩兼容形式</TD></TR>
<TR><TD>FE50</TD><TD>FE6F</TD><TD>Small Form Variants</TD><TD>小型变体形式</TD></TR>
<TR><TD>FE70</TD><TD>FEFF</TD><TD>Arabic Presentation Forms-B</TD><TD>阿拉伯文变体显现形式-B </TD></TR>
<TR><TD>FF00</TD><TD>FFEF</TD><TD>Halfwidth and Fullwidth Forms</TD><TD>半角及全角字符</TD></TR>
<TR><TD>FFF0</TD><TD>FFFF</TD><TD>Specials</TD><TD>特殊区域</TD></TR>
<TR><TD>10000</TD><TD>1007F</TD><TD>Linear B Syllabary</TD><TD>线形文字B音节文字</TD></TR>
<TR><TD>10080</TD><TD>100FF</TD><TD>Linear B Ideograms</TD><TD>线形文字B表意文字</TD></TR>
<TR><TD>10100</TD><TD>1013F</TD><TD>Aegean Numbers</TD><TD>爱琴海数字</TD></TR>
<TR><TD>10140</TD><TD>1018F</TD><TD>Ancient Greek Numbers</TD><TD>古希腊数字</TD></TR>
<TR><TD>10300</TD><TD>1032F</TD><TD>Old Italic</TD><TD>古意大利文</TD></TR>
<TR><TD>10330</TD><TD>1034F</TD><TD>Gothic</TD><TD>哥特文</TD></TR>
<TR><TD>10380</TD><TD>1039F</TD><TD>Ugaritic</TD><TD>乌加里特楔形文字</TD></TR>
<TR><TD>103A0</TD><TD>103DF</TD><TD>Old Persian</TD><TD>古波斯文</TD></TR>
<TR><TD>10400</TD><TD>1044F</TD><TD>Deseret</TD><TD>德塞雷特大学音标</TD></TR>
<TR><TD>10450</TD><TD>1047F</TD><TD>Shavian</TD><TD>肃伯纳速记符号</TD></TR>
<TR><TD>10480</TD><TD>104AF</TD><TD>Osmanya</TD><TD>Osmanya字母表</TD></TR>
<TR><TD>10800</TD><TD>1083F</TD><TD>Cypriot Syllabary</TD><TD>塞浦路斯音节文字</TD></TR>
<TR><TD>10900</TD><TD>1091F</TD><TD>Phoenician</TD><TD>腓尼基文</TD></TR>
<TR><TD>10A00</TD><TD>10A5F</TD><TD>Kharoshthi</TD><TD>迦娄士悌文</TD></TR>
<TR><TD>12000</TD><TD>123FF</TD><TD>Cuneiform</TD><TD>楔形文字</TD></TR>
<TR><TD>12400</TD><TD>1247F</TD><TD>Cuneiform Numbers and Punctuation</TD><TD>楔形文字数字和标点</TD></TR>
<TR><TD>1D000</TD><TD>1D0FF</TD><TD>Byzantine Musical Symbols</TD><TD>东正教音乐符号</TD></TR>
<TR><TD>1D100</TD><TD>1D1FF</TD><TD>Musical Symbols</TD><TD>音乐符号</TD></TR>
<TR><TD>1D200</TD><TD>1D24F</TD><TD>Ancient Greek Musical Notation</TD><TD>古希腊音乐符号</TD></TR>
<TR><TD>1D300</TD><TD>1D35F</TD><TD>Tai Xuan Jing Symbols</TD><TD>太玄经符号</TD></TR>
<TR><TD>1D360</TD><TD>1D37F</TD><TD>Counting Rod Numerals</TD><TD>算筹</TD></TR>
<TR><TD>1D400</TD><TD>1D7FF</TD><TD>Mathematical Alphanumeric Symbols</TD><TD>数学用字母数字符号</TD></TR>
<TR><TD>20000</TD><TD>2A6DF</TD><TD>CJK Unified Ideographs Extension B</TD><TD>中日韩统一表意文字扩充 B</TD></TR>
<TR><TD>2F800</TD><TD>2FA1F</TD><TD>CJK Compatibility Ideographs Supplement</TD><TD>中日韩兼容表意文字补充</TD></TR>
<TR><TD>E0000</TD><TD>E007F</TD><TD>Tags</TD><TD>标签</TD></TR>
<TR><TD>E0100</TD><TD>E01EF</TD><TD>Variation Selectors Supplement</TD><TD>字型变换选取器补充</TD></TR>
<TR><TD>F0000</TD><TD>FFFFF</TD><TD>Supplementary Private Use Area-A</TD><TD>补充专用区-A</TD></TR>
<TR><TD>100000</TD><TD>10FFFF</TD><TD>Supplementary Private Use Area-B</TD><TD>补充专用区-B</TD></TR>
</TABLE>
<P>Block是Unicode字符的一个属性。属于同一个Block的字符有着相近的用途。Block表中的开始码位、结束码位只是用来划分出一块区域，在开始码位和结束码位之间可能还有很多未定义的码位。使用UniToy，大家可以按照Block浏览Unicode字符，既可以按列表显示：</P>
<P><IMG SRC="http://www.fmddlmyy.cn/images/block_list.png" WIDTH="874" HEIGHT="435" BORDER="0" ALT=""></P>
<P></P>
也可以显示每个字符的详细信息：
<P><IMG SRC="http://www.fmddlmyy.cn/images/block_detail.png" WIDTH="829" HEIGHT="575" BORDER="0" ALT=""></P>
<H4>4.1.3 Script</H4>
<P>Unicode中每个字符都有一个Script属性，这个属性表明字符所属的文字系统。Unicode目前支持以下Script：</P>
<TABLE border="1">
<TR><TD>Script名称（英文）</TD><TD>Script名称（中文）</TD><TD>Script包含的字符数</TD></TR>
<TR><TD>Arabic</TD><TD>阿拉伯文</TD><TD>966</TD></TR>
<TR><TD>Armenian</TD><TD>亚美尼亚文</TD><TD>90</TD></TR>
<TR><TD>Balinese</TD><TD>巴厘文</TD><TD>121</TD></TR>
<TR><TD>Bengali</TD><TD>孟加拉文</TD><TD>91</TD></TR>
<TR><TD>Bopomofo</TD><TD>汉语注音符号</TD><TD>64</TD></TR>
<TR><TD>Braille</TD><TD>盲文</TD><TD>256</TD></TR>
<TR><TD>Buginese</TD><TD>布吉文</TD><TD>30</TD></TR>
<TR><TD>Buhid</TD><TD>布迪文</TD><TD>20</TD></TR>
<TR><TD>Canadian Aboriginal</TD><TD>加拿大印第安方言</TD><TD>630</TD></TR>
<TR><TD>Cherokee</TD><TD>切罗基文</TD><TD>85</TD></TR>
<TR><TD>Common</TD><TD>Common</TD><TD>5020</TD></TR>
<TR><TD>Coptic</TD><TD>科普特文</TD><TD>128</TD></TR>
<TR><TD>Cuneiform</TD><TD>楔形文字</TD><TD>982</TD></TR>
<TR><TD>Cypriot</TD><TD>塞浦路斯音节文字</TD><TD>55</TD></TR>
<TR><TD>Cyrillic</TD><TD>西里尔文</TD><TD>277</TD></TR>
<TR><TD>Deseret</TD><TD>德塞雷特大学音标</TD><TD>80</TD></TR>
<TR><TD>Devanagari</TD><TD>天成文书（梵文）</TD><TD>107</TD></TR>
<TR><TD>Ethiopic</TD><TD>埃塞俄比亚文</TD><TD>461</TD></TR>
<TR><TD>Georgian</TD><TD>格鲁吉亚文</TD><TD>120</TD></TR>
<TR><TD>Gothic</TD><TD>哥特文</TD><TD>94</TD></TR>
<TR><TD>Glagolitic</TD><TD>格拉哥里字母表</TD><TD>27</TD></TR>
<TR><TD>Greek</TD><TD>希腊文</TD><TD>506</TD></TR>
<TR><TD>Gujarati</TD><TD>古吉拉特文</TD><TD>83</TD></TR>
<TR><TD>Gurmukhi</TD><TD>锡克教文</TD><TD>77</TD></TR>
<TR><TD>Han</TD><TD>汉文</TD><TD>71570</TD></TR>
<TR><TD>Hangul</TD><TD>韩文书写系统</TD><TD>11619</TD></TR>
<TR><TD>Hanunoo</TD><TD>哈努诺文</TD><TD>21</TD></TR>
<TR><TD>Hebrew</TD><TD>希伯来文</TD><TD>133</TD></TR>
<TR><TD>Hiragana</TD><TD>平假名</TD><TD>89</TD></TR>
<TR><TD>Inherited</TD><TD>Inherited</TD><TD>461</TD></TR>
<TR><TD>Kannada</TD><TD>卡纳达文</TD><TD>86</TD></TR>
<TR><TD>Katakana</TD><TD>片假名</TD><TD>164</TD></TR>
<TR><TD>Kharoshthi</TD><TD>迦娄士悌文</TD><TD>65</TD></TR>
<TR><TD>Khmer</TD><TD>高棉文</TD><TD>146</TD></TR>
<TR><TD>Lao</TD><TD>老挝文</TD><TD>65</TD></TR>
<TR><TD>Latin</TD><TD>拉丁文系</TD><TD>1070</TD></TR>
<TR><TD>Limbu</TD><TD>林布文(尼泊尔东部)</TD><TD>66</TD></TR>
<TR><TD>Linear B</TD><TD>线形文字B</TD><TD>211</TD></TR>
<TR><TD>Malayalam</TD><TD>德拉维族文(印度)</TD><TD>78</TD></TR>
<TR><TD>Mongolian</TD><TD>蒙古文</TD><TD>152</TD></TR>
<TR><TD>Myanmar</TD><TD>缅甸文</TD><TD>78</TD></TR>
<TR><TD>New Tai Lue</TD><TD>新傣文</TD><TD>80</TD></TR>
<TR><TD>Nko</TD><TD>N'Ko字母表</TD><TD>59</TD></TR>
<TR><TD>Ogham</TD><TD>欧甘文字</TD><TD>29</TD></TR>
<TR><TD>Old Italic</TD><TD>古意大利文</TD><TD>35</TD></TR>
<TR><TD>Old Persian</TD><TD>古波斯文</TD><TD>50</TD></TR>
<TR><TD>Oriya</TD><TD>奥里亚文</TD><TD>81</TD></TR>
<TR><TD>Osmanya</TD><TD>Osmanya字母表</TD><TD>40</TD></TR>
<TR><TD>Phags Pa</TD><TD>Phags Pa字母表(蒙古)</TD><TD>56</TD></TR>
<TR><TD>Phoenician</TD><TD>腓尼基文</TD><TD>27</TD></TR>
<TR><TD>Runic</TD><TD>古代北欧文</TD><TD>78</TD></TR>
<TR><TD>Shavian</TD><TD>肃伯纳速记符号</TD><TD>48</TD></TR>
<TR><TD>Sinhala</TD><TD>僧伽罗文</TD><TD>80</TD></TR>
<TR><TD>Syloti Nagri</TD><TD>Syloti Nagri字母表(印度)</TD><TD>44</TD></TR>
<TR><TD>Syriac</TD><TD>叙利亚文</TD><TD>77</TD></TR>
<TR><TD>Tagalog</TD><TD>塔加路文(菲律宾)</TD><TD>20</TD></TR>
<TR><TD>Tagbanwa</TD><TD>Tagbanwa文(菲律宾)</TD><TD>18</TD></TR>
<TR><TD>Tai Le</TD><TD>德宏傣文</TD><TD>35</TD></TR>
<TR><TD>Tamil</TD><TD>泰米尔文</TD><TD>71</TD></TR>
<TR><TD>Telugu</TD><TD>泰卢固文(印度)</TD><TD>80</TD></TR>
<TR><TD>Thaana</TD><TD>马尔代夫书写体 </TD><TD>50</TD></TR>
<TR><TD>Thai</TD><TD>泰国文</TD><TD>86</TD></TR>
<TR><TD>Tibetan</TD><TD>藏文</TD><TD>195</TD></TR>
<TR><TD>Tifinagh</TD><TD>提非纳字母表</TD><TD>55</TD></TR>
<TR><TD>Ugaritic</TD><TD>乌加里特楔形文字</TD><TD>31</TD></TR>
<TR><TD>Yi</TD><TD>彝文</TD><TD>1220</TD></TR>
</TABLE>
<P>其中，有两个Script值有着特殊的含义：</P>
<UL>
<LI>Common：Script属性为Common的字符可能在多个文字系统中使用，不是某个文字系统特有的。例如：空格、数字等。</LI>
<LI>Inherited：Script属性为Inherited的字符会继承前一个字符的Script属性。主要是一些组合用符号，例如：在“组合附加符号”区（0x300-0x36f），字符的Script属性都是Inherited。</LI>
</UL>
<P>UCD中的Script.txt列出了每个字符的Script属性。使用UniToy可以按照Script属性查看字符。例如：</P>
<P><IMG SRC="http://www.fmddlmyy.cn/images/script.png" WIDTH="829" HEIGHT="428" BORDER="0" ALT=""></P>
<P>左侧Script窗口中，第一层节点是按英文字母顺序排列的Script属性。第二层节点是包含该Script文字的行（row），点击后显示该行内属于这个Script的字符。这样，就可以集中查看属于同一文字系统的字符。</P>
<H4>4.1.4 Unicode中的汉字</H4>
<P>前面提过，在Unicode已定义的99089个字符中，有71226个字符是汉字。它们的分布如下：</P>
<TABLE border="1">
<TR><TD>Block名称</TD><TD>开始码位</TD><TD>结束码位</TD><TD>数量</TD></TR>
<TR><TD>中日韩统一表意文字扩充A</TD><TD>3400</TD><TD>4db5</TD><TD>6582</TD><TD></TD></TR>
<TR><TD>中日韩统一表意文字</TD><TD>4e00</TD><TD>9fbb</TD><TD>20924</TD><TD></TD></TR>
<TR><TD>中日韩兼容表意文字</TD><TD>f900</TD><TD>fa2d</TD><TD>302</TD><TD></TD></TR>
<TR><TD>中日韩兼容表意文字</TD><TD>fa30</TD><TD>fa6a</TD><TD>59</TD><TD></TD></TR>
<TR><TD>中日韩兼容表意文字</TD><TD>fa70</TD><TD>fad9</TD><TD>106</TD></TR>
<TR><TD>中日韩统一表意文字扩充B</TD><TD>20000</TD><TD>2a6d6</TD><TD>42711</TD><TD></TD></TR>
<TR><TD>中日韩兼容表意文字补充</TD><TD>2f800</TD><TD>2fa1d</TD><TD>542</TD></TR>
</TABLE>
<P>UCD的Unihan.txt中的部首偏旁索引（kRSUnicode）可以检索全部71226个汉字。kRSUnicode的部首是按照康熙字典定义的，共214个部首。简体字按照简体部首对应的繁体部首检索。UniToy整理了康熙字典部首对应的简体部首，提供了按照部首检索汉字的功能：</P>
<P><IMG SRC="http://www.fmddlmyy.cn/images/kangxi.png" WIDTH="921" HEIGHT="653" BORDER="0" ALT=""></P>
<H3>4.2 UTF编码</H3>
<P>在字符编码的四个层次中，第一层的范围和第二层的编码在4.1节已经详细讨论过了。本节讨论第三层的UTF编码和第四层的字节序，主要谈谈第三层的UTF编码，即怎样将Unicode定义的编码转换成程序数据。</P>
<H4>4.2.1 UTF-8</H4>
<p>UTF-8以字节为单位对Unicode进行编码。从Unicode到UTF-8的编码方式如下：</p>
<table border="1">
<tr><td>Unicode编码(16进制)</td><td>UTF-8 字节流(二进制)</td></tr>
<tr><td>000000 - 00007F</td><td>0xxxxxxx</td></tr>
<tr><td>000080 - 0007FF</td><td>110xxxxx 10xxxxxx</td></tr>
<tr><td>000800 - 00FFFF</td><td>1110xxxx 10xxxxxx 10xxxxxx</td></tr>
<tr><td>010000 - 10FFFF</td><td>11110xxx 10xxxxxx 10xxxxxx 10xxxxxx</td></tr>
</table>
<P>UTF-8的特点是对不同范围的字符使用不同长度的编码。对于0x00-0x7F之间的字符，UTF-8编码与ASCII编码完全相同。UTF-8编码的最大长度是4个字节。从上表可以看出，4字节模板有21个x，即可以容纳21位二进制数字。Unicode的最大码位0x10FFFF也只有21位。</P>
<p>例1：“汉”字的Unicode编码是0x6C49。0x6C49在0x0800-0xFFFF之间，使用用3字节模板了：<font color="#0000FF">1110</font>xxxx <font color="#0000FF">10</font>xxxxxx <font color="#0000FF">10</font>xxxxxx。将0x6C49写成二进制是：0110 1100 0100 1001， 用这个比特流依次代替模板中的x，得到：<font color="#0000FF">1110</font>0110 <font color="#0000FF">10</font>110001 
  <font color="#0000FF">10</font>001001，即E6 B1 89。</p>
<p>例2：“<IMG SRC="http://www.fmddlmyy.cn/images/134192.png" WIDTH="14" HEIGHT="15" BORDER="0" ALT="">”字的Unicode编码是0x20C30。0x20C30在0x010000-0x10FFFF之间，使用用4字节模板了：<font color="#0000FF">11110</font>xxx <font color="#0000FF">10</font>xxxxxx <font color="#0000FF">10</font>xxxxxx <font color="#0000FF">10</font>xxxxxx。将0x20C30写成21位二进制数字（不足21位就在前面补0）：0 0010 0000 1100 0011 0000，用这个比特流依次代替模板中的x，得到：<font color="#0000FF">11110</font>000 <font color="#0000FF">10</font>100000 <font color="#0000FF">10</font>110000 <font color="#0000FF">10</font>110000，即F0 A0 B0 B0。</p>
<H4>4.2.2 UTF-16</H4>
<P>UniToy有个“输出编码”功能，可以输出当前选择的文本编码。因为UniToy内部采用UTF-16编码，所以输出的编码就是文本的UTF-16编码。例如：如果我们输出“汉”字的UTF-16编码，可以看到0x6C49，这与“汉”字的Unicode编码是一致的。如果我们输出“<IMG SRC="http://www.fmddlmyy.cn/images/134192.png" WIDTH="14" HEIGHT="15" BORDER="0" ALT="">”字的UTF-16编码，可以看到0xD843, 0xDC30。“<IMG SRC="http://www.fmddlmyy.cn/images/134192.png" WIDTH="14" HEIGHT="15" BORDER="0" ALT="">”字的Unicode编码是0x20C30，它的UTF-16编码是怎样得到的呢？</P>
<H5>4.2.2.1 编码规则</H5>
<P>UTF-16编码以16位无符号整数为单位。我们把Unicode编码记作U。编码规则如下：</P>
<UL>
<LI>如果U&lt;0x10000，U的UTF-16编码就是U对应的16位无符号整数（为书写简便，下文将16位无符号整数记作WORD）。</LI>
<LI>如果U&#8805;0x10000，我们先计算U'=U-0x10000，然后将U'写成二进制形式：yyyy yyyy yyxx xxxx xxxx，U的UTF-16编码（二进制）就是：<font color="#0000FF">110110</font>yyyyyyyyyy <font color="#0000FF">110111</font>xxxxxxxxxx。</LI>
</UL>
<P>为什么U'可以被写成20个二进制位？Unicode的最大码位是0x10ffff，减去0x10000后，U'的最大值是0xfffff，所以肯定可以用20个二进制位表示。例如：“<IMG SRC="http://www.fmddlmyy.cn/images/134192.png" WIDTH="14" HEIGHT="15" BORDER="0" ALT="">”字的Unicode编码是0x20C30，减去0x10000后，得到0x10C30，写成二进制是：0001 0000 1100 0011 0000。用前10位依次替代模板中的y，用后10位依次替代模板中的x，就得到：<font color="#0000FF">110110</font>0001000011 <font color="#0000FF">110111</font>0000110000，即0xD843 0xDC30。</P>
<H5>4.2.2.2 代理区（Surrogate）</H5>
<P>按照上述规则，Unicode编码0x10000-0x10FFFF的UTF-16编码有两个WORD，第一个WORD的高6位是110110，第二个WORD的高6位是110111。可见，第一个WORD的取值范围（二进制）是<font color="#0000FF">110110</font>00 00000000到<font color="#0000FF">110110</font>11 11111111，即0xD800-0xDBFF。第二个WORD的取值范围（二进制）是<font color="#0000FF">110111</font>00 00000000到<font color="#0000FF">110111</font>11 11111111，即0xDC00-0xDFFF。</P>
<P>为了将一个WORD的UTF-16编码与两个WORD的UTF-16编码区分开来，Unicode编码的设计者将0xD800-0xDFFF保留下来，并称为代理区（Surrogate）：</P>
<TABLE border="1">
<TR><TD>D800</TD><TD>DB7F</TD><TD>High Surrogates</TD><TD>高位替代</TD></TR>
<TR><TD>DB80</TD><TD>DBFF</TD><TD>High Private Use Surrogates</TD><TD>高位专用替代</TD></TR>
<TR><TD>DC00</TD><TD>DFFF</TD><TD>Low Surrogates</TD><TD>低位替代</TD></TR>
</TABLE>
<P>高位替代就是指这个范围的码位是两个WORD的UTF-16编码的第一个WORD。低位替代就是指这个范围的码位是两个WORD的UTF-16编码的第二个WORD。那么，高位专用替代是什么意思？我们来解答这个问题，顺便看看怎么由UTF-16编码推导Unicode编码。
<P>解：如果一个字符的UTF-16编码的第一个WORD在0xDB80到0xDBFF之间，那么它的Unicode编码在什么范围内？我们知道第二个WORD的取值范围是0xDC00-0xDFFF，所以这个字符的UTF-16编码范围应该是0xDB80 0xDC00到0xDBFF 0xDFFF。我们将这个范围写成二进制：</P>
<P><font color="#0000FF">110110</font>1110000000 <font color="#0000FF">110111</font>00 00000000 - <font color="#0000FF">110110</font>1111111111 <font color="#0000FF">110111</font>1111111111</P>
<P>按照编码的相反步骤，取出高低WORD的后10位，并拼在一起，得到</P>
<P>1110 0000 0000 0000 0000 - 1111 1111 1111 1111 1111</P>
<P>即0xe0000-0xfffff，按照编码的相反步骤再加上0x10000，得到0xf0000-0x10ffff。这就是UTF-16编码的第一个WORD在0xdb80到0xdbff之间的Unicode编码范围，即平面15和平面16。因为Unicode标准将平面15和平面16都作为专用区，所以0xDB80到0xDBFF之间的保留码位被称作高位专用替代。</P>
<H4>4.2.3 UTF-32</H4>
<P>UTF-32编码以32位无符号整数为单位。Unicode的UTF-32编码就是其对应的32位无符号整数。</P>
<H4>4.2.4 字节序</H4>
<P>根据字节序的不同，UTF-16可以被实现为UTF-16LE或UTF-16BE，UTF-32可以被实现为UTF-32LE或UTF-32BE。例如：</P>
<TABLE border="1">
<TR><TD>字符</TD><TD>Unicode编码</TD><TD>UTF-16LE</TD><TD>UTF-16BE</TD><TD>UTF32-LE</TD><TD>UTF32-BE</TD></TR>
<TR><TD>汉</TD><TD>0x6C49</TD><TD>49 6C</TD><TD>6C 49</TD><TD>49 6C 00 00</TD><TD>00 00 6C 49</TD></TR>
<TR><TD><IMG SRC="http://www.fmddlmyy.cn/images/134192.png" WIDTH="14" HEIGHT="15" BORDER="0" ALT=""></TD><TD>0x20C30</TD><TD>43 D8 30 DC</TD><TD>D8 43 DC 30</TD><TD>30 0C 02 00</TD><TD>00 02 0C 30</TD></TR>
</TABLE>
</P>那么，怎么判断字节流的字节序呢？</P>
<P>Unicode标准建议用BOM（Byte Order Mark）来区分字节序，即在传输字节流前，先传输被作为BOM的字符"零宽无中断空格"。这个字符的编码是FEFF，而反过来的FFFE（UTF-16）和FFFE0000（UTF-32）在Unicode中都是未定义的码位，不应该出现在实际传输中。下表是各种UTF编码的BOM：</P>
<TABLE border="1">
<TR><TD>UTF编码</TD><TD>Byte Order Mark</TD></TR>
<TR><TD>UTF-8</TD><TD>EF BB BF</TD></TR>
<TR><TD>UTF-16LE</TD><TD>FF FE</TD></TR>
<TR><TD>UTF-16BE</TD><TD>FE FF</TD></TR>
<TR><TD>UTF-32LE</TD><TD>FF FE 00 00</TD></TR>
<TR><TD>UTF-32BE</TD><TD>00 00 FE FF</TD></TR>
</TABLE>
<H2>5 结束语</H2>
<P>程序员的工作就是将复杂的世界简单地表达出来，希望这篇文章也能做到这一点。本文的初稿完成于2007年2月14日。我会在我的个人主页<A HREF="http://www.fmddlmyy.cn">http://www.fmddlmyy.cn</A>维护这篇文章的最新版本。</P>
<p>&nbsp;</p>

