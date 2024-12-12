import { PhysicalItemModel } from "./physical";
let fields = foundry.data.fields;

export class EquippedItemModel extends PhysicalItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.equipped = new fields.BooleanField({});
        return schema;
    }
    
    get isEquipped()
    {
        return this.equipped;
    }

    get equippable() 
    {
        return true;
    }

    shouldTransferEffect(effect)
    {
        return super.shouldTransferEffect(effect) && (!effect.system.transferData.equipTransfer || this.isEquipped)
    }
}