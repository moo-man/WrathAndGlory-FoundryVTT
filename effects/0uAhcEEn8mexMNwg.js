let target = Array.from(game.user.targets)[0]?.document?.name;

if (target)
{
	this.script.notification(`Target set to ${target}`)
	this.effect.update({name : this.effect.setSpecifier(target)})
}
else
{
	this.script.notification("Must target a Token");
}