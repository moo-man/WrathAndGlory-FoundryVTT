let fields = foundry.data.fields

// List of objects that reference some embedded document on the parent
export class VehicleComplement extends ListModel {
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.pilot = new fields.NumberField()
        schema.crew = new fields.NumberField()
        schema.passenger = new fields.NumberField()
        schema.list = new fields.ArrayField(new fields.EmbeddedDataField(VehicleCrew));
        return schema;
    }

    async choose(filter)
    {
        let list = this.list.map(i => i.document).filter(i => i).filter(i => i.isOwner);
        if (filter)
        {
            list = list.filter(filter);
        }
        
        if (list.length == 0)
        {
            ui.notifications.error("ERROR.NoAvailableActors", {localize: true})
            return
        }

        if (list.length == 1)
        {
            return list[0];    
        }

        return (await ItemDialog.create(list, 1, {title : game.i18n.localize("DIALOG.ChooseActor")}))[0]
    }

    get activePilot() 
    {
        return this.list.find(i => i.type == "pilot")?.document;
    }
}

export class VehicleCrew extends DocumentReferenceModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.type = new fields.StringField({default: ""});
        return schema;
    }
}