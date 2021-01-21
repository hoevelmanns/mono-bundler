"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monobundler = void 0;
require("reflect-metadata");
const mono_bundler_1 = require("./mono-bundler");
/**
 *
 * @param {BuildOptions} options
 */
const monobundler = (options) => new mono_bundler_1.MonoBundler(options).build();
exports.monobundler = monobundler;
