
let mass = JSON.parse(localStorage.getItem("mass"))||[]   // массив хранимый
let likes = document.querySelector('.likes')              // "Избранное"
let likei = document.querySelectorAll('.likei')
let theme = JSON.parse(localStorage.getItem("theme"))||[] // тема хранимая
let html = document.getElementsByTagName("html")[0]       // весь документ

colorTheme()


// цветовая тема
async function colorTheme() {
    if (theme.length === 0) {
        theme.push('dark')
        localStorage.setItem('theme', JSON.stringify(theme))
        html.classList.add("dark")
    } else {
        if (theme[0] === 'dark') {
            html.classList.add("dark")
        } else {
            html.classList.add("light")
        }
    }
}


// Избранное
for (let i=0; i<mass.length; i++) {
    let like=mass[i]

    let like1 = document.createElement("div")
    like1.classList.toggle('like1')
    like1.classList.toggle('ramka')
    like1.innerHTML=''
    likes.appendChild(like1)

    let likei = document.createElement("div")
    likei.classList.toggle('likei')
    likei.innerHTML=''
    like1.appendChild(likei)
    seek(like["Title"],i)
}

// родительская функция поиска
async function seek(vv,i) {
    try {
        const data = await sendRequest(vv)
        renderInfo(data,i)
        console.log("Результат поиска: ", data)
        return data
    }
    catch(err){
        // clean()
        throw err
    }
}

// функция поиска на OMDB API (80437e5b)
async function sendRequest(vv) {
    url = `https://www.omdbapi.com/?apikey=80437e5b&t=${vv}`
    let response = await fetch(url)
    response = await response.json()
    return response
}

// показ результата на экране
function renderInfo(data,i) {

    if (!data.Error) {

        img = document.createElement("IMG")
        let p = data["Poster"]              // длииинный url-адрес постера
        img.src = `${p}`
        img.alt = 'Здесь должен быть постер, но его нет :('

        let likeii = document.querySelectorAll('.likei')[i]
        likeii.appendChild(img)
    }

    // описание фильма
    for (let key in data) {
        if (key=='Title'||key=='Year'||key=='Released'||key=='Runtime'||
            key=='Genre'||key=='Writer'||key=='Plot'||key=='Language'||
            key=='Country'||key=='Response'||key=='Error') {
                
            div = document.createElement("div")
            div.classList.toggle('info')
            div.innerHTML += `<b>${key}:</b> ${data[key]} <br>`
            let like1 = document.querySelectorAll('.like1')[i]
            like1.appendChild(div)
        }
        // объект в объекте?
    }
}