

class SVGDomStruct {
    objectID;
    objectElement;
    idSvgDocument;
    classNameSvgElement;
    listIdSvgElements;
}


class SVGLoader {

    // private
    //
    // Храним DOM структуру, контейнера SVG файлов.
    //
    // <div />
    #mapsContainer;

    // private
    //
    // Храним по ключу ID элемента object, по значению DOM структуру object.
    //
    // Map -> { "objectID" : <object />}
    #objectAndSVG;

    // private
    //
    // Храним привязку элемента управления (radio, button и т.д.),
    // загружающего SVG и сам SVG.
    // По ключу ID элемента управления, по значению DOM структуру object.
    //
    // Map -> { "selectorID" : <object />}
    #domSelectorAndSVG;

    constructor() {
        this.#mapsContainer = document.getElementsByClassName(ClassNameSvgContainer);
        this.#objectAndSVG = new Map();
        this.#domSelectorAndSVG = new Map();
        this.#findAllSvgObjects();
    }

    // Вешаем события на элементы DOM дерева SVG
    //
    #findAllSvgObjects() {
        for (let map = 0; map < this.#mapsContainer.length; map++) {
            let objectID = this.#mapsContainer.item(map).children[0].id;
            let objectElement = document.getElementById(objectID);
            this.#objectAndSVG.set(objectID, SVGLoader.createSvgDomStruct(
                objectID,
                objectElement,
                null,
                null
            ));
            this.#addEventOnSvgElements(objectElement, objectID);
        }
    };

    #addEventOnSvgElements(objectElement, objectID) {
        objectElement.addEventListener("load", () => {
            let idSvgDocument = objectElement.contentDocument.children[0].id;
            let listIdSvgElements = [];
            let svgDom = objectElement.contentDocument.getElementsByClassName(ClassNameSvgElement);
            for (let areaIndex = 0; areaIndex < svgDom.length; areaIndex++) {
                let mapAreaElement = svgDom.item(areaIndex);
                listIdSvgElements.push(mapAreaElement.id);
                mapAreaElement.addEventListener("mousedown", () => {
                    mapAreaElement.style.fill = "#ffe615";
                    let json = JSON.parse(SVGLoader.getAboutMapArea(idSvgDocument, mapAreaElement.id));
                    SVGLoader.addAreaDescription(json);
                });
                mapAreaElement.addEventListener("mouseup", () => {
                    mapAreaElement.style.fill = "#ffffff";
                    SVGLoader.clearAreaDescription();
                });
            }
            let svgDomStruct = this.#objectAndSVG.get(objectID);
            svgDomStruct.idSvgDocument = idSvgDocument;
            svgDomStruct.listIdSvgElements = listIdSvgElements;
            this.#objectAndSVG.set(objectID, svgDomStruct);
        });
    }



    // Выполнить связывание элементов управления,
    // с object'ами содержащий SVG.
    //
    addMatchesSelectorWithSVG(firstWordSelectorID) {
        for (const [key, value] of this.#objectAndSVG) {
            let identifier = key.replace("object", "");
            let partsOfName = [firstWordSelectorID, identifier];
            let selectorDomID = partsOfName.join("");
            this.#domSelectorAndSVG.set(selectorDomID, value);
        }
    }

    showSvgBySelector(selectorId) {
        for (const [key, value] of this.#domSelectorAndSVG) {
            console.log(value);
            let mapContainer = value.objectElement.parentNode;
            if (key === selectorId) {
                mapContainer.style.display = "block";
            } else {
                mapContainer.style.display = "none";
            }
        }
    }

    static createSvgDomStruct(objectID,
                              objectElement,
                              iDSvgDocument,
                              listIdSvgElements) {
        let svgDomStruct = new SVGDomStruct();
        svgDomStruct.idSvgDocument = iDSvgDocument;
        svgDomStruct.objectID = objectID;
        svgDomStruct.objectElement = objectElement;
        svgDomStruct.classNameSvgElement = ClassNameSvgElement;
        svgDomStruct.listIdSvgElements = listIdSvgElements;
        return svgDomStruct
    }

    static getAboutMapArea(mapId, areaId) {
        const url = "http://localhost:8080/get/area/" + mapId + "/" + areaId;
        let request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.send();
        // if (request.status !== 200) {
        //
        // } else {
        //
        // }
        return request.response;
    }

    static addAreaDescription(json) {
        ListElementIDinAboutAreaBlock.forEach(
            elementId =>
                Object.keys(json).forEach(function (key, index) {
                    console.log(elementId);
                    if (elementId.includes(key)) {
                        document.getElementById(elementId).value = json[key];
                    }
                })
        );
    }

    static clearAreaDescription() {
        ListElementIDinAboutAreaBlock.forEach(
            elementId =>
                document.getElementById(elementId).value = ""
        );
    }
}
