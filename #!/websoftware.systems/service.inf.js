
'use strict';

exports.inf = async function (INF) {

    const HTTP = require('http');
    const EXPRESS = require('express');
    const MORGAN = require('morgan');

    let server = null;
    let shutdown = false;
    
    return {

        start: async function () {

            const app = EXPRESS();

            app.use(MORGAN('tiny'));

            server = HTTP.createServer(app);
            server.on('close', function () {
                shutdown = true;
                INF.LIB.ENV.emit('shutdown');
            });
            INF.LIB.ENV.on('shutdown', function () {
                if (!shutdown) server.close();
            });

            await new Promise(function (resolve, reject) {
                server.listen(
                    parseInt(INF.LIB.ENV.WSS_WORKSPACE_SERVICE_PORT),
                    INF.LIB.ENV.WSS_WORKSPACE_SERVICE_BIND,
                    function (err) {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });
        },
        stop: function () {
            if (server && !shutdown) server.close();
        }
    };
}
