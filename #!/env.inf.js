
'use strict';

exports.inf = async function (INF) {

    const env = {};

    return {

        set: function (name, value) {
            env[name] = value;
        },

        env: function () {
            return function (path) {
                if (!path.length) return env;
                return INF.LIB.LODASH.get(env, path, undefined);
            };
        },

        invoke: async function (pointer, value) {

            if (/^if\(\)/.test(pointer)) {
                let name = pointer.replace(/^if\(\)\s*/, '');
                const inverse = (name.substring(0, 1) === '!');
                if (inverse) {
                    name = name.replace(/^!/, '');
                }
                const val = INF.LIB.LODASH.get(
                    env,
                    [name],
                    INF.LIB.LODASH.get(
                        process.env,
                        [name],
                        undefined
                    )
                );
                if (
                    inverse && !val ||
                    !inverse && val
                ) {
                    await INF.load(value);
                }
                return true;
            }
        }
    };
}
