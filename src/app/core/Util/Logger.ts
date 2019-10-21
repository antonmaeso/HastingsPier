import * as fs from "fs";
export class Logger {
    private shouldLog = true;
    private logPath = "";

    constructor(LogPath: string) {
        this.logPath = LogPath;
        this.Log("---------Started Application---------");
    }

    public Log = (contents: string) => {
        try {
            const time = new Date(Date.now()).toLocaleString("en-GB");
            const log = time + "\t--\t" + contents + "\n";
            if (this.shouldLog) {
                if (fs.existsSync(this.logPath)) {
                    fs.appendFileSync(this.logPath, log);
                } else {
                    fs.writeFileSync(this.logPath, log);
                }
            }
        } catch {
            // tslint:disable-next-line: no-console
            console.log("Error Logging");
        }
    }

    public setLogger = (ShouldLog: boolean) => {
        this.shouldLog = ShouldLog;
    }
}
