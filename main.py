import os
import requests
import uuid
from bottle import Bottle, run, route, static_file, request, template, redirect, response

SECRET_KEY = os.getenv('TTS_SECRET_KEY')
VALID_TOKENS = os.getenv('TTS_VALID_TOKENS').replace(' ', '').split(',')
AZURE_SPEECH_KEY = os.getenv('AZURE_SPEECH_KEY')

def validate_credentials(token):
    return token in VALID_TOKENS

def is_authenticated():
    session_token = request.get_cookie("session_token", secret=SECRET_KEY)
    return session_token in VALID_TOKENS

def require_auth(func):
    def wrapper(*args, **kwargs):
        if not is_authenticated():
            return redirect("/login")
        return func(*args, **kwargs)
    return wrapper

app = Bottle()

@app.route('/login')
def login():
    # Pass an empty string for the error variable
    return template('login', error="")

@app.route('/login', method='POST')
def do_login():
    token = request.forms.get('token')

    if validate_credentials(token):
        response.set_cookie("session_token", token, secret=SECRET_KEY)
        return redirect("/")
    else:
        return template('login', error="Invalid Token")

@app.route('/logout')
def logout():
    response.delete_cookie("session_token")
    return redirect("/login")

@app.route('/')
@require_auth
def index():
    return template('index')

@app.route('/synthesize', method='POST')
def synthesize():
    data = request.json
    azure_speech_key = AZURE_SPEECH_KEY
    azure_speech_region = "eastus"
    azure_speech_api_url = f"https://{azure_speech_region}.tts.speech.microsoft.com/cognitiveservices/v1"

    output_filename = f"output_{uuid.uuid4()}.mp3"

    with open(output_filename, "wb") as output_file:
        for item in data:
            if item['type'] == 'text':
                voice_name = item['voice']
                speed = item.get('speed', 1.0)  # Default speed is 1.0 if not provided

                # Adjust the speed in the SSML markup
                speed_ssml = f'<prosody rate="{speed}">' if speed != 1.0 else ''
                ssml = (
                    f"<speak version='1.0' xml:lang='en-US'>"
                    f"<voice xml:lang='en-US' xml:gender='Female' name='{voice_name}'>"
                    f"{speed_ssml}{item['text']}{'</prosody>' if speed != 1.0 else ''}</voice></speak>"
                )

            elif item['type'] == 'break':
                ssml = f"<speak version='1.0' xml:lang='en-US'><break time='{item['duration']}s'/></speak>"

            headers = {
                "Ocp-Apim-Subscription-Key": azure_speech_key,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
                "User-Agent": "Python",
            }
            response = requests.post(azure_speech_api_url, headers=headers, data=ssml.encode('utf-8'))

            if response.status_code == 200:
                output_file.write(response.content)
            else:
                print(f"Error: {response.status_code} {response.reason}")

    response = static_file(output_filename, root='./', download=output_filename)
    os.remove(output_filename)
    return response

@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./static')

if __name__ == "__main__":
    print('Listening on http://localhost:12080/')
    run(app, host='0.0.0.0', port=12080,  reloader=True)
