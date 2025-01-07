let effects = this.item.effects.contents.filter(i => i.id != this.effect.id);

effects.forEach(e => {
	e.update({disabled : true})
})

let e = effects.find(i => i.id == "93ZacxDC5SSsOAfb");

e.update({disabled : false});

this.script.notification(`${e.name} (+3 Defence) Activated`)