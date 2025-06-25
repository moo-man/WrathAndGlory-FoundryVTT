import { DamageRoll } from "../../common/tests/damage";

export class WrathAndGloryDamageMessageModel extends WarhammerMessageModel
{
    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = {};
        schema.context = new fields.ObjectField();
        schema.damageData = new fields.ObjectField();
        schema.rerollData = new fields.ObjectField();
        schema.result = new fields.ObjectField();
        return schema;
    }

    get damage() 
    {
        return new DamageRoll(this.toJSON())
    }

    onRender(html)
    {
        // Remove damage breakdown if user shouldn't see details
        Array.from(html.querySelectorAll(".report")).forEach(element => {
            let actor = fromUuidSync(element.dataset?.uuid);
            if (actor && !actor.isOwner)
            {
                element.dataset.tooltip = "";
            }
        })
    }

    static get actions() 
    { 
        return foundry.utils.mergeObject(super.actions, {
            applyDamage : this._onApplyDamage,
            toggleDie : this._onToggleDie
        });
    }

    static _onApplyDamage(ev, target)
    {
        this.damage.applyToTargets();
    }

    static _onToggleDie(ev, target)
    {
        let message = this.parent;
        if (message.isAuthor || message.isOwner)
          target.classList.toggle("selected")
    }
}