export default class WrathAndGloryEffect extends WarhammerActiveEffect {

        // Config object used by systems to hide properties that aren't relevant
        static CONFIGURATION = {
            zones : false,
            exclude : {},
            bracket : ["[", "]"]
        };

    async resistEffect()
    {
        let result = await super.resistEffect();
        if (result === false || result === true)
        {
            return result;
        }

        let transferData = this.system.transferData;

        let test;
        let options = {appendTitle : " - " + this.name, resist : [this.key].concat(this.sourceTest?.item?.type || []), resistingTest : this.sourceTest, fields: {}};
        if (this.sourceTest && this.sourceTest.result?.test)
        {
            transferData.avoidTest.dn = this.sourceTest.result.test.dn;
        }
        if (transferData.avoidTest.value == "item")
        {
            test = await this.actor.setupTestFromItem(this.item, options);
        }
        else if (transferData.avoidTest.value == "custom")
        {
            test = await this.actor.setupTestFromData(transferData.avoidTest, options);
        }

        if (!transferData.avoidTest.reversed)
        {
            // If the avoid test is marked as opposed, it has to win, not just succeed
            if (transferData.avoidTest.opposed && this.sourceTest)
            {
                return test.result.success > this.sourceTest.result.success;
            }
            else 
            {
                return test.result.isSuccess;
            }
        }
        else  // Reversed - Failure removes the effect
        {
            // If the avoid test is marked as opposed, it has to win, not just succeed
            if (transferData.avoidTest.opposed && this.sourceTest)
            {
                return test.result.success < this.sourceTest.result.success;
            }
            else 
            {
                return !test.result.isSuccess;
            }
        }
    }

    
    get testDisplay() {

        let avoidTestData
        if (this.system.transferData.avoidTest.value == "custom")
        {
            avoidTestData = this.system.transferData.avoidTest;
        }
        else if (this.system.transferData.avoidTest.value == "item")
        {
            avoidTestData = this.item.system.test;
        }
        else 
        {
            return ""
        }

        if (avoidTestData.type == "attribute")
            return `DN ${avoidTestData.dn} ${game.wng.config.attributes[avoidTestData.specification]} Test`
        if (avoidTestData.type == "skill")
            return `DN ${avoidTestData.dn} ${game.wng.config.skills[avoidTestData.specification]} (${game.wng.config.attributeAbbrev[game.wng.config.skillAttribute[avoidTestData.specification]]}) Test`
        if (avoidTestData.type == "resolve")
            return `DN ${avoidTestData.dn} ${game.wng.config.resolveTests[avoidTestData.specification]} Test`
        if (avoidTestData.type == "corruption")
            return `DN ${avoidTestData.dn} Corruption Test`
    }


    convertToApplied(test)
    {
        let effect = super.convertToApplied(test);

        if ((effect.system.transferData.type == "aura" || effect.system.transferData.originalType == "area") && test)
        {
            effect.system.transferData.area.radius = test.result.radius || effect.system.transferData.area.radius ;
        }

        for(let change of effect.system.changes)
        {
            if (change.value.includes?.("@test"))
            {
                change.value = foundry.utils.getProperty(test, change.value.replace("@test.", ""));
            }
        }
    

        return effect;
    }

    
    /** @override 
     * Adds support for referencing actor data
     * */
    apply(actor, change) {
        if (change.value.includes("@"))
        {
            log(`Deferring ${this.name} for ${this.parent?.name}`)
            if (change.value == "@doom" && !game.ready)
                actor.postReadyEffects.push(change)
            else
                actor.derivedEffects.push(change)
        }
        else
        {
            log(`Applying ${this.name} to ${this.parent?.name}`)
            super.apply(actor, change)
        }
    }

    fillDerivedData(actor, change) {
        try {

            if (change.value.includes("@test")) {
                let path = change.value.replace("@test.", "");
                change.value = foundry.utils.getProperty(this.sourceTest, path)?.toString() || "0";
            }
            else {


                let data = (0, eval)(Roll.replaceFormulaData(change.value, actor.getRollData()))
                //Foundry Expects to find a String for numbers
                //Raw Numbers don't work anymore
                if (typeof data === "number") {
                    change.value = data.toString();
                } else {
                    change.value = data;
                }
            }
        }
        catch (e) {
            change.value = "0";
        }

    }


    get isCondition() {
        return CONFIG.statusEffects.map(i => i.id).includes(Array.from(this.statuses)[0])
    }

    get sourceTest() 
    {
        let testData = this.system.sourceData.test.data;
        if (testData)
        {
            let message = game.messages.get(testData.context?.messageId);
            return message? message.system.test : game.wng.rollClasses[testData.class].recreate(testData);  
        }
    }

    get changeKeys()
    {
        return {choices: Object.keys(game.wng.config.attributes).map(i => {
            return {
                value: `system.attributes.${i}.bonus`,
                label: game.wng.config.attributes[i],
                group: "Attributes"
            }
        }).concat(Object.keys(game.wng.config.skills).map(i => {
            return {
                value: `system.skills.${i}.bonus`,
                label: game.wng.config.skills[i],
                group: "Skills"
            }
        })).concat([
            {value: "system.combat.defence.bonus", label: game.i18n.localize("HEADER.DEFENCE"), group: "Other"},
            {value: "system.combat.resilience.bonus", label: game.i18n.localize("HEADER.RESILIENCE"), group: "Other"},
            {value: "system.combat.wounds.bonus", label: game.i18n.localize("HEADER.WOUNDS"), group: "Other"},
            {value: "system.combat.determination.bonus", label: game.i18n.localize("HEADER.DETERMINATION"), group: "Other"},
            {value: "system.combat.shock.bonus", label: game.i18n.localize("HEADER.SHOCK"), group: "Other"},
            {value: "system.combat.resolve.bonus", label: game.i18n.localize("HEADER.RESOLVE"), group: "Other"},
            {value: "system.combat.conviction.bonus", label: game.i18n.localize("HEADER.CONVICTION"), group: "Other"},
            {value: "system.combat.passiveAwareness.bonus", label: game.i18n.localize("HEADER.PASSIVEAWARENESS"), group: "Other"},
            {value: "system.combat.resilience.bonus", label: game.i18n.localize("HEADER.RESILIENCE"), group: "Other"},
            {value: "system.combat.speed", label: game.i18n.localize("HEADER.SPEED"), group: "Other"},
            {value: "system.combat.fly", label: game.i18n.localize("HEADER.SPEED_FLY"), group: "Other"},
            {value: "system.resources.faith.total", label: game.i18n.localize("RESOURCE.FAITH"), group: "Other"},
            {value: "system.resources.influence", label: game.i18n.localize("RESOURCE.INFLUENCE"), group: "Other"},
            {value: "system.resources.wealth", label: game.i18n.localize("RESOURCE.INFLUENCE"), group: "Other"},
            {value: "system.combat.defence.bonus", label: game.i18n.localize("(Vehicle) Defence"), group: "Other"},
            {value: "system.mnvr", label: game.i18n.localize("(Vehicle) Maneuverability"), group: "Other"},
        ]), 
        groups: ['Attributes',
        'Skills',
        'Other',
        ].map(i => game.i18n.localize(i))};
    }

}