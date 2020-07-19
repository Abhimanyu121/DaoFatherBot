"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethAddressVerify = void 0;
exports.ethAddressVerify = (address) => {
    return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address));
};
//# sourceMappingURL=utils.js.map