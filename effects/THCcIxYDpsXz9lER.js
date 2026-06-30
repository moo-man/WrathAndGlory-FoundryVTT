let effects = this.item.effects.contents.filter(i => i.id != this.effect.id);

let choice = await ItemDialog.create(effects, 1, {title : this.item.name, text: this.effect.name});
choice[0].updateSource({name : choice[0].baseName, "system.transferData.type" : "document"})