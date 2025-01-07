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

        //TODO
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
                change.value = getProperty(this.sourceTest, path)?.toString() || "0";
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


}