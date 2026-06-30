if (args.result.isWrathCritical)
{
  game.counter.change(1, "ruin");
  args.result.text[this.effect.id] = {label: this.effect.name, description: "Added extra Ruin"}
}