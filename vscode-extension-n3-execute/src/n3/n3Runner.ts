import {ChildProcess, spawn} from "child_process";
import {ViewColumn, window, workspace} from "vscode";
import {n3OutputChannel} from "./n3OutputChannel";
import {join} from "path";

import $rdf = require('rdflib');
const store = $rdf.graph()

export class Runner {

    private _process: ChildProcess | undefined;
    private _chunks: Array<Buffer> = [];

    public runN3ExecuteCommand(command: string, args: string[], n3: string, cwd?: string) {
        n3OutputChannel.clear();
        n3OutputChannel.show();

        this._process = spawn(command, args, {cwd: cwd, shell: true});

        this._process.stdin.end(n3, () => {
            //n3OutputChannel.append("file path written to stdin");
        });

        this._process.stdout.on('data', (data) => {
            this._chunks.push(data);
        });

        this._process.stderr.on('data', (data) => {
            //n3OutputChannel.append(data.toString());
            window.showInformationMessage(data.toString());            
        });

        this._process.on("exit", async (code) => {
            if (code === 0) {
                window.showInformationMessage("N3 Rule successfully executed.");
                try {
                    //turn the buffer into a list of lines and then join them back together
                    let output = Buffer.concat(this._chunks).toString().split("\n")
                    let body = output.join("\n");
                    // get the working directory for the extension
                    let extensionPath = workspace.getConfiguration("n3").get("extensionPath");
                    
                    const python = spawn('python3', ['format_results.py', body.toString()])

                    python.stdout.on('data', (data) => {
                        //console.log(`stdout: ${data}`);
                        n3OutputChannel.append(data.toString());
                    });
                    python.stderr.on('data', (code) => {
                        //console.log(`stderr: ${code}`);
                        window.showInformationMessage(`child process close all stdio with code ${code}`);
                    });

                } catch (e) {
                    window.showErrorMessage("Failed serializing result to output window");
                    console.error(e);
                }
            } else if (code === 1) {
                window.showInformationMessage("N3 Rule failed.");
            }
        });
    }
}
