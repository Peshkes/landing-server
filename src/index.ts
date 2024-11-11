import {app} from "./app";


const port = process.env.PORT || 27000;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});
