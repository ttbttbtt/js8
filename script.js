
let vvod = document.querySelector('.vvod')                // ввод названия фильма
let btn = document.getElementById('btn')                  // кнопка "Найти"
let poster = document.querySelector('.poster')            // обёртка постеров
let imgOld = document.getElementsByTagName('img')         // предыдущие постеры
let info = document.getElementsByClassName('info')[0]     // вывод результата
let buttonOld = document.getElementsByTagName('button')   // предыдущие кнопки "В Избранное"
let mass = JSON.parse(localStorage.getItem("mass"))||[]   // массив хранимый
let filmInfo = document.querySelector('.filmInfo')        // карточка фильма

let toggle = document.getElementById('toggle')            // кнопка "Сменить цветовую тему"
let theme = JSON.parse(localStorage.getItem("theme"))||[] // тема хранимая
let html = document.getElementsByTagName("html")[0]       // весь документ

colorTheme()


// слушатель события click на кнопку "Сменить цветовую тему"
toggle.addEventListener('click', function() {
    if (theme.length === 0) {
        theme.push('dark')
        localStorage.setItem('theme', JSON.stringify(theme))
        html.classList.add("dark")
    } else {
        if (theme[0] === 'dark') {
            theme.pop('dark')
            theme.push('light')
            localStorage.setItem('theme', JSON.stringify(theme))
            html.classList.remove("dark")
            html.classList.add("light")
        } else {
            theme.pop('light')
            theme.push('dark')
            localStorage.setItem('theme', JSON.stringify(theme))
            html.classList.remove("light")
            html.classList.add("dark")
        }
    }
}
)


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


// очищение предыдущего описания, удаление: предыдущих постеров, кнопок "В Избранное"
function clean() {
    filmInfo.classList.remove('ramka')
    info.innerHTML = ''

    for (let elem of imgOld) { elem.remove(); }
    for (let elem of buttonOld) { elem.remove(); }
}


// слушатель события click на кнопку "Найти"
btn.addEventListener('click', function() {
    if (vvod.value) {
        console.log("Введено название фильма: ", vvod.value)
        seek(vvod.value)
    }
    else {
        clean()
        console.log("НЕ Введено название фильма!")
        info.innerHTML = "НЕ Введено название фильма!"
    }
})


// показ результата на экране
function renderInfo(data) {
    clean()

    // описание фильма
    for (let key in data) {
        if (key=='Title'||key=='Year'||key=='Released'||key=='Runtime'||
            key=='Genre'||key=='Writer'||key=='Plot'||key=='Language'||
            key=='Country'||key=='Response'||key=='Error') {
            info.innerHTML += `<b>${key}:</b> ${data[key]}<br>`
        }
        // объект в объекте?
    }

    // картинка и кнопка "В Избранное", если есть инфа
    if (!data.Error) {
    
        img = document.createElement("IMG")
        let p = data["Poster"]              // длииинный url-адрес постера
        img.src = `${p}`
        img.alt = 'Здесь должен быть постер, но его нет :('
        poster.appendChild(img)

        like = document.createElement("button")
        like.type="button"
        like.class="butt"
        like.innerHTML="Добавить в Избранное"
        poster.appendChild(like)

        let pr0 = mass.find(function (item) {
            return item.Title === data.Title
            }
        )
        if (pr0) {
            like.innerHTML="Добавлено в Избранное"
            like.classList.toggle('disabled')
        }

        filmInfo.classList.toggle('ramka')

        // like.onclick = massAdd(data)
        like.onclick=function (e) {
            console.log(`Фаза: ${e.eventPhase}`)
            console.log(`Элемент, для которого запущен обработчик: <${e.currentTarget.tagName.toLowerCase()}>`)
            console.log(`Элемент, который инициировал событие click: <${e.target.tagName.toLowerCase()}>`)
            event.target.classList.toggle('active')
            massAdd(data)
            event.target.classList.toggle('disabled')
        }
    }
}


function findI(datai) {
    mass.find(function (item) {
        return item.Title === datai.Title
    })
}


// добавление в массив "Избранного"
function massAdd(dataa) {
    let pr = mass.find(function (item) {
            return item.Title === dataa.Title
        }
    )
        
    // let pr = findI(dataa)
    if (!pr){
        let mas = {
            Title: dataa.Title
        }
        mass.push(mas)
        console.log(mass)
        localStorage.setItem('mass', JSON.stringify(mass))
    }
}


// родительская функция поиска
async function seek(vv) {
    try {
        const data = await sendRequest(vv)
        renderInfo(data)
        console.log("Результат поиска: ", data)
        return data
    }
    catch(err){
        clean()
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