const listeners = {};

function getValue(id) {
    const element = document.getElementById(id);
    if (element.type === "number") {
        if (element.value) {
            return parseInt(element.value);
        } else {
            return 0;
        }
    } else if (element.type === "checkbox") {
        return element.checked;
    } else if (element.type === "output") {
        return parseInt(element.value);
    } else if (element.type === "text") {
        return element.value;
    } else if (element.type === "textarea") {
        return element.value;
    } else {
        throw "Unexpected input type.";
        console.log(element.type);
    }
}

function setValue(id, value) {
    const element = document.getElementById(id);
    if (element.type === "number") {
        element.value = parseInt(value);
    } else if (element.type === "checkbox") {
        element.checked = value;
    } else if (element.type === "output") {
        element.value = value;
    } else if (element.type === "text") {
        element.value = value || "";
    } else if (element.type === "textarea") {
        element.value = value || "";
    } else {
        throw "Unexpected input type.";
    }
    broadcast(id);
}

function addListener(id, change) {
    if (listeners[id] === undefined) {
        document.getElementById(id).addEventListener("change", () => broadcast(id));
        listeners[id] = [];    
    }
    listeners[id].push(change);
}

function broadcast(id, ...args) {
    if (listeners[id] === undefined) {
        document.getElementById(id).addEventListener("change", () => broadcast(id));
        listeners[id] = [];    
    }
    listeners[id].forEach(listener => listener(...args));
}

const LINKS = [];

const ATTRIBUTES = ["str", "dex", "con", "int", "wis", "cha"];
const SKILLS = {
    str: ["athletics"],
    dex: ["acrobatics", "sleight-of-hand", "stealth"],
    con: [],
    int: ["arcana", "history", "investigation", "nature", "religion"],
    wis: ["animal-handling", "insight", "medicine", "perception", "survival"],
    cha: ["deception", "intimidation", "performance", "persuation"],
}

ATTRIBUTES.forEach(function(attr) {
    LINKS.push({
        out: "mod-" + attr,
        in: ["attr-" + attr],
        mapping: val => {
            const result = Math.floor((val - 10) / 2);
            return (result > 0) ? "+" + result : result; 
        },
    });
});

ATTRIBUTES.forEach(function(attr) {
    LINKS.push({
        out: "save-" + attr,
        in: ["mod-" + attr, "save-prof-" + attr, "prof-bonus", "save-offset-" + attr],
        mapping: (attr, prof, profBonus, offset) => {
            const result = attr + offset + (prof ? profBonus : 0);
            return (result > 0) ? "+" + result : result;
            
        },
    });
});

for (const attr in SKILLS) {
    SKILLS[attr].forEach(function(skill) {
        LINKS.push({
            out: "skill-" + skill,
            in: ["mod-" + attr, "skill-prof-" + skill, "prof-bonus", "skill-offset-" + skill],
            mapping: (attr, prof, profBonus, offset) => {
                const result = attr + offset + (prof ? profBonus : 0);
                return (result > 0) ? "+" + result : result;
            },
        });
    });
}

function addAttackRow() {
    const listElement = document.getElementById("attack-list");
    const nextId = listElement.children.length + 1;
    const listItem = document.createElement("li");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "attack-name-" + nextId;
    nameInput.id = "attack-name-" + nextId;
    nameInput.placeholder = "Name";
    nameInput.classList.add("attack-name");
    listItem.appendChild(nameInput);
    listItem.appendChild(document.createTextNode("\n")); // To mirror the HTML (and any gaps due to whitespace)

    const bonusInput = document.createElement("input");
    bonusInput.type = "number";
    bonusInput.bonus = "attack-bonus-" + nextId;
    bonusInput.id = "attack-bonus-" + nextId;
    bonusInput.placeholder = "Bonus";
    bonusInput.classList.add("attack-bonus");
    listItem.appendChild(bonusInput);
    listItem.appendChild(document.createTextNode("\n")); // To mirror the HTML (and any gaps due to whitespace)

    const damageInput = document.createElement("input");
    damageInput.type = "text";
    damageInput.damage = "attack-damage-" + nextId;
    damageInput.id = "attack-damage-" + nextId;
    damageInput.placeholder = "Damage";
    damageInput.classList.add("attack-damage");
    listItem.appendChild(damageInput);

    listElement.appendChild(listItem);
}

function deleteAttackRow() {
    const listElement = document.getElementById("attack-list");
    const lastListItem = listElement.lastElementChild;
    if (lastListItem) {
        listElement.removeChild(lastListItem);
    }
}

function updateCharacterListFilter() {
    const categories = ["cat-1", "cat-2", "cat-3", "cat-4"];
    const categoryCheckboxes = categories.map(c => document.getElementById("show-" + c));
    const necessaryCategories = categoryCheckboxes.filter(cb => cb.checked && !cb.indeterminate).map(cb => cb.id.substring(5));
    const forbiddenCategories = categoryCheckboxes.filter(cb => !cb.checked && !cb.indeterminate).map(cb => cb.id.substring(5));
    const listElement = document.getElementById("saved-characters");
    [...listElement.children].forEach(function(listItem) {
        listItem.style.display = "block";    
        const characterCategories = listItem.dataset.categories || [];
        if (necessaryCategories.every(c => characterCategories.includes(c)) && 
        forbiddenCategories.every(c => !characterCategories.includes(c))) {
            listItem.style.display = "block";    
        } else {
            listItem.style.display = "none";    
        }
    });
}

function toggleCategoryButton(buttonId) {
    const button = document.getElementById(buttonId)
    if (button.readOnly) 
        button.checked = button.readOnly = false;
    else if (!button.checked) 
        button.readOnly = button.indeterminate = true;
    updateCharacterListFilter();
}

function showAllCategories() {
    const categories = ["show-cat-1", "show-cat-2", "show-cat-3", "show-cat-4"];
    categories.forEach(function(id) {
        const btn = document.getElementById(id);
        btn.checked = true;
        btn.readOnly = false;
        btn.indeterminate = false;
    });
    updateCharacterListFilter();
}

function hideAllCategories() {
    const categories = ["show-cat-1", "show-cat-2", "show-cat-3", "show-cat-4"];
    categories.forEach(function(id) {
        const btn = document.getElementById(id);
        btn.checked = false;
        btn.readOnly = false;
        btn.indeterminate = false;
    });
    updateCharacterListFilter();
}

function resetAllCategories() {
    const categories = ["show-cat-1", "show-cat-2", "show-cat-3", "show-cat-4"];
    categories.forEach(function(id) {
        const btn = document.getElementById(id);
        btn.readOnly = true;
        btn.indeterminate = true;
    });
    updateCharacterListFilter();
}
