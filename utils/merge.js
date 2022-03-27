function isObject(value) {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}

// { a: [{ b: 2 }] } { a: [{ c: 2 }]} -> { a: [{b:2}, {c:2}]}
// merge({o: {a: 3}}, {o: {b:4}}) => {o: {a:3, b:4}}
module.exports = function merge(source, other) {
    if (!isObject(source) || !isObject(other)) {
        return other === undefined ? source : other;
    }
    // 合并两个对象的 key，另外要区分数组的初始值为 []
    return Object.keys({
        ...source,
        ...other,
    }).reduce(
        (acc, key) => {
            // 递归合并 value
            acc[key] = merge(source[key], other[key]);
            return acc;
        },
        Array.isArray(source) ? [] : {},
    );
};
