if (this.item.specifier == "Skill")
    {
        let skills = ["awareness",
        "cunning",
        "deception",
        "insight",
        "persuasion",
        "psychicMastery",
        "stealth"].map(i => {
            return {id : i, name : systemConfig().skills[i], img : this.effect.img}
        });
        let choice = await ItemDialog.create(skills, 1, {title : this.effect.name, text : "Select Skill"})
    if (choice[0])
    {
	if (this.actor.system.skills[choice[0].id].rating < 1)
	{
		this.script.notification(`${choice[0].name} Rating not high enough.`, "error")
		return false;
	}
	
	this.item.updateSource({name : this.item.name.replace("Skill", choice[0].name), "system.test" : {type : "skill", specification : choice[0].id}})
        this.effect.updateSource({name : `${this.item.name}`});
    }
}