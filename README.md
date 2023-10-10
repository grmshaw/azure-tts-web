# azure-tts-web

This is a web application for text-to-speech synthesis using Azure Cognitive Services. It allows users to synthesize text into speech in multiple voices and download the resulting audio files.

## Installation

To run this application, perform the following steps:

1. Clone this repository
2. Install the required dependencies: `pip install -r requirements.txt`
3. Set up the necessary environment variables:
   - `TTS_SECRET_KEY`: Secret key for securing session tokens.
   - `TTS_VALID_TOKENS`: Comma-separated list of valid tokens for authentication.
   - `AZURE_SPEECH_KEY`: API key for Azure Cognitive Services Speech service.
4. Start the application: `python app.py`
5. Access the application in your browser at `http://localhost:12080/`

## Usage

### Authentication

To authenticate, open the web page and enter your token in the provided input box. Click the "Login" button to proceed.

### Synthesis

To synthesize text into speech, fill in the desired text and voice options in the form on the main page. Adjust the speed if needed. Then, click the "Synthesize" button to generate the audio file.

### Logout

To logout and clear the authentication token, click the "Logout" button.

## License

This project is licensed under the MIT License.