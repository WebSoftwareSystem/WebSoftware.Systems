
'use strict';

exports.inf = async function (INF) {

    const env = {};

    const args = INF.LIB.MINIMIST(INF.options._);

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
                let val = null;

                if (/^--/.test(name)) {
                    const parts = name.match(/^--(\S+)\s*(.+)$/);
                    if (!parts) throw new Error(`if() argument '${name}' does not follow expected format!`);
                    val = (args[parts[1]] === parts[2]) || false;
                } else {
                    val = INF.LIB.LODASH.get(
                        env,
                        [name],
                        INF.LIB.LODASH.get(
                            process.env,
                            [name],
                            undefined
                        )
                    );
                }
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
