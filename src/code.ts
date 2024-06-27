figma.showUI(__html__, { width: 400, height: 900 });

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
    text: "",
    imageHash: "",
  };

  if (node.visible === false) {
    return nodeInfo;
  }

  // 如果节点是文本节点，收集文本内容
  if (node.type === "TEXT") {
    nodeInfo["text"] = (node as TextNode).characters;
  }

  // 如果节点是图片节点，收集图片 URL
  if (node.type === "RECTANGLE" && node.fills) {
    const fills = node.fills as readonly Paint[]; // Cast node.fills to type 'readonly Paint[]'
    for (const fill of fills) {
      if (fill.type === "IMAGE" && fill.imageHash) {
        nodeInfo["imageHash"] = fill.imageHash; // 这是图片的 hash，不是 URL
        break; // 读取到第一个 hash 就结束循环
      }
    }
  }

  // 如果节点有子节点，递归地收集每个子节点的信息
  if ("children" in node) {
    node.children.forEach((child) => {
      const childInfo = collectNodeInfo(child);
      if (childInfo !== undefined) {
        nodeInfo.children.push(childInfo);
      }
    });
  }

  return nodeInfo;
}

function test1() {
  // 递归所有节点
  function recursiveFill(node: SceneNode) {
    if ("fills" in node && (node.fills as readonly Paint[]).length > 0) {
      node.fills = [
        {
          type: "SOLID",
          color: { r: Math.random(), g: Math.random(), b: Math.random() },
        },
      ];
    }
    if ("children" in node) {
      node.children.forEach((child) => {
        recursiveFill(child);
      });
    }
  }

  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    selection.forEach((node) => {
      recursiveFill(node);
    });
  }
}

function test2() {
  // 递归所有节点
  const colorIndex = 1;
  function recursiveFill(node: SceneNode, colorIndex: number) {
    if ("fills" in node && (node.fills as readonly Paint[]).length > 0) {
      node.fills = [
        {
          type: "SOLID",
          color: { r: Math.min(1, colorIndex / 255), g: 1, b: 1 },
        },
      ];
      colorIndex = colorIndex + 1;
    }
    if ("children" in node) {
      node.children.forEach((child) => {
        recursiveFill(child, colorIndex);
      });
    }
  }

  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    selection.forEach((node) => {
      recursiveFill(node, colorIndex);
    });
  }
}

function printNode(node: any, indent = "", result = "", isLastChild = false) {
  const prefix = isLastChild ? "└─ " : "├─ ";
  result += indent + prefix + node.name + "\n";
  if (node.children) {
    const len = node.children.length;
    node.children.forEach((child: any, index: number) => {
      result = printNode(
        child,
        indent + (isLastChild ? "    " : "│   "),
        result,
        index === len - 1
      );
    });
  }
  return result;
}

function test3() {
  let result = "";
  if (currentJson.children.length > 0) {
    result = currentJson.name + "\n";
    for (let i = 0; i < currentJson.children.length; i++) {
      result = printNode(
        currentJson.children[i],
        "",
        result,
        i === currentJson.children.length - 1
      );
    }
  }
  return result;
}

let currentJson = JSON.parse("{}");

async function addName(node: any, group: any) {
  let _name = node["name"] ? node["name"] : "";
  const textNode = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  textNode.characters = _name;
  textNode.x = node.absoluteTransform[0][2];
  textNode.y = node.absoluteTransform[1][2];
  textNode.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];

  if ("children" in node) {
    node.children.forEach((child: any) => {
      addName(child, group);
    });
  }

  group.appendChild(textNode);
}

function findNodesInArea(x: number, y: number, width: number, height: number): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isContained = (parentNode: any, child: any) => {
    const parentRectangleScope = { x: parentNode.absoluteBoundingBox?.x, y: parentNode.absoluteBoundingBox?.y, endX: (parentNode.absoluteBoundingBox?.x || 0) + (parentNode.absoluteBoundingBox?.width || 0), endY: (parentNode.absoluteBoundingBox?.y || 0) + (parentNode.absoluteBoundingBox?.height || 0) }
    const childRectangleScope = { x: child.absoluteBoundingBox?.x, y: child.absoluteBoundingBox?.y, endX: (child.absoluteBoundingBox?.x || 0) + (child.absoluteBoundingBox?.width || 0), endY: (child.absoluteBoundingBox?.y || 0) + (child.absoluteBoundingBox?.height || 0) }

    return parentRectangleScope.x <= childRectangleScope.x && parentRectangleScope.endX >= childRectangleScope.endX && parentRectangleScope.y <= childRectangleScope.y && parentRectangleScope.endY >= childRectangleScope.endY
  }

  const result: any[] = []
  const scopeNode = {
    absoluteBoundingBox: {
      x,
      y,
      width,
      height,
    },
  }

  const loop = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (isContained(scopeNode, node) && node !== scopeNode) {
        result.push(node)
      } else if (node.children?.length) {
        loop(node.children)
      }
    })
  }

  loop(figma.currentPage.children as any[])

  return result
}

// 监听从 UI 发来的消息
figma.ui.onmessage = async (msg) => {
  if (msg.type === "get-selection") {
    const selection = figma.currentPage.selection;

    // 检查是否有对象被选中
    if (selection.length > 0) {
      const node = selection[0];
      const nodeInfo = collectNodeInfo(node);
      currentJson = nodeInfo;
      // 将节点信息序列化成 JSON 字符串并发送到 UI
      figma.ui.postMessage(JSON.stringify(nodeInfo, null, 2));
    } else {
      // 如果没有选中的对象，发送错误消息
      figma.ui.postMessage("没有选中的对象");
    }
  }
  if (msg.type === "test1") {
    test1();
  }
  if (msg.type === "test2") {
    test2();
  }
  if (msg.type === "test3") {
    const result = test3();
    figma.ui.postMessage(result);
  }

  if (msg.type === "addName") {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      const group = figma.group(selection, figma.currentPage);
      for (const node of selection) {
        await addName(node, group);
      }
    }
  }
};
