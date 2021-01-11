
const CHARACTER_NAME_SEPARATOR = ",#|#,"
const CHARACTER_NAMES_FIELD = "_characters"
const CHARACTER_NAME_PREFIX = "char:"

function savedCharacterNames() {
    let characterNames = [];
    if (window.localStorage.getItem(CHARACTER_NAMES_FIELD)) {
        characterNames = window.localStorage.getItem(CHARACTER_NAMES_FIELD).split(CHARACTER_NAME_SEPARATOR);
    }
    return characterNames;
}

function characterToJson() {
    const attacks = [];
    [...document.getElementById("attack-list").children].forEach((element, i) => {
        const index = i + 1
        attacks.push({
            name: getValue("attack-name-" + index),
            bonus: getValue("attack-bonus-" + index),
            damage: getValue("attack-damage-" + index),
        });
    });

    let characterData = {
        name:       getValue("char-name"),
        race:       getValue("char-race"),
        class:      getValue("char-class"),
        level:      getValue("char-level"),
        exp:        getValue("char-exp"),
        background: getValue("char-background"),

        str: getValue("attr-str"),
        dex: getValue("attr-dex"),
        con: getValue("attr-con"),
        int: getValue("attr-int"),
        wis: getValue("attr-wis"),
        cha: getValue("attr-cha"),

        proficiencyBonus: getValue("prof-bonus"),

        saveProfStr:            getValue("save-prof-str"),
        saveProfDex:            getValue("save-prof-dex"),
        saveProfCon:            getValue("save-prof-con"),
        saveProfInt:            getValue("save-prof-int"),
        saveProfWis:            getValue("save-prof-wis"),
        saveProfCha:            getValue("save-prof-cha"),
        skillProfAcrobatics:    getValue("skill-prof-acrobatics"),
        skillProfAnimalHandling:getValue("skill-prof-animal-handling"),
        skillProfArcana:        getValue("skill-prof-arcana"),
        skillProfAthletics:     getValue("skill-prof-athletics"),
        skillProfDeception:     getValue("skill-prof-deception"),
        skillProfHistory:       getValue("skill-prof-history"),
        skillProfInsight:       getValue("skill-prof-insight"),
        skillProfIntimidation:  getValue("skill-prof-intimidation"),
        skillProfInvestigation: getValue("skill-prof-investigation"),
        skillProfMedicine:      getValue("skill-prof-medicine"),
        skillProfNature:        getValue("skill-prof-nature"),
        skillProfPerception:    getValue("skill-prof-perception"),
        skillProfPerformance:   getValue("skill-prof-performance"),
        skillProfPersuation:    getValue("skill-prof-persuation"),
        skillProfReligion:      getValue("skill-prof-religion"),
        skillProfSleightOfHand: getValue("skill-prof-sleight-of-hand"),
        skillProfStealth:       getValue("skill-prof-stealth"),
        skillProfSurvival:      getValue("skill-prof-survival"),

        saveOffsetStr:            getValue("save-offset-str"),
        saveOffsetDex:            getValue("save-offset-dex"),
        saveOffsetCon:            getValue("save-offset-con"),
        saveOffsetInt:            getValue("save-offset-int"),
        saveOffsetWis:            getValue("save-offset-wis"),
        saveOffsetCha:            getValue("save-offset-cha"),
        skillOffsetAcrobatics:    getValue("skill-offset-acrobatics"),
        skillOffsetAnimalHandling:getValue("skill-offset-animal-handling"),
        skillOffsetArcana:        getValue("skill-offset-arcana"),
        skillOffsetAthletics:     getValue("skill-offset-athletics"),
        skillOffsetDeception:     getValue("skill-offset-deception"),
        skillOffsetHistory:       getValue("skill-offset-history"),
        skillOffsetInsight:       getValue("skill-offset-insight"),
        skillOffsetIntimidation:  getValue("skill-offset-intimidation"),
        skillOffsetInvestigation: getValue("skill-offset-investigation"),
        skillOffsetMedicine:      getValue("skill-offset-medicine"),
        skillOffsetNature:        getValue("skill-offset-nature"),
        skillOffsetPerception:    getValue("skill-offset-perception"),
        skillOffsetPerformance:   getValue("skill-offset-performance"),
        skillOffsetPersuation:    getValue("skill-offset-persuation"),
        skillOffsetReligion:      getValue("skill-offset-religion"),
        skillOffsetSleightOfHand: getValue("skill-offset-sleight-of-hand"),
        skillOffsetStealth:       getValue("skill-offset-stealth"),
        skillOffsetSurvival:      getValue("skill-offset-survival"),

        armourClass: getValue("armour-class"),
        initiative: getValue("initiative"),
        speed: getValue("speed"),

        hitDice: getValue("hit-dice"),
        maxHitPoints: getValue("maximum-hp"),
        currentHitPoints: getValue("current-hp"),
        deathSaveSuccesses: [getValue("death-save-succeed-1"), getValue("death-save-succeed-2"), getValue("death-save-succeed-3")],
        deathSaveFailures: [getValue("death-save-fail-1"), getValue("death-save-fail-2"), getValue("death-save-fail-3")],

        attacks: attacks,

        spells: getValue("spell-text"),
        features: getValue("feature-text"),
        proficiencies: getValue("proficiency-text"),
        equipment: getValue("equipment-text"),
    };

    return characterData;
}

function save() {
    console.log("Saving...");

    const characterName = getValue("char-name");
    if (!characterName) {
        alert("Cannot save a character without a name.\nGive the character a name.");
        return;
    }

    const existingCharacters = savedCharacterNames();
    if (existingCharacters.indexOf(characterName) > -1) {
        const currentCharacter = window.sessionStorage.getItem("currentCharacter");
        if (currentCharacter && (currentCharacter !== characterName)) {
            const validation = confirm("There already is a character with this name.\nOverwrite the character's data?");
            if (!validation) {
                return;
            }
        }
    } else {
        existingCharacters.push(characterName);
        window.localStorage.setItem(CHARACTER_NAMES_FIELD, existingCharacters.join(CHARACTER_NAME_SEPARATOR));
    }

    const characterData = characterToJson();
    window.localStorage.setItem(CHARACTER_NAME_PREFIX + characterName, JSON.stringify(characterData));
    window.sessionStorage.setItem("currentCharacter", characterName);
    console.log("Saved.");
}

function showSavedCharacters() {
    const modal = document.getElementById("modal-load-character");

    const listElement = document.getElementById("saved-characters");
    while (listElement.firstChild) {
        listElement.removeChild(listElement.lastChild);
    }

    const savedCharacters = savedCharacterNames();
    savedCharacters.forEach(name => {
        const listItem = document.createElement("li");

        const charName = document.createElement("h1");
        charName.textContent = name;
        listItem.appendChild(charName);

        // TODO: Get character data
        // TODO: Add race/class/background/level info
        
        const loadButton = document.createElement("button");
        loadButton.textContent = "Load";
        listItem.appendChild(loadButton);
        loadButton.onclick = function() {
            modal.style.display = "none";
            load(name);
        };

        listElement.appendChild(listItem);
    });

    if (savedCharacters.length === 0) {
        const emptyMessage = document.createElement("h1");
        emptyMessage.textContent = "Could not found any saved characters.\nWhy not make some?";
        listElement.appendChild(emptyMessage);

    }

    modal.style.display = "block";
}

function load(characterName) {
    console.log("Loading...");

    const dataString = localStorage.getItem(CHARACTER_NAME_PREFIX + characterName);
    if (!dataString) {
        console.log("Could not find data for '" + characterName + "'.");
        return;
    }
    const data = JSON.parse(dataString);

    setValue("char-name", data.name);
    setValue("char-race", data.race);
    setValue("char-class", data.class);
    setValue("char-level", data.level);
    setValue("char-exp", data.exp);
    setValue("char-background", data.background);

    setValue("attr-str", data.str);
    setValue("attr-dex", data.dex);
    setValue("attr-con", data.con);
    setValue("attr-int", data.int);
    setValue("attr-wis", data.wis);
    setValue("attr-cha", data.cha);

    setValue("prof-bonus", data.proficiencyBonus);

    setValue("save-prof-str", data.saveProfStr);
    setValue("save-prof-dex", data.saveProfDex);
    setValue("save-prof-con", data.saveProfCon);
    setValue("save-prof-int", data.saveProfInt);
    setValue("save-prof-wis", data.saveProfWis);
    setValue("save-prof-cha", data.saveProfCha);

    setValue("skill-prof-acrobatics", data.skillProfAcrobatics);
    setValue("skill-prof-animal-handling", data.skillProfAnimalHandling);
    setValue("skill-prof-arcana", data.skillProfArcana);
    setValue("skill-prof-athletics", data.skillProfAthletics);
    setValue("skill-prof-deception", data.skillProfDeception);
    setValue("skill-prof-history", data.skillProfHistory);
    setValue("skill-prof-insight", data.skillProfInsight);
    setValue("skill-prof-intimidation", data.skillProfIntimidation);
    setValue("skill-prof-investigation", data.skillProfInvestigation);
    setValue("skill-prof-medicine", data.skillProfMedicine);
    setValue("skill-prof-nature", data.skillProfNature);
    setValue("skill-prof-perception", data.skillProfPerception);
    setValue("skill-prof-performance", data.skillProfPerformance);
    setValue("skill-prof-persuation", data.skillProfPersuation);
    setValue("skill-prof-religion", data.skillProfReligion);
    setValue("skill-prof-sleight-of-hand", data.skillProfSleightOfHand);
    setValue("skill-prof-stealth", data.skillProfStealth);
    setValue("skill-prof-survival", data.skillProfSurvival);

    setValue("save-offset-str", data.saveOffsetStr);
    setValue("save-offset-dex", data.saveOffsetDex);
    setValue("save-offset-con", data.saveOffsetCon);
    setValue("save-offset-int", data.saveOffsetInt);
    setValue("save-offset-wis", data.saveOffsetWis);
    setValue("save-offset-cha", data.saveOffsetCha);
    setValue("skill-offset-acrobatics", data.skillOffsetAcrobatics);
    setValue("skill-offset-animal-handling", data.skillOffsetAnimalHandling);
    setValue("skill-offset-arcana", data.skillOffsetArcana);
    setValue("skill-offset-athletics", data.skillOffsetAthletics);
    setValue("skill-offset-deception", data.skillOffsetDeception);
    setValue("skill-offset-history", data.skillOffsetHistory);
    setValue("skill-offset-insight", data.skillOffsetInsight);
    setValue("skill-offset-intimidation", data.skillOffsetIntimidation);
    setValue("skill-offset-investigation", data.skillOffsetInvestigation);
    setValue("skill-offset-medicine", data.skillOffsetMedicine);
    setValue("skill-offset-nature", data.skillOffsetNature);
    setValue("skill-offset-perception", data.skillOffsetPerception);
    setValue("skill-offset-performance", data.skillOffsetPerformance);
    setValue("skill-offset-persuation", data.skillOffsetPersuation);
    setValue("skill-offset-religion", data.skillOffsetReligion);
    setValue("skill-offset-sleight-of-hand", data.skillOffsetSleightOfHand);
    setValue("skill-offset-stealth", data.skillOffsetStealth);
    setValue("skill-offset-survival", data.skillOffsetSurvival);

    setValue("armour-class", data.armourClass);
    setValue("initiative", data.initiative);
    setValue("speed", data.speed);

    setValue("hit-dice", data.hitDice);
    setValue("maximum-hp", data.maxHitPoints);
    setValue("current-hp", data.currentHitPoints);

    setValue("death-save-succeed-1", data.deathSaveSuccesses[0]);
    setValue("death-save-succeed-2", data.deathSaveSuccesses[1]);
    setValue("death-save-succeed-3", data.deathSaveSuccesses[2]);
    setValue("death-save-fail-1", data.deathSaveFailures[0]);
    setValue("death-save-fail-2", data.deathSaveFailures[1]);
    setValue("death-save-fail-3", data.deathSaveFailures[2]);

    const attackList = document.getElementById("attack-list");
    while (attackList.firstChild) {
        attackList.removeChild(attackList.lastChild);
    }
    data.attacks.forEach((attack, i) => {
        const index = i + 1;
        const listItem = document.createElement("li");
        const attackName = document.createElement("input");
        attackName.type = "text";
        attackName.name = "attack-name-" + index;
        attackName.id = "attack-name-" + index;
        attackName.placeholder = "Name";
        attackName.classList.add("attack-name");
        attackName.value = attack.name;
        listItem.appendChild(attackName);

        const attackBonus = document.createElement("input");
        attackBonus.type = "number";
        attackBonus.name = "attack-bonus-" + index;
        attackBonus.id = "attack-bonus-" + index;
        attackBonus.placeholder = "Bonus";
        attackBonus.classList.add("attack-bonus");
        attackBonus.value = attack.bonus;
        listItem.appendChild(attackBonus);

        const attackDamage = document.createElement("input");
        attackDamage.type = "text";
        attackDamage.name = "attack-damage-" + index;
        attackDamage.id = "attack-damage-" + index;
        attackDamage.placeholder = "Damage";
        attackDamage.classList.add("attack-damage");
        attackDamage.value = attack.damage;
        listItem.appendChild(attackDamage);

        attackList.appendChild(listItem);
    });

    setValue("spell-text", data.spells);
    setValue("feature-text", data.features);
    setValue("proficiency-text", data.proficiencies);
    setValue("equipment-text", data.equipment);

    window.sessionStorage.setItem("currentCharacter", characterName);
    console.log("Loaded.");

    for (const id in listeners) {
        broadcast(id);
    }
}

function exportJson() {
    console.log("Exporting JSON...");
    const characterData = characterToJson();
    console.log(JSON.stringify(characterData));
    console.log("JSON Exported.");
}

function clear() {
    const confirmation = confirm("Creating a new character resets all the attributes back to their initial values.\nAre you sure you want to do that?");
    if (!confirmation) return;

    [...document.getElementsByTagName("input")].forEach(element => {
        if (element.type === "number") {
            element.value = element.defaultValue;
        } else if (element.type == "checkbox") {
            element.checked = false;
        } else if (element.type === "text") {
            element.value = "";
        } else {
            console.log(element.type);
        }
    });
    [...document.getElementsByTagName("textarea")].forEach(element => {
        element.value = "";
    });

    for (const id in listeners) {
        broadcast(id);
    }    

    window.sessionStorage.removeItem("currentCharacter");
}
