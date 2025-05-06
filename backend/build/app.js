"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./endpoints/routes");
const app = (0, express_1.default)();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const options = {
    swaggerOptions: {
        authAction: {
            bearerAuth: {
                name: "bearerAuth",
                schema: {
                    type: "http",
                    in: "header",
                    name: "Authorization",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
                value: "Bearer <SEU_TOKEN_AQUI>",
            },
        },
    },
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use("/v1", routes_1.router);
app.listen(3003, () => {
    console.log("Server is running  in http://localhost:3003");
});
exports.default = app;
//# sourceMappingURL=app.js.map