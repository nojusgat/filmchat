<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv=”X-UA-Compatible” content=”IE=edge”>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Filmchat</title>

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body>

    <!-- React root DOM -->
    <div id="root">
    </div>

    <!-- React JS -->
    <script src="{{ asset('js/app.js') }}?v={{time()}}" defer></script>

</body>
</html>
