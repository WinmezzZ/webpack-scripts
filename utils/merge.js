function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item) && item !== null;
}

/**
 * 深合并 2 个对象
 */
module.exports = function merge(target, source) {
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                merge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return target;
};
