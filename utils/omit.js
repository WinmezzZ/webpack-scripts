/** 
 * 对象排除特性属性
 * @param {object} obj 
 * @param {string[]} fields
 * @returns {object}
 */
module.exports = function omit(obj, fields) {
  const shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}