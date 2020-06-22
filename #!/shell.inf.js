
'use strict';

exports.inf = async function (INF) {

    const READLINE = require('readline');

    const waitforDeferred = INF.LIB.Promise.defer();

    return {

        start: async function () {

            const rl = READLINE.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            let shutdown = false;
            rl.on('close', function () {
                waitforDeferred.resolve();
                shutdown = true;
                INF.LIB.ENV.emit('shutdown');
            });
            INF.LIB.ENV.on('shutdown', function () {
                if (!shutdown) rl.close();
            });

            function showHelp () {
                process.stdout.write(`
  Commands:

    h       Help
    q       Quit

    *       Any valid bash command instruction line.

`);
            }

            let emptyCount = 0;
            function prompt () {

                rl.question(INF.LIB.COLORS.magenta.bold('WSS $ '), function (input) {

                    if (input == 'q') {
                        rl.close();
                        return;
                    } else
                    if (input === '') {
                        emptyCount += 1;
                        if (emptyCount >= 3) {
                            emptyCount = 0;
                            showHelp();
                        }
                    } else
                    if (input == 'h') {
                        showHelp();
                    } else {
                        INF.LIB.RUNBASH(input, {
                            cwd: INF.LIB.ENV.WSS_WORKSPACE_ROOT_PATH,
                            progress: true
                        }).then(function () {
                            prompt();
                        }, function (err) {
                            console.error(INF.LIB.COLORS.red(`Got exit code '${err.code}' while running bash command!`));
                            prompt();
                        });
                        return;
                    }
                    prompt();
                });
            }

            prompt();
        },

        waitfor: async function () {
            await waitforDeferred.promise;
        }
    };
}
