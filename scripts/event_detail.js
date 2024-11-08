pressLike = 1
function fillLike() {
    if (pressLike == 1) {
        document.getElementById('like').src = "./images/f_heart.png"
        pressLike--;
    }
    else {
        document.getElementById('like').src = "./images/heart.png"
        pressLike++;
    }
}

pressAttend = 1
function attendEvent() {
    if (pressAttend == 1) {
        document.getElementById('attendBtn').innerText = "Cancle"
        pressAttend--;
    }
    else {
        document.getElementById('attendBtn').innerText = "Attend"
        pressAttend++;
    }
}

like_btn = document.getElementById("likeBtn")
like_btn.addEventListener("click", () => {
    fillLike();
})

attend_btn = document.getElementById("attendBtn")
attend_btn.addEventListener("click", () => {
    attendEvent();
})