let roll = await new Roll("1d3").roll();

let names = {
	1 : "Razor Claw",
	2 : "Grasping Tendrils",
	3 : "Dripping Poison"
}

await roll.toMessage(this.script.getChatData({flavor : names[roll.total]}));

this.script.notification(names[roll.total]);