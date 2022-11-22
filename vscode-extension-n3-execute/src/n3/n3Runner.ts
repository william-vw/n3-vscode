import {ChildProcess, spawn} from "child_process";
import {ViewColumn, window, workspace} from "vscode";
import {n3OutputChannel} from "./n3OutputChannel";
import {join} from "path";

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
            n3OutputChannel.append(data.toString());
        });

        this._process.on("exit", async (code) => {
            if (code === 0) {
                window.showInformationMessage("N3 Rule successfully executed.");
                try {
                    //turn the buffer into a list of lines and then join them back together
                    let output = Buffer.concat(this._chunks).toString().split("\n")
                    
                    n3OutputChannel.append(output.join("\n"));
                    if (workspace.workspaceFolders) {
                    //     // open the output file
                    //     let configuration = workspace.getConfiguration("n3");
                    //     let outputFile = configuration.get<string>("outputFileName");                                                  
                    //     let outputPath = join(workspace.workspaceFolders[0].uri.fsPath, outputFile);
                    //     let document = await workspace.openTextDocument(outputPath);
                    //     await window.showTextDocument(document, ViewColumn.Beside);
                    }

                } catch (e) {
                    window.showErrorMessage("Failed to show output in a new document");
                    console.error(e);
                }
            } else if (code === 1) {
                window.showInformationMessage("N3 Rule failed.");
            }
        });
    }
}
