let shield = this.actor.items.get(this.item.getFlag(game.system.id, "shield"))
args.fields.damage += shield.system.rating + args.actor.system.attributes.strength.total;

if (shield.system.traits.has("powerField"))
{
  args.fields.ap.value += shield.system.rating
}