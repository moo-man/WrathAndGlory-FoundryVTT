let blinded = this.actor.hasCondition("blinded");
if (blinded) 
{
    // Prevent the condition from being created
    blinded.delete();
    this.script.notification(`${this.actor.name} immune to Blinded condition!`);
}