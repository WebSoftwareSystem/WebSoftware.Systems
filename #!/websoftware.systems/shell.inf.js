
exports.inf = async function (INF) {

    const READLINE = require('readline');
    const CHOKIDAR = require('chokidar');

    const waitforShellExitDeferred = INF.LIB.Promise.defer();
    const commandInstructions = {};
    const activeChildProcessControls = {};

    async function run (input) {

        const inputParts = input.split(' ');

        if (commandInstructions[inputParts[0]]) {

            const instructions = commandInstructions[inputParts[0]];

            let codeblock = null;

            if (INF.isCodeblock(instructions.value)) {
                codeblock = INF.LIB.CODEBLOCK.thawFromJSON(instructions.value);
            } else
            if (
                instructions.value &&
                INF.isCodeblock(instructions.value.value)
            ) {
                codeblock = INF.LIB.CODEBLOCK.thawFromJSON(instructions.value.value);
            }

            if (codeblock) {

                const format = codeblock.getFormat();

                if (format === 'inf') {

                    await INF.load(instructions);

                } else
                if (format === 'bash') {

                    try {
                        const waitfor = INF.LIB.Promise.defer();

                        // TODO: Indent output and prefix.

                        const controls = await INF.LIB.RUNBASH(codeblock.getCode(), {
                            cwd: INF.LIB.ENV.WSS_WORKSPACE_ROOT_PATH,
                            progress: true,
                            wait: false,
                            env: INF.LIB.LODASH.merge({}, process.env, {
                                ARGS: inputParts.slice(1).join(' ')
                            })
                        });

                        activeChildProcessControls[input] = controls;

                        controls.process.on('close', function (code) {
                            delete activeChildProcessControls[input];

                            if (code > 0) {
                                let err = new Error("Commands exited with code: " + code);
                                err.code = code;
                                waitfor.reject(err);
                                return;
                            }
                            waitfor.resolve();
                        });

                        await waitfor.promise;

                    } catch (err) {
                        if (err.code) {
                            console.error(INF.LIB.COLORS.red(`Got exit code '${err.code}' while running bash command!`));
                        } else {
                            console.error(INF.LIB.COLORS.red(`Got error '${err.message}' while running bash command!`));
                        }
                    }        
                }

            } else {
                console.error('instructions:', instructions);
                throw new Error(`Command instructions not in codeblock format!`);
            }
        } else {
            try {
                await INF.LIB.RUNBASH(input, {
                    cwd: INF.LIB.ENV.WSS_WORKSPACE_ROOT_PATH,
                    progress: true
                });
            } catch (err) {
                if (err.code) {
                    console.error(INF.LIB.COLORS.red(`Got exit code '${err.code}' while running bash command!`));
                } else {
                    console.error(INF.LIB.COLORS.red(`Got error '${err.message}' while running bash command!`));
                }
            }
        }
        
    }

    return {

        start: async function () {

            const rl = READLINE.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            let shutdown = false;
            rl.on('close', function () {
                waitforShellExitDeferred.resolve();
                shutdown = true;
                INF.LIB.ENV.emit('shutdown');
            });
            INF.LIB.ENV.on('shutdown', function () {
                if (!shutdown) rl.close();
            });

            rl.addListener('SIGINT', function () {
                if (Object.keys(activeChildProcessControls).length) {
                    console.log(INF.LIB.COLORS.yellow(`Killing child processes ...`));

                    Object.keys(activeChildProcessControls).forEach(function (key) {
                        activeChildProcessControls[key].killDeep();
                    });
                } else {
                    console.log(`\nUse 'Ctrl + d' or 'q' to exit WSS workspace.`);
                    prompt();
                }
            });

            let emptyCount = 0;

            async function act (input) {
                if (input == 'q') {
                    rl.close();
                    return;
                } else
                if (input === '') {
                    emptyCount += 1;
                    if (emptyCount >= 3) {
                        emptyCount = 0;
                        await run('help');
                    }
                } else {
                    await run(input);
                }
                prompt();
            }

            function prompt () {
                rl.question(INF.LIB.COLORS.magenta.bold('WSS $ '), function (input) {

                    act(input).catch(function (err) {
                        console.error('Error while handling input:', err);

                        prompt();
                    });
                });
            }

            prompt();
        },

        run: async function (input) {

            console.error(INF.LIB.COLORS.cyan(`[WSS:Workspace:02] Running command: ${input}`));
            console.error(INF.LIB.COLORS.cyan(`[WSS:Workspace:02] >>>`));

            await run(input);

            console.error(INF.LIB.COLORS.cyan(`[WSS:Workspace:02] <<<`));
        },

        watch: async function () {

            const onChange = INF.LIB.LODASH.debounce(async function () {

                process.stdout.write('\033c');

                console.error(INF.LIB.COLORS.cyan(`[WSS:Workspace:02] Change detected.`));

                await INF.LIB.FS.outputFile(INF.LIB.PATH.join(INF.LIB.ENV.WSS_SOURCE_ROOT_PATH, '.~trigger-workspace-restart'), '', 'utf8');

                INF.LIB.ENV.emit('shutdown');
            }, 500);

            const watcher = CHOKIDAR.watch(INF.LIB.ENV.WSS_SOURCE_ROOT_PATH, {});
            watcher.on('change', onChange);
            INF.LIB.ENV.on('shutdown', function () {
                watcher.close();
            });                        
        },

        waitfor: async function () {
            await waitforShellExitDeferred.promise;
        },

        invoke: async function (pointer, value) {

            if (/^onCommand\(\)\s+(.+)$/.test(pointer)) {

                const names = pointer.replace(/^onCommand\(\)\s+(.+)$/, '$1').split(' ');

                names.forEach(function (name) {

                    commandInstructions[name] = value;
                });

                return true;
            }
        }
    };
}
