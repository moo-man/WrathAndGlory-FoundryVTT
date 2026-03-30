import { WNGTest } from "./test.js"

export default class WeaponTest extends WNGTest {
  constructor(data = {})
  {
    super(data)
    if (foundry.utils.isEmpty(data))
      return

    this.data.testData.range = data.range
    this.data.testData.aim = data.aim
    this.data.testData.calledShot = data.calledShot
    this.data.testData.salvo = data.salvo;
    this.data.testData.charging = data.charging;


    this.addDamageData(data);

    //this.data.context.edit = mergeObject(this.data.context.edit, {damage : 0, ed : 0, ap : 0})
  }

  get template() {
    return "systems/wrath-and-glory/templates/chat/roll/weapon/weapon-roll.hbs"
  }

  async runPreScripts()
  {
      await super.runPreScripts();
      await Promise.all(this.actor.runScripts("preRollWeaponTest", this));
      await Promise.all(this.item.runScripts("preRollWeaponTest", this));
  }

  async runPostScripts()
  {
      await super.runPostScripts();
      await Promise.all(this.actor.runScripts("rollWeaponTest", this));
      await Promise.all(this.item.runScripts("rollWeaponTest", this));
  }

  async rollTest() {
    await super.rollTest();
    await this.handleSalvo();
    return this

  }

  async handleSalvo()
  {
    // If salvo option used, or weapon has no salvo, mark loaded as false
    if (this.weapon.isRanged && this.weapon.system.category != "grenade-missile" && (this.testData.salvo || !this.weapon.system.hasSalvo))
    {
      await this.weapon.update({"system.needsReload": true});
      if (this.weapon.system.ammo.document)
      {
        await this.weapon.system.ammo.document.update({"system.quantity": this.weapon.system.ammo.document.system.quantity - 1});
      }
    }
    else  if (this.weapon.system.category == "grenade-missile")
    {
      await this.weapon.update({"system.quantity": this.weapon.system.quantity - 1});
    }
  }

  async edit({pool=0, wrath=0, icons=0, damage=0, ed=0, ap=0}={})
  {
    this.data.testData.edit.damage += damage;
    this.data.testData.edit.ed += ed;
    this.data.testData.edit.ap += ap;
    await super.edit({pool, wrath, icons})
  }

  _computeResult()
  {
    super._computeResult()

    if (this.result.isWrathCritical)
      this.result.isWrathCritical = this.result.isWrathCritical && this.result.isSuccess // Only critical if test is successful

    this.result.range = this.testData.range;
    this.result.aim = this.testData.aim;
    this.result.calledShot = this.testData.calledShot;
    this.result.salvo = this.testData.salvo;
    this.result.charging = this.testData.charging;
    if (this.weapon.system.traits?.has("blast"))
    {
      this.result.blast = this.weapon.system.traits.has("blast").rating;
      if (!this.result.isSuccess)
      {
        this.result.scatter = true;
        this.computeDamage();
      }
    }
  }

  get weapon() {return fromUuidSync(this.testData.itemId)}
  
}

