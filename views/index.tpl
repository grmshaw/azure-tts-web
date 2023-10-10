<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/style.css">
    <link rel="icon" href="/static/favicon.png">
    <title>Text to Speech</title>
</head>
<body>
    <h1>Text to Speech</h1>
    <div class="buttons-container">
        <button id="preview">Preview</button>
        <button id="synthesize">Download</button>
        <button id="add-block">Add a field</button>
    </div>
    <div id="loader"></div>
    <div id="party-popper">🎉</div>
    <div id="main-container">
    <details style="text-align: left;">
        <summary>How do I add pauses?</summary>
        <pre>- Place &lt;break time='5s'/&gt; where you want a pause.<br>- You can use values from 1s to 5s for the pause duration.<br>- If you need a longer pause, you can paste multiple pause tags.</pre>
    </details>
    </div>
    <script src="/static/js/script.js"></script>
    <footer>
        <p>Made with &hearts; by Cyan & <a href="https://grm.sh" target="_blank">Graham</a></p>
    </footer>
</body>
</html>
