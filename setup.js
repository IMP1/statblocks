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
    document.getElementById("btn-import").onclick = showImportBox;
    document.getElementById("btn-import-json").onclick = importJson;
    document.getElementById("btn-export-copy").onclick = copyJsonToClipboard;
    document.getElementById("btn-export-close").onclick = () => document.getElementById("modal-export-character").style.display = "none";

    const modals = [...document.getElementsByClassName("modal")];
    window.addEventListener("click", event => {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });

    const categories = ["cat-1", "cat-2", "cat-3", "cat-4"];
    categories.forEach(function(id) {
        const btn = document.getElementById("show-" + id);
        btn.onclick = () => toggleCategoryButton("show-" + id);
    });

    document.getElementById("btn-category-reset").onclick = resetAllCategories;

    resetAllCategories();

    console.log("Setup Finished.");

    // TODO: Check URL for args
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    if (params.has("load")) {
        load_character(params.get("load"));
    }

}

setup();
