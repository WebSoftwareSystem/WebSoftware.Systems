
'use strict';

exports.inf = async function (INF) {

    const env = new INF.LIB.EventEmitter();
    INF.LIB.ENV = env;

    const args = INF.LIB.MINIMIST(INF.options._);
    
    env.WSS_WORKSPACE_CLI_COMMAND = args._[0] || '';
    env.WSS_WORKSPACE_CLI_ARGS = INF.options._.slice(1).join('\n');

    return {

        set: function (name, value) {
            if (value.substring(0, 1) === "$") {
                env[name] = process.env[value.replace(/^\$/, '')] || '';
            } else {
                env[name] = value;
            }
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
                let nameParts = name.split(' ');
                let expected = null;
                if (nameParts.length === 2) {
                    name = nameParts[0];
                    expected = nameParts[1];                    
                }

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
                if (expected !== null) {
                    val = (val == expected);
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
