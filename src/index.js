import {
    writeFileSync,
    existsSync,
    readFileSync,
    rmSync,
    readdirSync,
    statSync,
} from 'fs';
import { platform, homedir } from 'os';
import { join } from 'path';
import { execSync } from 'child_process';
const args = process.argv.filter((_, i) => {
    return i > 1;
});
let rerun = false;
let time = 100;
let iterations = 0;
if (args.includes('-r') || args.includes('--rerun')) {
    rerun = true;
}
if (
    (args.includes('-t') && args.length + 1 > args.indexOf('-t')) ||
    (args.includes('--time') && args.length + 1 > args.indexOf('--time'))
) {
    time = Number(
        args[
            args.indexOf(
                args.includes('-t') && args.length + 1 > args.indexOf('-t')
                    ? '-t'
                    : '--time'
            ) + 1
        ]
    );
    if (time === NaN) {
        time = 100;
    }
}
if (args.includes('--set-default') || args.includes('-s')) {
    writeFileSync(
        join(import.meta.dirname, 'config.json'),
        JSON.stringify({
            rerun: rerun,
            time: time,
        })
    );
}

if (args.length === 0 && existsSync(join(import.meta.dirname, 'config.json'))) {
    ({ time, rerun } = JSON.parse(
        readFileSync(join(import.meta.dirname, 'config.json'), 'utf-8')
    ));
}
if (args.includes('-o') || args.includes('--original-default')) {
    rerun = false;
    time = 100;
}
if (platform() === 'win32') {
    const arc_path = `${homedir()}\\AppData\\Local\\Packages\\TheBrowserCompany.Arc_ttt1ap7aakyb4\\LocalCache\\Local\\firestore\\Arc`;
    if (existsSync(arc_path)) {
        console.log('Starting FixArc service...');
        setInterval(() => {
            if (iterations === 0) {
                console.log('FixArc successfully started!');
            }
            if (!is_process_running('Arc.exe') && rerun) {
                execSync('start arc.exe');
            }
            if (existsSync(arc_path)) {
                try {
                    rmSync(arc_path, {
                        recursive: true,
                    });
                } catch (err) {
                    const directory = readdirSync(arc_path, {
                        recursive: true,
                    });
                    for (const file of directory) {
                        const path = join(arc_path, file);
                        if (!existsSync(path)) {
                            continue;
                        }
                        const is_directory = statSync(path).isDirectory;
                        try {
                            rmSync(
                                path,
                                is_directory ? { recursive: true } : undefined
                            );
                        } catch {}
                    }
                }
            }
            iterations++;
        }, time);
    } else {
        throw new Error('You do not appear to have Arc installed.');
    }
} else {
    throw new Error('This script only works on Windows.');
}

/**
 * @param {string} process_name
 * @returns {boolean}
 */
function is_process_running(process_name) {
    try {
        const output = execSync(`tasklist /FI "IMAGENAME eq ${process_name}"`, {
            encoding: 'utf8',
        });
        return output.includes(process_name);
    } catch (err) {
        console.error('Error checking process:', err.message);
        return false;
    }
}
