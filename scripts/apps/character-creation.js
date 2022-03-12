export default class CharacterCreation extends FormApplication
{
    constructor(object)
    {
        super(object)
        this.actor = object.actor;
        this.archetype = object.archetype;
        this.species = game.wng.utility.findItem(object.archetype.species.id, "species")
        this.faction = game.wng.utility.findItem(object.archetype.faction.id, "faction")
        this.speciesAbilities = this.species.abilities.map(i => game.wng.utility.findItem(i.id, "ability"))
        this.archetypeAbility = game.wng.utility.findItem(this.archetype.ability.id, "ability")
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "character-creation",
            title: "Character Creation",
            template : "systems/wrath-and-glory/template/apps/character-creation.html",
            width: 1000,
            height: 800
        })
    }

    async getData() {
        let data = super.getData();
        this.species = await this.species;
        this.faction = await this.faction;
        this.archetypeAbility = await this.archetypeAbility
        this.speciesAbilities = await Promise.all(this.speciesAbilities)

        data.actor = this.actor;
        data.archetype = this.archetype;
        data.species = this.species;
        data.faction = this.faction;
        data.archetypeAbility = this.archetypeAbility
        data.speciesAbilities = this.speciesAbilities
        console.log(data)
        return data
    }

    
    async _updateObject(event, formData) {
        this.object.update(formData)
    }


    activateListeners(html)
    {
        super.activateListeners(html);


    }
}