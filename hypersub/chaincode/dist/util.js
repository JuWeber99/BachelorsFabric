"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonUtil = void 0;
class JsonUtil {
}
exports.JsonUtil = JsonUtil;
JsonUtil.createBufferFromJSON = (jayson) => {
    return Buffer.from(JSON.stringify(jayson));
};
//# sourceMappingURL=util.js.map