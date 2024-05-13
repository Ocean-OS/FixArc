# FixArc
A very small script that attempts to stop [Arc Browser](https://arc.net) from crashing so much. 
## How it works
Arc Browser is currently in a somewhat primitive state on Windows as this is being written, and has a very pesky habit of crashing for some reason every few hours. The assumed solution is to reinstall Arc, but this gets very annoying very fast. However, I stumbled upon a script that could be used to get Arc back to a working state, [here](https://www.reddit.com/r/ArcBrowser/comments/1ak6e59/comment/kqkmv78/)'s a link to the original post. It removes a directory that for some reason is very troublesome for Arc, even though Arc seems to use it the entire time it is running. This script I have made automates that process, and if Arc crashes, it can automatically restart it for you. 
## Features
- Automatically removes the troublesome directory and any of its files
- Restarts Arc if it crashes, or is closed
## Usage
To start the script, just use `node fixarc.js`. You need to have Node and NPM installed for this script to work. The script uses no dependencies that aren't already preinstalled with NPM. (The script only uses `path`, `fs`, `os`, and `child_process` (and any of their dependencies).)
#### Arguments
You can configure FixArc to do certain things when it runs. 
- Using the `-r` or `--rerun` argument will set FixArc to automatically reopen Arc if it crashes. 
- Using the `-t` or `--time` argument with an integer succeeding it will change the interval of time (in milliseconds) that FixArc waits between removing the folder and, if set, reopening Arc. 
- Using the `-s` or `--set-default` argument will save your arguments to a file called `config.json` to use as the default the next time you run FixArc. 
- Using the `-o` or `--original-default` will use the original default arguments that have been programmed into the script (Interval set to 100, no rerun). 