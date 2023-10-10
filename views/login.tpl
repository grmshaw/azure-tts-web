<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/login.css">
    <link rel="icon" href="/static/favicon.png">
    <title>Text to Speech</title>
</head>
<body>
    <div class="authzone">
        <h2>Please enter your passphrase</h2>
        % if error:
            <p>{{error}}</p>
        % end
        <form action="/login" method="post">
            <input type="password" name="token" id="token" required maxlength="30" autofocus>
            <input type="submit" value="Login">
        </form>
    </div>
    <footer>
        <p>Made with &hearts; by Cyan & <a href="https://grm.sh" target="_blank">Graham</a></p>
    </footer>
</body>
</html>