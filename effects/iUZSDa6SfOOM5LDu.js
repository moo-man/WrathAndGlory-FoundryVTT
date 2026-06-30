if (args.result.allDice.filter(d => d.result == 1).length > 0)
{
  args.result.text[this.effect.id] = {
    label: this.effect.name,
    description: "May reroll 1s"
  }
}