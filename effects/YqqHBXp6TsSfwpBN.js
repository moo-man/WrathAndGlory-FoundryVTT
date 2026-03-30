if (args.test?.result.isWrathCritical && args.test.item?.system.isRanged && args.test.result.aim)
{
let choice = await  foundry.applications.api.Dialog.wait({
  window: {title: this.effect.name},
  content : "<p>Inflict <strong>1d3 Mortal Wounds</strong> or take a <strong>Movement</strong> action?</p>",
  buttons : [
    {
      action: "wounds",
      label : "Wounds"
    },
    {
      action: "movement",
      label: "Movement"
    }
  ]
}) 
  if (choice == "wounds")
  {
    let roll = await new Roll("1d3").roll();
    roll.toMessage(this.script.getChatData());
    args.modifiers.mortal.push({value: roll.total, label: this.effect.name});
  }
  else 
  {
    this.script.message("Makes a free Movement Action!");
  }
}