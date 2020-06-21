
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
        }
    };
}
