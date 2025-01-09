import { Attributes, BaseItemModel, Skills } from "./components/base";

let fields = foundry.data.fields;

export class ArchetypeModel extends BaseItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.tier = new fields.NumberField({min : 1, initial : 1})
        schema.journal = new fields.StringField({});
        schema.species = new fields.EmbeddedDataField(DeferredReferenceModel);
        schema.faction = new fields.EmbeddedDataField(DeferredReferenceModel);
        schema.influence = new fields.NumberField({initial : 0});
        schema.cost = new fields.NumberField({min : 0, initial : 0});
        schema.keywords = new fields.ArrayField(new fields.StringField());
        schema.attributes = Attributes();
        schema.skills = Skills();
        schema.ability = new fields.EmbeddedDataField(DeferredReferenceModel)
        schema.wargear = new fields.EmbeddedDataField(ChoiceModel)
        schema.suggested = new fields.SchemaField({
            attributes : Attributes(),
            skills: Skills(),
            talents : new fields.EmbeddedDataField(DeferredReferenceListModel)
        })
        return schema;
    }

    static migrateData(data)
    {
        super.migrateData(data);
        if (data.suggested.talents instanceof Array)
        {
            data.suggested.talents = {list : data.suggested.talents};
        }


        let _convertStructure = (structure, wargear) => {
            structure.type = ["or", "and"].includes(structure.type) ? structure.type : "option";
            if (!isNaN(structure.index))
            {
                structure.id = wargear[structure.index].groupId || wargear[structure.index].id || structure.groupId;
                if (wargear[structure.index])
                {
                    wargear[structure.index].groupId = structure.id;
                }
            }
            else 
            {
                structure.id = structure.groupId;
            }
            if (structure.items?.length)
            {
                structure.options = foundry.utils.deepClone(structure.items);
                delete structure.items;
                for(let opt of structure.options)
                {
                    _convertStructure(opt, wargear);
                }
            }
            
            return structure
        }

        if (data.wargear instanceof Array)
        {
            let oldWargear = foundry.utils.deepClone(data.wargear);

            data.wargear = {
                structure : _convertStructure(data.groups, oldWargear),
                
                options: oldWargear.map(w => {
                    let type = w.type;
                    if (type == "generic")
                    {
                        type = w.filters?.length ? "filter" : "placeholder";
                    }
                    return {
                        name : w.name,
                        type : type,
                        id : w.groupId || w.id,
                        diff : w.diff,
                        documentId : w.id,
                        idType : "id",
                        filters: (w.filters || []).map(i => {
                            let opMap = {
                                lt : "<",
                                le : "<=",
                                eq : "==",
                                gt : ">",
                                ge : ">="
                            }
                            if (i.property.includes("hasKeyword"))
                            {
                                return {
                                    path : "keywords",
                                    value : i.property.split("\"")[1].split("").filter(i => i != "").join(""),
                                    operation : "includes"
                                }
                            }
                            return {
                                path : i.property,
                                value : i.value,
                                operation : opMap[i.test]
                            }
                        })
                    }
            })}
        }
    }
}


class ArchetypeWargearModel extends DeferredReferenceModel 
{
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.type = new fields.StringField();
        schema.filters = new fields.ArrayField(new fields.SchemaField({
            test : new fields.StringField(),
            property : new fields.StringField(),
            value : new fields.StringField(),
        }))
        return schema;
    }
}