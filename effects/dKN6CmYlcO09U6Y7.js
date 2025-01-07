let item = {
	name : "Conjured Flame",
	img : this.effect.img,
	type : "weapon",
	system : {
		damage : {
			base : 8,
			ed : {
				base: this.effect.sourceTest.result.damage.ed.value
			}
		},
		traits : [{name : "inflict", rating : "On Fire"}],
		equipped : true
	}
}

this.actor.createEmbeddedDocuments("Item", [item], {fromEffect: this.effect.id})

this.script.notification("Weapon Created");