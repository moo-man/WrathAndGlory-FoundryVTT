if (this.item.specifier == "Skill")
    {
        let skills = Object.keys(systemConfig().skills).map(i => {
            return {id : i, name : systemConfig().skills[i], img : this.effect.img}
        }).filter(i => this.actor.system.skills[i.id].rating >= 4);

        if (skills.length == 0)
        {
            this.script.notification(`No Skills match the requirement`, "error")
            return false;
        }

        let choice = await ItemDialog.create(skills, 1, {title : this.effect.name, text : "Select Skill"})

    if (choice[0])
    {
	this.item.updateSource({name : this.item.name.replace("Skill", choice[0].name)})
        this.effect.updateSource({name : `${this.item.name}`, "flags.wrath-and-glory.skill" : choice[0].id});
    }
}