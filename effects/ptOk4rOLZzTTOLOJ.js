let ruin = parseInt(await ValueDialog.create({text: "Gain Ruin (1 per 6 Cultists)", title: this.effect.name}));

if (ruin)
{
  game.counter.change(ruin, "ruin");
}