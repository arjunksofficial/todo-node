function login() {
    document.getElementById("usernamecheck").innerHTML="";
    document.getElementById("passwordcheck").innerHTML="";

    var username = document.forms.login.username.value;
    var password = document.forms.login.password.value;

    if (username !== ""){
        if (password !== ""){

            var postobj = {};
            postobj.username=username;
            postobj.password=password;
            var data=JSON.stringify(postobj);

            getToken(data,function(){
                window.open("http://localhost:8000/webpagessecure/index.html","_self");
            });
        } else {
            document.getElementById("passwordcheck").innerHTML="Enter a valid password";
        }
    } else {
        document.getElementById("usernamecheck").innerHTML="Enter a valid username";

    }

}


function getToken(data,callback) {
    document.getElementById("passwordcheck").innerHTML = "";
    let token = {};
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {

            token = JSON.parse(this.responseText);
            localStorage.setItem("key",token.token);
            document.getElementById("loginsuccess").innerHTML = "Login Success.";
            setTimeout(() => {
                callback();
            },2000);
        } else if (this.readyState == 4 && this.status == 401){
            document.getElementById("passwordcheck").innerHTML = "Username or password is incorrect";
        }
    };

    req.open("POST","http://localhost:9000/signin",true);
    req.setRequestHeader('Content-Type','application/json');
    req.send(data);
}


function logout() {
    deleteToken(function(){
        window.open("http://localhost:8000","_self");
    });
}

function deleteToken(callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            localStorage.removeItem("key");
            callback();
        }
    };

    req.open("GET","http://localhost:9000/signout",true);
    req.send();
}