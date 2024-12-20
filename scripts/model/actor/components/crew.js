let fields = foundry.data.fields


export class VehicleCrew extends DocumentReferenceModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.type = new fields.StringField({default: ""});
        return schema;
    }
}

// List of objects that reference some embedded document on the parent
export class VehicleComplement extends DocumentReferenceListModel {
    static listSchema = VehicleCrew

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.pilot = new fields.NumberField()
        schema.crew = new fields.NumberField()
        schema.passenger = new fields.NumberField()
        schema.list = new fields.ArrayField(new fields.EmbeddedDataField(VehicleCrew));
        return schema;
    }

    add(document, type)
    {
        return this._add({uuid : document.uuid, id : document.id, name : document.name, type});
    }

    async choose(filter)
    {
        let list = this.documents.filter(i => i).filter(i => i.isOwner);
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