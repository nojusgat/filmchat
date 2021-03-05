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
    <p>Thank you for creating an account on <a href = "https://filmchat.me" class ="site">filmchat.me</a>. Don't forget to complete your registration!
    <p>Please click on the link below to confirm your email address:
    <p>This link will verify your email address and then you will officially be a part of the FilmChat community.
	<p>
    <a href="{{ url('email/verify', $verification_code)}}" class = "button">Confirm my email address </a>
    <br/>
</div>

</body>
</html>
