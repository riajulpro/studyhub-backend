"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const globalError_1 = __importDefault(require("./middlewares/globalError"));
const notFound_1 = require("./middlewares/notFound");
const routes_1 = __importDefault(require("./routes"));
const stripe_1 = __importDefault(require("stripe"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
exports.stripe = new stripe_1.default(process.env.STRIPE_KEY);
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)({ origin: "*" }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
// Connect to Database
(0, db_1.default)();
// Define API routes
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("hello server");
});
app.get("/test", (req, res) => res.send("hello tester 2.0"));
app.use(notFound_1.notFound);
app.use(globalError_1.default);
const server = http_1.default.createServer(app);
const port = process.env.PORT || 5000;
// run the server
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
