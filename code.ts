/* eslint-disable @typescript-eslint/no-explicit-any */
// 显示 UI，设置其宽高
figma.showUI(__html__, { width: 400, height: 600 });

// 递归函数，用于收集节点及其子节点的信息
function collectNodeInfo(node: SceneNode): any {
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
    text:"",
    imageHash:""
  };

  // 如果节点是文本节点，收集文本内容
  if (node.type === "TEXT") {
    nodeInfo["text"] = (node as TextNode).characters;
  }


  // 如果节点是图片节点，收集图片 URL
  if (node.type === "RECTANGLE" && node.fills) {
    const fills = node.fills as readonly Paint[]; // Cast node.fills to type 'readonly Paint[]'
    for (const fill of fills) {
      if (fill.type === "IMAGE" && fill.imageHash) {
      nodeInfo['imageHash'] = fill.imageHash; // 这是图片的 hash，不是 URL
      break; // 读取到第一个 hash 就结束循环
      }
    }
  }

  // 如果节点有子节点，递归地收集每个子节点的信息
  if ("children" in node) {
    node.children.forEach((child) => {
      nodeInfo.children.push(collectNodeInfo(child));
    });
  }

  return nodeInfo;
}

// 监听从 UI 发来的消息
figma.ui.onmessage = msg => {
  if (msg.type === 'get-selection') {
      const selection = figma.currentPage.selection;

      // 检查是否有对象被选中
      if (selection.length > 0) {
          const node = selection[0];
          const nodeInfo = collectNodeInfo(node);
          // 将节点信息序列化成 JSON 字符串并发送到 UI
          figma.ui.postMessage(JSON.stringify(nodeInfo, null, 2));
      } else {
          // 如果没有选中的对象，发送错误消息
          figma.ui.postMessage('没有选中的对象');
      }
  }
};
