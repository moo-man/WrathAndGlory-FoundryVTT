let  god = await ValueDialog.create({text: "Select Allegiance", title: this.effect.name}, "", ["Khorne", "Nurgle", "Slaanesh", "Tzeentch"]);

this.effect.updateSource({"flags.wrath-and-glory.god" : god?.toLowerCase()});