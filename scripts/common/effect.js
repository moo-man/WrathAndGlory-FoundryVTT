export default class WrathAndGloryEffect extends ActiveEffect {

    /** @override 
     * Adds support for referencing actor data
     * */ 
    apply(actor, change) {
    if (change.value.includes("@"))
        actor.derivedEffects.push((change))
    else 
        super.apply(actor, change)
    }

    fillDerivedData(actor, change)
    {
        change.value = eval(Roll.replaceFormulaData(change.value, actor.getRollData()))
    }

    get label() {
        return this.data.label
    }

    get description() {
        return getProperty(this.data, "flags.wrath-and-glory.description")
    }

    get hasRollEffect() {
        return this.data.changes.some(c => c.mode == 0)
    }

    get sourceName() {
        if (!this.data.origin)
            return super.sourceName

        let data = this.data.origin.split(".")

        if (data.length == 4) {
            let item = this.parent.items.get(data[3])
            if (item)
                return item.name
            else
                return super.sourceName;
        }
    }

    get isCondition() {
        return CONFIG.statusEffects.map(i => i.id).includes(this.getFlag("core", "statusId"))
    }

    static get numericTypes() {
        return [
            "pool.base",
            "pool.bonus",
            "difficulty.base",
            "difficulty.bonus",
            "damage.base",
            "damage.bonus",
            "ed.base",
            "ed.bonus",
            "ap.base",
            "ap.bonus",
            "wrath"
        ]
    }

}