const API_KEY = `b990a62c995341538b0f3456791a1bfc`
let news = []

const getLatesNews = async () => {
    const url = new URL (
        `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
    )
    const response = await fetch(url)
    const data = await response.json()
    news = data.articles
    console.log("ddd", news)
}
getLatesNews()