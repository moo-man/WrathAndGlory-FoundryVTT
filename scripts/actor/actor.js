export class WrathAndGloryActor extends Actor {

    async _preCreate(data, options, user) {
        let initData = {
            "token.bar1": { "attribute": "combat.wounds" },
            "token.bar2": { "attribute": "combat.shock" },
            "token.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "token.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "token.disposition": CONST.TOKEN_DISPOSITIONS.NEUTRAL,
            "token.name": data.name,
            "flags.wrath-and-glory.autoCalc.defense" : true,
            "flags.wrath-and-glory.autoCalc.resilience" : true,
            "flags.wrath-and-glory.autoCalc.shock" : true,
            "flags.wrath-and-glory.autoCalc.awareness" : true,
            "flags.wrath-and-glory.autoCalc.determination" : true,
            "flags.wrath-and-glory.autoCalc.wounds" : true,
            "flags.wrath-and-glory.autoCalc.conviction" : true
          }
          if (data.type === "agent") {
            initData["token.vision"] =  true;
            initData["token.actorLink"] = true;
          }
          this.data.update(initData)
    }

    prepareData() {
        super.prepareData();
        this.itemCategories = this.itemTypes
        this._computeItems();
        this._computeAttributes();
        this._computeSkills();
        this._computeCombat();
        if (this.type === "agent") {
            this.prepareAgent();
        } else if (this.type === "threat") {
            this.prepareThreat();
        }
    }



    prepareAgent() {
        this.advances.experience.spent = 0;
        this.advances.experience.total = 0;
        this._computeExperience();
    }

    prepareThreat() {

    }

    _computeItems() {
        this.combat.resilience.armor = 0;
        for (let item of this.items) {

            if (item.isArmour) {
                this._computeArmour(item);
            }
            if (this.advances && item.cost) {
                this.advances.experience.spent = this.advances.experience.spent + item.cost;
            }
        }
    }

    _computeArmour(item) {
        if (this.combat.resilience.armor < item.rating) {
            this.combat.resilience.armor = item.rating;
        }
    }

    _computeAttributes() {
        for (let attribute of Object.values(this.attributes)) {
            attribute.total = attribute.rating + attribute.bonus;
            attribute.cost = game.wng.utility.getAttributeCostTotal(attribute.rating);
            if (this.advances) {
                this.advances.experience.spent = this.advances.experience.spent + attribute.cost;
            }
        }
    }

    _computeSkills() {
        for (let skill of Object.values(this.skills)) {
            skill.cost = game.wng.utility.getSkillCostTotal(skill.rating);
            skill.total = this.attributes[skill.attribute].total + skill.rating + skill.bonus;
            if (this.advances) {
                this.advances.experience.spent = this.advances.experience.spent + skill.cost;
            }
        }
    }

    _computeCombat() {
        let autoCalc = this.getFlag("wrath-and-glory", "autoCalc") || {}

        if (autoCalc.awareness)
            this.combat.passiveAwareness.total = this._setDefault(Math.ceil(this.skills.awareness.total / 2) + this.combat.passiveAwareness.bonus, 1);
        if (autoCalc.defense)
            this.combat.defense.total = this._setDefault(this.attributes.initiative.total - 1 + this.combat.defense.bonus, 1);
        if (autoCalc.resolve)
            this.combat.resolve.total = this._setDefault(this.attributes.willpower.total - 1 + this.combat.resolve.bonus, 1);
        if (autoCalc.conviction)
            this.combat.conviction.total = this._setDefault(this.attributes.willpower.total + this.combat.conviction.bonus, 1);
        if (autoCalc.resilience)
            this.combat.resilience.total = this._setDefault(this.attributes.toughness.total + 1 + this.combat.resilience.bonus + this.combat.resilience.armor, 1);
        if (autoCalc.wounds && this.type=="agent")
            this.combat.wounds.max = this._setDefault((this.advances.tier * 2) + this.attributes.toughness.total + this.combat.wounds.bonus, 1);
        if (autoCalc.determination)
            this.combat.determination.total = this._setDefault(this.attributes.toughness.rating + this.combat.determination.bonus, 1);
        if (autoCalc.shock && this.type=="agent")
            this.combat.shock.max = this._setDefault(this.attributes.willpower.rating + this.advances.tier + this.combat.shock.bonus, 1);
    }

    _setDefault(value, fallback) {
        return (value < fallback ? fallback : value);
    }

    _computeExperience() {
        this.advances.experience.spent += this.advances.species;
        this.advances.experience.total = this.advances.experience.current + this.advances.experience.spent;
    }

    get Size() {
        switch(this.combat.size)
        {
          case "tiny":
            return game.i18n.localize("SIZE.TINY");
          case "small":
            return game.i18n.localize("SIZE.SMALL");
          case "average":
            return game.i18n.localize("SIZE.AVERAGE");
          case "large":
            return game.i18n.localize("SIZE.LARGE");
          case "huge":
            return game.i18n.localize("SIZE.HUGE");
          case "gargantuan":
            return game.i18n.localize("SIZE.GARGANTUAN");
          default:
            return game.i18n.localize("SIZE.AVERAGE");
        }
    }

    get attributes() {return this.data.data.attributes}
    get skills() {return this.data.data.skills}
    get combat() {return this.data.data.combat}
    get bio() {return this.data.data.bio}
    get advances() {return this.data.data.advances}
    get resources() {return this.data.data.resources}
    get corruption() {return this.data.data.corruption}
    get notes() {return this.data.data.notes}

    getItemTypes(type) {
        return (this.itemCategories || this.itemTypes)[type]
    }

    getAttributeCosts(rating) {
        switch (rating) {
            case 1:
                return 0;
            case 2:
                return 4;
            case 3:
                return 10;
            case 4:
                return 20;
            case 5:
                return 35;
            case 6:
                return 55;
            case 7:
                return 80;
            case 8:
                return 110;
            case 9:
                return 145;
            case 10:
                return 185;
            case 11:
                return 230;
            case 12:
                return 280;
            default:
                return 0;
        }
    }

    getSkillsCosts(rating) {
        switch (rating) {
            case 1:
                return 2;
            case 2:
                return 6;
            case 3:
                return 12;
            case 4:
                return 20;
            case 5:
                return 30;
            case 6:
                return 42;
            case 7:
                return 56;
            case 8:
                return 72;
            default:
                return 0;
        }
    }
}
