const API_KEY = `b990a62c995341538b0f3456791a1bfc`;
let newsList = [];
let searchButton = document.getElementById("searchButton");
let input = document.getElementById("input");
let parent = document.querySelector("parent");
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)))
let url = new URL(`https://mynewtimes.netlify.app//top-headlines?country=kr&apiKey=${API_KEY}`)

// api 가져오기
const getLatesNews = async () => {
    url = new URL (
        `https://mynewtimes.netlify.app//top-headlines?country=kr&apiKey=${API_KEY}`
        // `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
    )
    getNews();
}

// 기사 가져오는 함수
const getNews = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.status === 200) {
            if (data.articles.length === 0) {
                throw new Error("No result for this search");
            }
            newsList = data.articles;
            render();
        } else {
            throw new Error(data.message);
        }
        
    } catch(error) {
        errorRender(error.message);
    }
}

// 카테고리별 기사 가져오기
const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
    getNews();
}

// 키워드 검색으로 기사 가져오기
const getNewsByKeyword = async () => {
    const keyword = document.getElementById("input").value;
    console.log("keyword", keyword);
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`);
    getNews();
}

// 이미지 유효성 검사
// const imageError = (imageUrl) => {
//     // 새로운 'Image' 객체를 생성 -> js에서 이미지를 다룰 때 사용되는 내장 객체, 이미지를 동적 생성함.
//     const image = new Image();
//     image.src = imageUrl
//     if(!image.complete) {
//         return false
//     } else {
//         return true
//     }
// }

const render = () => {
    const newsHTML = newsList.map(
        (news) => 
        `<div class="row news">
            <div class="col-lg-4">
                <img class="newsImgSize" src="${news.urlToImage ? news.urlToImage : 'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg'}">
            </div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p>${news.description ? news.description.slice(0,200) + '...' : '내용없음'}</p>
                <div>
                    ${news.source.name ? news.source.name : 'no source'} ${moment(news.publishedAt).fromNow()}
                </div>
            </div>
        </div>`).join('');
        console.log("html", newsHTML)

    document.getElementById("newsBoard").innerHTML = newsHTML;
}
getLatesNews()

// 에러 메시지
const errorRender = (errorMessage)  => {
    const errorHTML = `<div class="alert alert-secondary" role="alert">
        ${errorMessage}
    </div>`;

    document.getElementById("newsBoard").innerHTML = errorHTML;
}

// 검색창
searchButton.addEventListener("click", () => {
    input.classList.toggle("active");
    input.focus();
})

// 햄버거바
function openNav() {
    document.getElementById("mySideNav").style.width = "250px";
}
function closeNav() {
    document.getElementById("mySideNav").style.width = "0";
}
