export const ColorHex = [
    { ColorName: "AliceBlue", HexValue: "#F0F8FF" },
    { ColorName: "AntiqueWhite", HexValue: "#FAEBD7" },
    { ColorName: "Aqua", HexValue: "#00FFFF" },
    { ColorName: "Aquamarine", HexValue: "#7FFFD4" },
    { ColorName: "Azure", HexValue: "#F0FFFF" },
    { ColorName: "Beige", HexValue: "#F5F5DC" },
    { ColorName: "Bisque", HexValue: "#FFE4C4" },
    { ColorName: "Black", HexValue: "#000000" },
    { ColorName: "BlanchedAlmond", HexValue: "#FFEBCD" },
    { ColorName: "Blue", HexValue: "#0000FF" },
    { ColorName: "BlueViolet", HexValue: "#8A2BE2" },
    { ColorName: "Brown", HexValue: "#A52A2A" },
    { ColorName: "BurlyWood", HexValue: "#DEB887" },
    { ColorName: "CadetBlue", HexValue: "#5F9EA0" },
    { ColorName: "Chartreuse", HexValue: "#7FFF00" },
    { ColorName: "Chocolate", HexValue: "#D2691E" },
    { ColorName: "Coral", HexValue: "#FF7F50" },
    { ColorName: "CornflowerBlue", HexValue: "#6495ED" },
    { ColorName: "Cornsilk", HexValue: "#FFF8DC" },
    { ColorName: "Crimson", HexValue: "#DC143C" },
    { ColorName: "Cyan", HexValue: "#00FFFF" },
    { ColorName: "DarkBlue", HexValue: "#00008B" },
    { ColorName: "DarkCyan", HexValue: "#008B8B" },
    { ColorName: "DarkGoldenRod", HexValue: "#B8860B" },
    { ColorName: "DarkGray", HexValue: "#A9A9A9" },
    { ColorName: "DarkGreen", HexValue: "#006400" },
    { ColorName: "DarkKhaki", HexValue: "#BDB76B" },
    { ColorName: "DarkMagenta", HexValue: "#8B008B" },
    { ColorName: "DarkOliveGreen", HexValue: "#556B2F" },
    { ColorName: "DarkOrange", HexValue: "#FF8C00" },
    { ColorName: "DarkOrchid", HexValue: "#9932CC" },
    { ColorName: "DarkRed", HexValue: "#8B0000" },
    { ColorName: "DarkSalmon", HexValue: "#E9967A" },
    { ColorName: "DarkSeaGreen", HexValue: "#8FBC8F" },
    { ColorName: "DarkSlateBlue", HexValue: "#483D8B" },
    { ColorName: "DarkSlateGray", HexValue: "#2F4F4F" },
    { ColorName: "DarkTurquoise", HexValue: "#00CED1" },
    { ColorName: "DarkViolet", HexValue: "#9400D3" },
    { ColorName: "DeepPink", HexValue: "#FF1493" },
    { ColorName: "DeepSkyBlue", HexValue: "#00BFFF" },
    { ColorName: "DimGray", HexValue: "#696969" },
    { ColorName: "DodgerBlue", HexValue: "#1E90FF" },
    { ColorName: "FireBrick", HexValue: "#B22222" },
    { ColorName: "FloralWhite", HexValue: "#FFFAF0" },
    { ColorName: "ForestGreen", HexValue: "#228B22" },
    { ColorName: "Fuchsia", HexValue: "#FF00FF" },
    { ColorName: "Gainsboro", HexValue: "#DCDCDC" },
    { ColorName: "GhostWhite", HexValue: "#F8F8FF" },
    { ColorName: "Gold", HexValue: "#FFD700" },
    { ColorName: "GoldenRod", HexValue: "#DAA520" },
];
let colorIndex = 0;
export function getNextColor() {
    // Convert the hex color to RGB
    if (ColorHex[colorIndex] === undefined) {
        colorIndex = 0;
    }
    const hexColor = ColorHex[colorIndex].HexValue;
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;
    // Increase the color index
    colorIndex = (colorIndex + 1) % ColorHex.length;
    return { r, g, b };
}
