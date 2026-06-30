if (args.result.allDice.filter(i => i.result == 1).length >= 2)
{
  args.result.text[this.effect.id] = {label: this.effect.name, description: "Added Complication"};
  args.result.isWrathComplication = true;
}