let value = await ValueDialog.create({text : this.script.label, title : this.effect.name})

this.effect.updateSource({name : this.effect.setSpecifier(value)})
this.item.updateSource({name : this.item.setSpecifier(value)})