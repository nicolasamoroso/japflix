let movieFound = []
let movies = []

document.addEventListener("DOMContentLoaded", async () => {
    movies = await getJSONData('https://japceibal.github.io/japflix_api/movies-data.json')
})

document.getElementById('btnBuscar').addEventListener("click", () => {
    const movieName = document.getElementById('inputBuscar').value

    document.getElementById('lista').innerHTML = ''

    if (!movieName) return document.getElementById('busqueda').innerHTML = ""

    if (movies.status === 'ok') {
        movieFound = movies.data.filter(({title, overview, genres, tagline}) => 
            title.toLowerCase().includes(movieName.toLowerCase()) ||
            overview.toLowerCase().includes(movieName.toLowerCase()) ||
            genres.some(({name}) => name.toLowerCase().includes(movieName.toLowerCase())) ||
            tagline.toLowerCase().includes(movieName.toLowerCase())
        )

        if (movieFound && movieFound.length > 0) {
            document.getElementById('busqueda').innerHTML = `
            <div class="text-center text-light mb-2">
                <h1 class="mb-1">Resultados para la busqueda ${movieName}</h1>
                <p>Se encontraron ${movieFound.length} resultados</p>
            </div>
            `
            for (let i = 0; i < movieFound.length; i++) {
                const {title, vote_average, tagline, id} = movieFound[i]
                document.getElementById('lista').innerHTML += `
                <li class="list-group-item bg-dark" 
                    data-bs-toggle="offcanvas" 
                    data-bs-target="#offcanvasTop" 
                    aria-controls="offcanvasTop" 
                    onclick="showOffCanvas(${id})">

                    <div class="d-flex justify-content-between">
                        <h2 class="list-item__title">${title}</h2>
                        <p class="list-item__tagline list-item__release-date">${ScoreToStars(Math.round(parseInt(vote_average)/2))}</p>
                    </div>
                    <p class="list-item__tagline">${tagline}</p>
                </li>
                `
            }
        } 
        else {
            document.getElementById('busqueda').innerHTML = `
            <h1 class="text-light text-center">No se encontraron resultados para ${movie}</h1>
            `
        }
    }
    document.getElementById('inputBuscar').value = ''
})


function showOffCanvas(id) {
    const element = movieFound.find(({id: movieId}) => movieId === id)
    let {title, overview, release_date, runtime, budget, revenue, genres} = element

    document.getElementById('offcanvas').innerHTML = `
    <div class="d-flex justify-content-between">
        <h1>${title}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <p>${overview}</p>
    <hr>
    <div class="d-flex justify-content-between">
        <div id="genres" class="text-muted">
        </div>
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            More
        </button>
        <ul class="dropdown-menu">
            <li class="dropdown-item d-flex justify-content-between">
                <label>Year:</label>
                <label>${new Date(release_date).getFullYear()}</label>
            </li>
            <li class="dropdown-item d-flex justify-content-between">
                <label>Runtime:</label>
                <label>${runtime} mins</label>
            </li>
            <li class="dropdown-item d-flex justify-content-between">
                <label>Budget:</label>
                <label>$${budget}</label>
            </li>
            <li class="dropdown-item d-flex justify-content-between">
                <label>Revenue:</label>
                <label>$${revenue}</label>
            </li>
        </ul>
        </div>
    </div>
    `

    let htmlContentToAppend = ""
    for (let i = 0; i < genres.length; i++) {
        htmlContentToAppend += `<label>${genres[i].name}</label>`
        if (i < genres.length - 1) htmlContentToAppend += `<label>-</label>`
    }
    document.getElementById('genres').innerHTML = htmlContentToAppend  
}

function ScoreToStars(score) {
    let htmlContentToAppend = "";
    for (i = 1; i <= 5; i++) {
        if (i <= score) htmlContentToAppend += `<i class="fa fa-star checked"></i>`;
        else htmlContentToAppend += `<i class="fa fa-star not_checked"></i>`;
    }
    return htmlContentToAppend;
}