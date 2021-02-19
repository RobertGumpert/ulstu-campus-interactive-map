

class SVGDomStruct {
    
    // Храним ID элемента <object />
    // 
    // <object id =... />
    objectID;

    // Храним DOM структуру <object />
    // 
    // <object />
    objectElement;

    // Храним ID элемента <svg />
    // 
    // <svg id =... />
    idSvgDocument;

    // Храним Имя Класса элементов
    // в дереве svg отображающие кабинеты, кампусы и т.д.
    // 
    // <ellipse class=... />
    classNameSvgElement;

    // Храним ID элементов, в виде массива, которые
    // в дереве svg отображают кабинеты, кампусы и т.д.
    //
    // <ellipse class=... id =... />
    listIdSvgElements;
}


class SVGLoader {

    // private
    //
    // Храним DOM структуру, контейнера SVG файлов.
    //
    // <div />
    #campusDivContainer;

    // private
    //
    // Храним по ключу ID элемента Object SVGDomStruct, по значению DOM структуру <object />.
    //
    // Map -> { "objectID" : Object SVGDomStruct}
    #structAndSVG;

    // private
    //
    // Храним привязку элемента управления (radio, button и т.д.),
    // загружающего SVG и сам SVG.
    // По ключу ID элемента управления, по значению DOM структуру Object SVGDomStruct.
    //
    // Map -> { "selectorID" : Object SVGDomStruct}
    #selectorAndSVG;

    constructor() {
        this.#campusDivContainer = document.getElementsByClassName(ClassNameSvgContainer);
        this.#structAndSVG = new Map();
        this.#selectorAndSVG = new Map();
        this.#findAllSvgObjects();
    }

    // Находим все элементы <object /> одержащие элементы <svg />
    //
    #findAllSvgObjects() {
        for (let map = 0; map < this.#campusDivContainer.length; map++) {
            let objectID = this.#campusDivContainer.item(map).children[0].id;
            let objectElement = document.getElementById(objectID);
            this.#structAndSVG.set(objectID, SVGLoader.createSvgDomStruct(
                objectID,
                objectElement,
                null,
                null
            ));
            this.#addEventOnSvgElements(objectElement, objectID);
        }
    };


    // Вешаем события на элементы SVG, которые показывают кабинеты, каспусы и т.д.
    //
    #addEventOnSvgElements(objectElement, objectID) {
        objectElement.addEventListener("load", () => {
            let idSvgDocument = objectElement.contentDocument.children[0].id;
            let listIdSvgElements = [];
            let svgDom = objectElement.contentDocument.getElementsByClassName(ClassNameSvgElement);
            for (let areaIndex = 0; areaIndex < svgDom.length; areaIndex++) {

                let SVGElementShowingArea = svgDom.item(areaIndex);
                listIdSvgElements.push(SVGElementShowingArea.id);

                SVGElementShowingArea.addEventListener("mousedown", () => {
                    SVGElementShowingArea.style.fill = "#ffe615";
                    let json = JSON.parse(SVGLoader.getAboutMapArea(idSvgDocument, SVGElementShowingArea.id));
                    SVGLoader.fillAboutBlockFields(json);
                });
                SVGElementShowingArea.addEventListener("mouseup", () => {
                    SVGElementShowingArea.style.fill = "#ffffff";
                    SVGLoader.clearAboutBlockFields();
                });
            }
            let svgDomStruct = this.#structAndSVG.get(objectID);
            svgDomStruct.idSvgDocument = idSvgDocument;
            svgDomStruct.listIdSvgElements = listIdSvgElements;
            this.#structAndSVG.set(objectID, svgDomStruct);
        });
    }

    // Выполнить связывание элементов управления,
    // с object'ами содержащий SVG.
    //
    addMatchesSelectorWithSVG(firstWordSelectorID) {
        for (const [key, value] of this.#structAndSVG) {
            let identifier = key.replace("object", "");
            let partsOfName = [firstWordSelectorID, identifier];
            let selectorID = partsOfName.join("");
            this.#selectorAndSVG.set(selectorID, value);
        }
    }

    // Переключение между картами капмусов.
    //
    showSvgBySelector(selectorId) {
        for (const [selectorKey, svgDomStruct] of this.#selectorAndSVG) {
            console.log(svgDomStruct);
            let divCampusContainer = svgDomStruct.objectElement.parentNode;
            if (selectorKey === selectorId) {
                divCampusContainer.style.display = "block";
            } else {
                divCampusContainer.style.display = "none";
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

    // Заполни информацией поля блока "About"
    //
    static fillAboutBlockFields(json) {
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

    // Очисти информацией поля блока "About"
    //
    static clearAboutBlockFields() {
        ListElementIDinAboutAreaBlock.forEach(
            elementId =>
                document.getElementById(elementId).value = ""
        );
    }
}
