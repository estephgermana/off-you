import express, { Express } from 'express';
import cors from 'cors';
import { router } from "./endpoints/routes";
import dotenv from 'dotenv';

const app: Express = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

app.use(express.json());
app.use(cors());
dotenv.config();

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

app.use("/v1", router);

app.listen(3003, () => {
    console.log("Server is running  in http://localhost:3003")
})

export default app;
