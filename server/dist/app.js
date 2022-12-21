"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = __importDefault(require("./routes/users"));
const admin_1 = __importDefault(require("./routes/admin"));
const index_1 = __importDefault(require("./routes/index"));
const vendor_1 = __importDefault(require("./routes/vendor"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
config_1.db.sync()
    .then(() => {
    console.log("Db connected successfully");
})
    .catch((err) => {
    console.log(err);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
//Router Middleware
app.use("/", index_1.default);
app.use("/users", users_1.default);
app.use("/admins", admin_1.default);
app.use("/vendors", vendor_1.default);
const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
exports.default = app;
