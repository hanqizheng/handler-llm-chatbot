export const removeEmoji = (text: string) => {
  return text.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, ""); // 兼容性较好的正则表达式
};
