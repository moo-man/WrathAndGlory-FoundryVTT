let effects = this.item.effects.contents.filter(i => i.id != this.effect.id);

effects.forEach(e => {
	e.update({disabled : true})
})

let e = effects.find(i => i.id == "02qHBz2ng62Xg1Zx");

e.update({disabled : false});

this.script.notification(`${e.name} (+2 Defence) Activated`)