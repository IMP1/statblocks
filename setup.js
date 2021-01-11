function setup() {

    LINKS.forEach(function(link) {
        let updateFunc = function() {
            let args = link.in.map(id => getValue(id));
            setValue(link.out, link.mapping(...args));
        };
        link.in.forEach(id => addListener(id, updateFunc));
    });

    for (const id in listeners) {
        broadcast(id);
    }

    document.getElementById("btn-add-attack").onclick = addAttackRow;
    document.getElementById("btn-del-attack").onclick = deleteAttackRow;

    document.getElementById("btn-new").onclick = clear;
    document.getElementById("btn-save").onclick = save;
    document.getElementById("btn-load").onclick = showSavedCharacters;
    document.getElementById("btn-export").onclick = exportJson;

    const modal = document.getElementById("modal-load-character");
    window.addEventListener("click", event => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    console.log("Setup Finished.");

}

setup();
