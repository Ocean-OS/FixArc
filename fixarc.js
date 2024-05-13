const fs = require('fs');
const os = require('os');
const path = require('path');
const {execSync} = require('child_process');
var args = process.argv;
args = args.filter((f,i)=>{return i > 1});
var rerun = false;
var time = 100;
var iterations = 0;
if(args.includes('-r')||args.includes('--rerun')){
    rerun = true;
}
if((args.includes('-t') && args.length+1 > args.indexOf('-t'))||(args.includes('--time') && args.length+1 > args.indexOf('--time'))){
    time = Number(args[args.indexOf(((args.includes('-t') && args.length+1 > args.indexOf('-t')) ? '-t' : '--time'))+1]);
    if(time == NaN){
        time = 100;
    }
}
if(args.includes('--set-default')||args.includes('-s')){
    fs.writeFileSync(path.join(__dirname, 'config.json'),JSON.stringify({
        rerun: rerun,
        time: time,
    }));
}
if(args.length == 0 && fs.existsSync(path.join(__dirname,'config.json'))){
    rerun = JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'),'utf-8')).rerun;
    time = JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'),'utf-8')).time;
}
if(args.includes('-o')||args.includes('--original-default')){
    rerun = false;
    time = 100;
}
if (os.platform() === 'win32') {
    var arcPath = `${os.homedir()}\\AppData\\Local\\Packages\\TheBrowserCompany.Arc_ttt1ap7aakyb4\\LocalCache\\Local\\firestore\\Arc`;
    if (fs.existsSync(arcPath)) {
        console.log("Starting FixArc service...");
        setInterval(() => {
            if(iterations == 0){
                console.log("FixArc successfully started!");
            }
            if((!isProcessRunning("Arc.exe")) && rerun == true){
                execSync("start arc.exe");
            }
            if (fs.existsSync(arcPath)) {
                try {
                    fs.rmSync(arcPath, {
                        recursive: true
                    });
                } catch (err) {
                    var directory = fs.readdirSync(arcPath, {
                        recursive: true
                    });
                    directory.forEach((file) => {
                        try {
                            if (fs.existsSync(path.join(arcPath, file))) {
                                fs.rmSync(path.join(arcPath, file), (fs.statSync(path.join(arcPath, file)).isDirectory ? {
                                    recursive: true
                                } : undefined));
                            }
                        } catch (err) {

                        }
                    })
                }
            }
            iterations++;
        }, (time));
    } else {
        throw new Error("You do not appear to have Arc installed.");
    }
} else {
    throw new Error("This script only works on Windows.");
}
function isProcessRunning(processName) {
    try {
        const output = execSync(`tasklist /FI "IMAGENAME eq ${processName}"`, { encoding: 'utf8' });
        return output.includes(processName);
    } catch (error) {
        console.error('Error checking process:', error.message);
        return false;
    }
}