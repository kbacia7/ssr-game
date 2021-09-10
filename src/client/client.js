let marker = null
setUpDragEvents()

/**
 * Dodaje element z kodu HTML do body
 * @param html Kod HTML
 */
function addElementToBody(html) {
    const t = document.createElement("template")
    t.innerHTML = html
    const el = t.content.firstChild
    const body = document.getElementsByTagName("body")[0]
    body.appendChild(el)
}

/**
 * Główny callback na drag fok. Wysyła POST do serwera gdy pozycja foki zostanie zaktualizowana.
 * @param event 
 * @returns 
 */
async function dragEvent(event) {
    const id = parseInt(event.target.id)
    if(event.clientX === 0 && event.clientY === 0) {
        return false
    }
    r = await httpRequest("/update-seal", "POST", {
        id: id,
        x: event.clientX,
        y: event.clientY
    })
    if(!r) {
        return
    }
    r = JSON.parse(r)
  
    if(event.target) {
        event.target.style = `top: ${r.y}px; left: ${r.x}px`
        const linesConnectedFrom = document.querySelectorAll(`[id^='${id}-']`)
        const linesConnectedTo = document.querySelectorAll(`[id$='-${id}']`)

        if(linesConnectedFrom) {
            for(let el of linesConnectedFrom) {
                el.setAttribute("x1", r.linesPointX)
                el.setAttribute("y1", r.linesPointY)
            }
        }
        if(linesConnectedTo) {
            for(let el of linesConnectedTo) {
                el.setAttribute("x2", r.linesPointX)
                el.setAttribute("y2", r.linesPointY)
            }
        }
    }
    if(r.intersect !== false) {
        marker.setAttribute("cx", r.intersect[0])
        marker.setAttribute("cy", r.intersect[1])
    } else {
        addElementToBody(r.completeWindow)
        document.getElementsByTagName("button")[0].addEventListener("click", loadLevel)
        marker.remove()
    }

}

/**
 * Wczytuje aktualny poziom
 */
async function loadLevel() {
    const nextLevel = await httpRequest("/load-level","GET")
    const mapContainer = document.getElementById("map-container")
    mapContainer.remove()

    addElementToBody(nextLevel)
    setUpDragEvents()
    document.getElementById("window-container").remove()
}

/**
 * Funkcja do wysyłania requestów POST/GET
 * @param  url URL
 * @param type GET/POST
 * @param data opcjonalnie dane 
 * @returns 
 */
function httpRequest(url, type, data ) {
    return new Promise((resolve, reject) => {
        const xmlHttp = new XMLHttpRequest()
        xmlHttp.open(type, url, true)
        xmlHttp.setRequestHeader("Content-Type", "application/json")
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                resolve(xmlHttp.response)
            }
        }
        xmlHttp.send(JSON.stringify(data))
    })
}

/**
 * Prosta funkcja która ustawia fokom listener na drag
 */
function setUpDragEvents() {
    for (let el of document.getElementsByClassName("seal")) {
        el.addEventListener('drag', dragEvent)
    }
    marker = document.getElementById("error-marker")
}