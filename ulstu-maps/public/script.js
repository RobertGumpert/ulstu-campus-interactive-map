var SVG;
const campusSelectorID = "radio";

window.onload = function () {
    SVG = new SVGLoader();
    SVG.addMatchesSelectorWithSVG(campusSelectorID);
    document.querySelectorAll(".choose-campus").forEach(function (radio) {
        if (radio.id === [campusSelectorID, "-campus-1"].join("")) {
            SVG.showSvgBySelector(radio.id);
            radio.checked = true;
        }
        radio.addEventListener("change", function () {
            selectCampus(radio.id)
        })
    });
};


function selectCampus(selectorId) {
    SVG.showSvgBySelector(selectorId);
}

