let skills = ["awareness",
        "cunning",
        "deception",
        "insight",
        "persuasion",
        "psychicMastery",
        "stealth",
        "weaponSkill"
    ].map(i => {
            return {id : i, name : systemConfig().skills[i], img : this.effect.img}
        });
        let choice = await ItemDialog.create(skills, 1, {title : this.effect.name, text : "Select Skill"})
    if (choice[0])
    {
        this.effect.updateSource({name : `${this.item.name} [${choice[0].name}]`, "flags.wrath-and-glory.skill" : choice[0].id});
    }