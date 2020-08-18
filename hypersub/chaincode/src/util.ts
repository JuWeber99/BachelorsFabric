import JSONStream = Mocha.reporters.JSONStream;

export class JsonUtil {

    public static createBufferFromJSON = (jayson: Object): Buffer => {
        return Buffer.from(JSON.stringify(jayson))
    }

}