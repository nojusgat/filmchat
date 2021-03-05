<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
</head>
<body>

<style>
div {
  background-color: #343c44;
  text-align:center;
}
strong{
 color:black;
 margin-left: 100px;
 color:white;
 font-family:Roboto
}
h1{
text-align:center;
margin-right:70px;
}
p{
 padding:1px;
 color:white;
 font-family:Roboto;
 margin-left:5px;
 text-align:center;
}
a{
margin-left:200;
}
a.site{
	color: #047cfc;
}
a.button{
display:inline-block;
padding:0.3em 1.2em;
margin:0 0.3em 0.3em 0;
border-radius:2em;
box-sizing: border-box;
text-decoration:none;
font-family:'Roboto',sans-serif;
font-weight:300;
color:#FFFFFF;
background-color:#047cfc;
text-align:center;
transition: all 0.2s;
}
a.button:hover{
background-color:#046cdc;
}
@media all and (max-width:30em){
a.button{
display:block;
margin:0.2em auto;
}
}
}
</style>

<div>
  <h1><strong>Hi {{ $username }},</strong></h1>
    <p> You recently have requested a password reset on <a href = "https://filmchat.me" class ="site">filmchat.me</a>.
	<p> Please follow the link below to reset your password.
    <p> If you did not request this than please ignore this email.
	<p> FilmChat team.
    <p>
    <a href="{{ url('email/reset', $recover_token)}}" class="button">Reset my password</a>
    </p>
</div>

</body>
</html>
