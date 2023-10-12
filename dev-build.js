import watch from 'watch'
import { exec } from "child_process"

watch.watchTree('./cpp', function (f, curr, prev) {
    exec('make main', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })
  })