const API_KEY = `b990a62c995341538b0f3456791a1bfc`;
let newsList = [];
let searchButton = document.getElementById("searchButton");
let input = document.getElementById("input");
let parent = document.querySelector("parent");
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)))
let url = new URL(
    // `https://mynewtimes.netlify.app//top-headlines?country=kr&apiKey=${API_KEY}`
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
    )
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

// api 가져오기
const getLatesNews = async () => {
    url = new URL (
        // `https://mynewtimes.netlify.app//top-headlines?country=kr&apiKey=${API_KEY}`
        `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
        )
        getNews();
    }
    
// 기사 가져오는 함수
const getNews = async () => {
    try {
        url.searchParams.set("page",page);
        url.searchParams.set("pageSize",pageSize);

        const response = await fetch(url);
        const data = await response.json();
        console.log("ddd", data)

        if (response.status === 200) {
            if (data.articles.length === 0) {
                throw new Error("No result for this search");
            }
            newsList = data.articles;
            totalResults = data.totalResults;
            render();
            pagiNationRender();
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
    url = new URL(
        // `https://mynewtimes.netlify.app//top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
        `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
    );
    getNews();
}

// 키워드 검색으로 기사 가져오기
const getNewsByKeyword = async () => {
    const keyword = document.getElementById("input").value;
    console.log("keyword", keyword);
    url = new URL(
        // `https://mynewtimes.netlify.app//top-headlines?q=${keyword}&apiKey=${API_KEY}`
        `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
        );
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


// 페이지네이션
const pagiNationRender = () => {
    // totalPages
    const totalPages = Math.ceil(totalResults / pageSize);
    // pageGroup
    const pageGroup = Math.ceil(page / groupSize);
    // lastPage
    let lastPage = pageGroup * groupSize;
    if(lastPage > totalPages) {
        lastPage = totalPages;
    }
    // firstPage
    const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

    let paginationHTML = ``

    // 이전 버튼 추가
    paginationHTML += `<li class="page-item preToPage">
        <a class="page-link" aria-label="Previous">
            <span aria-hidden="true">«</span>
        </a>
    </li>`;
    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML +=
            `<li class="page-item ${i === page ? "active" : ""}" onclick="moveToPage(${i})">
                <a class="page-link">${i}</a>
            </li>`;
    }
    // 다음 버튼 추가
    paginationHTML += `<li class="page-item nextToPage">
        <a class="page-link" aria-label="Next">
            <span aria-hidden="true">»</span>
        </a>
    </li>`;
    document.querySelector(".pagination2").innerHTML = paginationHTML;

    document.querySelector(".preToPage").addEventListener("click", preToPage);
    document.querySelector(".nextToPage").addEventListener("click", nextToPage);

}
// 1페이지, 2페이지.. 한 페이지씩 넘기기
const moveToPage = (pageNum) => {
    console.log("moveToPage",pageNum);
    page = pageNum;
    getNews();
}
// 이전 페이지, 다음 페이지
const preToPage =  () => {
    if (page > 1) {
        page --;
        getNews();
    }
}
const nextToPage = () => {
    const totalPages = Math.ceil(totalResults / pageSize);
    if (page < totalPages) {
        page ++;
        getNews();
    }
}
getLatesNews();
