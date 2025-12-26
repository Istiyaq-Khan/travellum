const fetch = require('node-fetch');
const fs = require('fs');

async function testTTSAPI() {
    try {
        console.log('Testing Edge TTS API endpoint...');
        console.log('Note: First run may take longer as it downloads edge-tts\n');

        const response = await fetch('http://localhost:3000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Hello! This is a test of the Microsoft Edge text to speech system. It is completely free and requires no API keys.'
            })
        });

        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers.get('content-type'));

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Error:', error);
            return;
        }

        const buffer = await response.buffer();
        console.log('Audio size:', buffer.length, 'bytes');

        fs.writeFileSync('test-audio.mp3', buffer);
        console.log('✅ Audio saved to test-audio.mp3');
        console.log('✅ Edge TTS is working correctly!');
        console.log('\n🎉 You can now use TTS for FREE with no API keys!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testTTSAPI();
