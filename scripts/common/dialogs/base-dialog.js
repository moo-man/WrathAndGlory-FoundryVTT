
export class RollDialog extends WarhammerRollDialog {

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

    static get defaultOptions() {
      let options = super.defaultOptions
      options.classes.push("wrath-and-glory")
      options.resizable = true;
      options.width = 540;
      return options
    }
  
    get template() 
    {
      return "systems/wrath-and-glory/template/dialog/common-roll.hbs";
    }

    constructor(...args)
    {
      super(...args);
      if (this.options.determination)
      {
        this.subTemplate = "systems/wrath-and-glory/template/dialog/determination-roll.hbs"
      }
    }


    async getData()
    {
        let data = await super.getData();
        data.title = this.options.title;
        data.noDn = this.options.noDn;
        data.noWrath = this.options.noWrath;
        data.rollModes = CONFIG.Dice.rollModes;
        return data;
    }

    static async setupData({pool, wrath, dn}, actor, options={})
    {
        let {data, fields} = this._baseDialogData(actor, options);

        
        mergeObject(fields, options.fields || {});


        if (pool)
        {
          fields.pool = pool;
        }
        if (wrath)
        {
          fields.wrath = wrath;
        }
        
        if (dn)
        {
          fields.dn = dn;
        }
        else 
        {
          options.useDn = false;
        }

        return {data, fields, options};
    }

    _getSubmissionData()
    {
      let data = super._getSubmissionData();
      if (this.options.noWrath)
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
      if (this.options.corruption)
      {
        let level = game.wng.config.corruptionLevels[this.actor.corruptionLevel]
        this.difficulty += level.dn;
        this.tooltips.add("difficulty", level.dn, "Corruption Level")
      }
    }
  
    _defaultFields() 
    {
        let fields = mergeObject({
            difficulty : 3,
            pool : 1,
            wrath : 1,
        }, super._defaultFields());

        if (this.options.determination && game.user.isGM)
        {
          fields.rollMode = "gmroll";
        }
        return fields
    }
  }
  