import express from 'express';

const app = express();
const port = 8000;

app.use(express.json());

const run = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server started on port http://localhost:${port}`);
        })
    } catch (e){
        console.error(e);
    }
};

run().catch((e) => console.error(e));
