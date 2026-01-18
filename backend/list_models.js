const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const listModels = async () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        fs.writeFileSync('models_output.txt', "No API Key found in .env");
        return;
    }

    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
        );
        const modelNames = response.data.models.map(m => m.name).join('\n');
        fs.writeFileSync('models_output.txt', modelNames);
        console.log("Models written to models_output.txt");
    } catch (error) {
        const err = error.response ? JSON.stringify(error.response.data) : error.message;
        fs.writeFileSync('models_output.txt', "Error: " + err);
    }
};

listModels();
