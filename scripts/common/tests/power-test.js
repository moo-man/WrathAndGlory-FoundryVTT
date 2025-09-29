import { WNGTest } from "./test.js"

export default class PowerTest extends WNGTest {
  constructor(data)
  {
    super(data)
    if (foundry.utils.isEmpty(data))
      return
    
    this.data.testData.potency = foundry.utils.deepClone(this.item.potency.list)
    this.data.testData.potency.forEach(p => p.allocation = 0)
    this.data.testData.edit.potency = 0;

    if (this.item.system.damage?.enabled)
    {
      this.addDamageData(data);
    }

  }

  get template() {
    return "systems/wrath-and-glory/templates/chat/roll/power/power-roll.hbs"
  }

  async runPreScripts()
  {
      await super.runPreScripts();
      await Promise.all(this.actor.runScripts("preRollPowerTest", this));
      await Promise.all(this.item.runScripts("preRollPowerTest", this));
  }

  async runPostScripts()
  {
      await super.runPostScripts();
      await Promise.all(this.actor.runScripts("rollPowerTest", this));
      await Promise.all(this.item.runScripts("rollPowerTest", this));
  }



  _computeResult()
  {
    super._computeResult()
    if (this.result.isSuccess)
    {
      this.result.range = this.item.range
      this.result.duration = this.item.duration
      this.computePotencies()
    }
  }

  computePotencies() {

    this.result.potency = {spent : 0, options : duplicate(this.testData.potency), available : this.testData.shifted.potency.dice.length + this.testData.edit.potency}

    this.result.potency.options.forEach(p => {
      // Set initial potency values (before potency allocation)
      if (p.property)
        foundry.utils.setProperty(this.result, p.property, foundry.utils.hasProperty(this.result, p.property) ? foundry.utils.getProperty(this.result, p.property) : p.initial) // If property already exists, use that as initial

      
      // Mainly for Range - try to accomodate for string range values (10 m) by replacing only numeric content
      let propValue = foundry.utils.getProperty(this.result, p.property)
      let addToValue = (p.allocation * p.value)
      let newValue
      if (!Number.isNumeric(propValue) && Number.isNumeric(parseInt(propValue))) // If property to add is not numeric
      {
        let propValueNum = (parseInt(propValue)) // parse the number
        newValue = propValue.replace(propValueNum, propValueNum + addToValue) // Replace the number with the potency value added
      }
      else 
        newValue = parseInt(propValue) + addToValue // If numeric property, just add the potency value


      if (p.property)
        foundry.utils.setProperty(this.result, p.property, newValue) 

      this.result.potency.spent += p.cost * p.allocation

    })
    this.result.potency.options.forEach(p => {
      p.canAllocate = (this.result.potency.spent + p.cost) <= this.result.potency.available

      if (p.single)
        p.canAllocate = p.canAllocate && p.allocation == 0
    })
  }

  resetAllocation() {
    this.testData.potency.forEach(p => p.allocation = 0)
    this._computeResult()
    this.sendToChat()
  }

  unshift() {
    this.testData.potency.forEach(p => p.allocation = 0)
    super.unshift()
  }

  async edit({pool=0, wrath=0, icons=0, damage=0, ed=0, ap=0, potency=0}={})
  {
    this.data.testData.edit.damage += damage;
    this.data.testData.edit.ed += ed;
    this.data.testData.edit.ap += ap;
    this.data.testData.edit.potency += potency;
    await super.edit({pool, wrath, icons})
  }

  addAllocation(index) {
    let potency = this.result.potency.options[index]
    let current = potency.allocation
    let single = potency.single
    let spent = this.result.potency.spent

    if (single && current > 1)
      return false

    if ((spent + potency.cost) > this.result.potency.available)
      return false

    this.testData.potency[index].allocation++

    this._computeResult()
    this.sendToChat()
  }
  
  get power() {return this.item}
  
}

