let attack = {
	name : this.effect.name,
	type : "weapon",
	img : this.effect.img,
	system : {
		equipped : true,
		damage : {
			base : 6,
			ed : {
				base : 2
			}
		}
	}
}

this.actor.createEmbeddedDocuments("Item", [attack], {fromEffect: this.effect.id})