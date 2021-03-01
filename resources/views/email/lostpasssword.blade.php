<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
</head>
<body>

<div>
    Hi {{ $username }},
    <br>
    You requested a password reset. Please follow the link below to reset your password.
    <br>
    If you did not request this please ignore this email.
    <br>
    <a href="{{ url('email/reset', $recover_token)}}">Reset my password</a>
    <br/>
</div>

</body>
</html>
