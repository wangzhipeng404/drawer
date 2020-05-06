## 在线标注平台 canvas 相关 api 学习笔记

### 学习目标
  学习canvas api为，输出在线标注demo和学习笔记到云笔记。

### 在线体验
  https://wangzhipeng404.github.io/drawer/index.html

### 主要使用 api
1. ctx.rect() 绘制矩形
2. ctx.moveTo() ctx.lineTo() 绘制线条

### 学习心得
  canvas 本身只提供基础的绘制功能，为了实现标注功能，所以核心是如何存储绘制图形与绘制点的问题。本项目中使用了hashTable管理每个图形，使用链表管理每个图形绘制过程的各个点。为此使用js实现了hastable和链表，具体见src目录中的hashTable.ts 以及list.ts,在实现过程中，提高了对数据结构相关知识的掌握。
