const Message = require('../models/Message');
const mongoose = require('mongoose');
const axios = require('axios');
const twilio = require('twilio');

const sendMessage = async (req, res) => {
    const { message, userNumber } = req.body;

    try {
        // 1. Call Gemini API
        // Note: This endpoint is an example. You may need to use the Google Generative AI SDK for Node.js for better integration.
        // However, sticking to the user's requested axios pattern:
        let botResponse = "I am a bot response.";

        // Check if API key is present before calling
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
            try {
                const geminiResponse = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                    {
                        contents: [{ parts: [{ text: `You are a helpful AI assistant connected to a WhatsApp Chatbot. Answer the following user message concisely and helpfully: ${message}` }] }]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                botResponse = geminiResponse.data.candidates[0].content.parts[0].text;
            } catch (apiError) {
                const errorDetails = apiError.response ? JSON.stringify(apiError.response.data) : apiError.message;
                console.error('Gemini API Error:', errorDetails);
                botResponse = `Gemini Error: ${errorDetails}`;
            }
        } else {
            console.log("Gemini API Key missing or default, skipping API call.");
            botResponse = `[Mock Response] You said: ${message}`;
        }

        // 2. Send WhatsApp Message via Twilio
        if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SID !== 'your_twilio_sid') {
            try {
                const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
                // Use Sandbox Number by default. Custom numbers require Meta approval.
                const fromNumber = 'whatsapp:+14155238886';

                const twilioMsg = await client.messages.create({
                    from: fromNumber,
                    to: `whatsapp:${userNumber}`,
                    body: botResponse
                });
                console.log(`WhatsApp message sent! SID: ${twilioMsg.sid}`);
            } catch (twilioError) {
                console.error('Twilio Error:', twilioError.code, twilioError.message);
                // Don't fail the request just because Twilio failed, unless critical
            }
        } else {
            console.log("Twilio credentials missing or default, skipping WhatsApp send.");
        }

        // 3. Save chat in MongoDB or Local Cache
        if (mongoose.connection.readyState === 1) {
            try {
                const chat = new Message({ userMessage: message, botResponse });
                await chat.save();
            } catch (dbError) {
                console.error("Database save error:", dbError.message);
                // If DB fails, we might still want to return the response to UI
            }
        } else {
            console.log("Database not connected, saving to local memory.");
            localChatHistory.push({ userMessage: message, botResponse, createdAt: new Date() });

            res.json({ botResponse });

        } catch (error) {
            console.error('General Error:', error.message);
            res.status(500).json({ botResponse: `Server Error: ${error.message}` });
        }
    };

    const getHistory = async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const chats = await Message.find().sort({ createdAt: 1 });
                res.json(chats);
            } else {
                res.json(localChatHistory);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const receiveMessage = async (req, res) => {
        const inboundMsg = req.body.Body;
        const fromNumber = req.body.From;

        console.log(`Inbound Message from ${fromNumber}: ${inboundMsg}`);

        // If no message, just return
        if (!inboundMsg) {
            return res.status(400).send("No message body");
        }

        try {
            // 1. Get Gemini Response
            let botResponse = "I am a bot.";
            try {
                const geminiResponse = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                    {
                        contents: [{ parts: [{ text: `You are a helpful WhatsApp bot. User said: ${inboundMsg}` }] }]
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                botResponse = geminiResponse.data.candidates[0].content.parts[0].text;
            } catch (apiError) {
                console.error("Gemini Error:", apiError.message);
                botResponse = "Sorry, I am having trouble thinking right now.";
            }

            // 2. Respond via Twilio (TwiML is best for webhooks, but using client for consistency works too if we return 200 OK)
            const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                from: 'whatsapp:+14155238886',
                to: fromNumber,
                body: botResponse
            });

            // 3. Save to DB or Local Cache
            if (mongoose.connection.readyState === 1) {
                const chat = new Message({ userMessage: inboundMsg, botResponse });
                await chat.save();
            } else {
                localChatHistory.push({ userMessage: inboundMsg, botResponse, createdAt: new Date() });
                console.log("Saved to local memory (DB disconnected)");
            }

            res.status(200).send('Message received');

        } catch (err) {
            console.error("Webhook Error:", err);
            res.status(500).send(err.message);
        }
    };

    module.exports = { sendMessage, receiveMessage, getHistory };
