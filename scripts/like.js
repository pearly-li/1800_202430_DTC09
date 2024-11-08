count = 1

function fillLike(){
    if (count == 1) {
        document.getElementById('like').src = "./images/f_heart.png"
        count ++;
    }
    else
        document.getElementById('like').src = "./images/heart.png"
}

like_btn = document.getElementById("likeBtn")
like_btn.addEventListener("click", () => {
    console.log(111)
    fillLike();
})