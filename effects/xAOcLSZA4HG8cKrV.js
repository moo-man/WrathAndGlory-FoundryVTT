let table = await fromUuid("Compendium.wng-core.tables.RollTable.9Na4hmDRZlV0kX48");

let tableResult = await table.roll();

this.script.message(`Gained <strong>${tableResult.results[0].name}</strong>`)
this.actor.addEffectItems(tableResult.results[0].documentUuid, this.effect);