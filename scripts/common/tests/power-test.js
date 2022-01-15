import { WNGTest } from "./test.js"

export default class PowerTest extends WNGTest {
  constructor(data)
  {
    super(data)
    if (!data)
      return

    this.data.testData.ed = data.ed || {}
    this.data.testData.ap = data.ap || {}
    this.data.testData.damage= data.damage || {}
    
    this.data.testData.itemId = data.itemId
    
    this.data.testData.otherDamage = this.item.otherDamage // TODO: add to dialog
    this.data.testData.potency = duplicate(this.item.potency)
    this.data.testData.potency.forEach(p => p.allocation = 0)
  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/power/power-roll.html"
  }



  _computeResult()
  {
    super._computeResult()
    this.computeDamage() 
    if (this.result.isSuccess)
    {
      this.result.range = this.item.range
      this.computePotencies()
    }
  }

  computePotencies() {

    this.result.potency = {spent : 0, options : duplicate(this.testData.potency), available : this.testData.shifted.potency.length}

    this.result.potency.options.forEach(p => {
      // Set initial potency values (before potency allocation)
      if (p.property)
        setProperty(this.result, p.property, getProperty(this.result, p.property) || p.initial) // If property already exists, use that as initial

      
      // Mainly for Range - try to accomodate for string range values (10 m) by replacing only numeric content
      let propValue = getProperty(this.result, p.property)
      let addToValue = (p.allocation * p.value)
      let newValue
      if (!Number.isNumeric(propValue) && Number.isNumeric(parseInt(propValue))) // If not numeric
      {
        let propValueNum = (parseInt(propValue)) // parse the number
        newValue = propValue.replace(propValueNum, propValueNum + addToValue) // Replace the number with the potency value added
      }
      else 
        newValue = propValue + addToValue // If numeric property, just add the potency value

      setProperty(this.result, p.property, newValue) 

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

