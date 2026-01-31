import app from '../../backend/src/server.js';

export const config = {
    api: {
        bodyParser: false, // Express handles body parsing
        externalResolver: true, // Express handles routing
    },
};

export default app;
