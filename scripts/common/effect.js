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

    getDialogChanges({target = false, condense = false, indexOffset = 0}={}) {
        let allChanges = this.data.changes.map(c => c.toObject())
        allChanges.forEach((c, i) => {
            c.conditional = this.changeConditionals[i] || {}
            c.document = this
        })
        let dialogChanges = allChanges.filter((c) => c.mode == (target ? 7 : 6)) // Targeter dialog is 7, self dialog is 6
        dialogChanges.forEach((c, i) => {
            c.target = !!target
            c.index = [i + indexOffset]
        })

        // changes with the same description as under the same condition (use the first ones' script)
        if (condense)
        {
            let uniqueChanges = []
            dialogChanges.forEach(c => {
                let existing = uniqueChanges.find(unique => unique.conditional.description == c.conditional.description)
                if (existing)
                    existing.index = existing.index.concat(c.index)
                else
                    uniqueChanges.push(c)
            })
            dialogChanges = uniqueChanges
        }

        return dialogChanges
    }

    get changeConditionals() {
        return (getProperty(this.data, "flags.wrath-and-glory.changeCondition") || {})
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