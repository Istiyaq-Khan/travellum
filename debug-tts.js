const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
require('dotenv').config({ path: '.env.local' });

async function testTTS() {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        console.log("API Key loaded:", !!apiKey);
        if (!apiKey) throw new Error("Missing API Key");

        const client = new ElevenLabsClient({ apiKey });

        console.log("Attempting generation...");
        const audioStream = await client.textToSpeech.convert(
            "21m00Tcm4TlvDq8ikWAM",
            {
                text: "Testing one two three",
                model_id: "eleven_multilingual_v2",
                output_format: "mp3_44100_128"
            }
        );

        console.log("Generation successful!");
        console.log("Stream type:", typeof audioStream);
        console.log("Has getReader?", typeof audioStream.getReader === 'function');

    } catch (e) {
        console.error("FAILED:", e);
    }
}
testTTS();
