/**
 * 对象排除特性属性
 */
export default function omit<T extends Record<string, any>>(obj: T, fields: (keyof T)[] = []) {
    const shallowCopy: T = Object.assign({}, obj);
    for (let i = 0; i < fields.length; i += 1) {
        const key = fields[i];
        delete shallowCopy[key];
    }
    return shallowCopy;
}
