# run plugin

1. `npm run watch`
2. open plugin panel
![alt text](doc/image.png)
3. import plugin from manifest.json
![alt text](doc/image-1.png)
4. select manifest.json
![alt text](doc/image-3.png)
5. done!

# commands

- Parse Selected Object:解析当前节点的关节数据，以 json 格式输出到文本框

```typescript
const nodeInfo = {
    id: node.id,
    name: node.name,
    type: node.type,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    visible: node.visible,
    children: [] as any[],
    text: "",
    imageHash: "",
  };
```

- Clean Up:清空文本框
- Copy to Clipboard:复制文本框内容到粘贴板
- set random color:对所有可见、已填充内容的对象，设置随机颜色
- set inc r channle:对上面的节点设置 R 通道递增的颜色
- conver to hierachy:将文本框中的 json 转化为人类可读的层级结构
