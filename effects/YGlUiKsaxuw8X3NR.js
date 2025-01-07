if (!this.item.specifier)
    {
        let skills = ["awareness", 
        "insight", 
        "investigation", 
        "scholar"].map(i => {
            return {id : i, name : systemConfig().skills[i], img : this.effect.img}
        }).filter(i => this.actor.system.skills[i.id].rating >= 3);

        if (skills.length == 0)
        {
            this.script.notification(`No Skills match the requirement`, "error")
            return false;
        }

        let choice = await ItemDialog.create(skills, 1, {title : this.effect.name, text : "Select Skill"})

    if (choice[0])
    {
    	this.item.updateSource({"system.test" : {type : "skill", specification : choice[0].id, dn: 3}})
        this.effect.updateSource({name : this.effect.setSpecifier(choice[0].name), "flags.wrath-and-glory.skill" : choice[0].id});
    }
}