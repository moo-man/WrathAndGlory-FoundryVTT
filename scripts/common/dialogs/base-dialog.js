
export class RollDialog extends WarhammerRollDialogV2 {

    get tooltipConfig() {
      return {
        pool : {
            label : "Pool",
            type : 1,
            path : "fields.pool",
            hideLabel : true
        },
        difficulty : {
            label : "Difficulty",
            type : 1,
            path : "fields.difficulty",
            hideLabel : true
        },
        wrath : {
            label : "Wrath",
            type : 1,
            path : "fields.wrath"
        }
    }
  }
  

    async _prepareContext(options)
    {
        let context = await super._prepareContext(options);
        context.title = this.context.title;
        context.noDn = this.context.noDn;
        context.noWrath = this.context.noWrath;
        context.rollModes = CONFIG.Dice.rollModes;
        return context;
    }

    static async setupData({pool, wrath, dn}, actor, context={}, options={})
    {
        let {data, fields} = this._baseDialogData(actor, context, options);

        
        foundry.utils.mergeObject(fields, context.fields || {});


        if (pool)
        {
          fields.pool = pool;
        }
        if (wrath)
        {
          fields.wrath = wrath;
        }
        
        if (dn && !this.context.noDn)
        {
          fields.dn = dn;
        }
        else 
        {
          context.useDn = false;
        }

        return {data, fields, context, options};
    }

    _getSubmissionData()
    {
      let data = super._getSubmissionData();
      if (this.context.noWrath)
      {
        data.wrath = 0;
      }
      return data;
    }

    computeFields()
    {

    }

    computeInitialFields()
    {
      if (this.context.corruption)
      {
        let level = game.wng.config.corruptionLevels[this.actor.corruptionLevel]
        this.fields.dn += level.dn;
        this.tooltips.add("difficulty", level.dn, "Corruption Level")
      }
    }

    createBreakdown()
    {
        let breakdown = super.createBreakdown();
        breakdown.modifiersBreakdown = this.tooltips.getCollectedTooltips();
        return breakdown;
    }
  
    _defaultFields() 
    {
        let fields = mergeObject({
            difficulty : 3,
            pool : 1,
            wrath : 1,
        }, super._defaultFields());

        if (this.context.determination && game.user.isGM)
        {
          fields.rollMode = "gmroll";
        }
        return fields
    }
  }
  