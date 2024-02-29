const fileInput = document.getElementById("font-upload");
const transformBtn = document.getElementById("transform-btn");
const originalText = document.getElementById("original-textarea");
const transformText = document.getElementById("transform-textarea");
const ignoreText = document.getElementById("ignore-textarea");

let font = null;

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  font = opentype.parse(await file.arrayBuffer());
});

transformBtn.addEventListener("click", () => {
  if (font === null) {
    alert("请先选择字体文件!");
  }
  const ignoreStr = ignoreText.value;
  const originalStr = originalText.value;
  const glyphIndexMap = font.tables.cmap.glyphIndexMap;

  let symbolStr = "";

  for (const char of originalStr) {
    const charUnicode = char.charCodeAt(0);

    if (ignoreStr.includes(char)) {
      symbolStr += String.fromCharCode(charUnicode);
      continue;
    }

    const glyphIndex = glyphIndexMap[charUnicode];
    const glyph = font.glyphs.get(glyphIndex);

    const symbolChars = glyph.unicodes.filter(
      (unicode) => unicode !== charUnicode
    );

    if (_.isEmpty(symbolChars)) {
      symbolStr += String.fromCharCode(charUnicode);
    } else {
      symbolStr += String.fromCharCode(symbolChars.pop());
    }
  }

  transformText.value = symbolStr;
});
