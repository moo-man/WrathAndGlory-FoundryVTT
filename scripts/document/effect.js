export default class WrathAndGloryEffect extends WarhammerActiveEffect {

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
        let options = {title : {append : " - " + this.name}, context: {resist : [this.key].concat(this.sourceTest?.item?.type || []), resistingTest : this.sourceTest}};
        if (transferData.avoidTest.value == "item")
        {
            test = await this.actor.setupTestFromItem(this.item.uuid, options);
        }
        else if (transferData.avoidTest.value == "custom")
        {
            test = await this.actor.setupTestFromData(this.transferData.avoidTest, options);
        }

        await test.roll();

        if (!transferData.avoidTest.reversed)
        {
            // If the avoid test is marked as opposed, it has to win, not just succeed
            if (transferData.avoidTest.opposed && this.sourceTest)
            {
                return test.result.SL > this.sourceTest.result?.SL;
            }
            else 
            {
                return test.succeeded;
            }
        }
        else  // Reversed - Failure removes the effect
        {
            // If the avoid test is marked as opposed, it has to win, not just succeed
            if (transferData.avoidTest.opposed && this.sourceTest)
            {
                return test.result.SL < this.sourceTest.result?.SL;
            }
            else 
            {
                return !test.succeeded;
            }
        }
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