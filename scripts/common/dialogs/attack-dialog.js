import { CommonDialog } from "./common-dialog.js";

export class AttackDialog extends CommonDialog {

  get tooltipConfig() {
    return foundry.utils.mergeObject({
      ed : {
          label : "ED",
          type : 1,
          noCollect: true,
          path : "fields.ed.value",
      },
      ap : {
          label : "AP",
          type : 1,
          noCollect: true,
          path : "fields.ap.value"
      },
      damage : {
          label : "Damage",
          type : 1,
          noCollect: true,
          path : "fields.damage"
      },
      ones : {
          label : "Ones Value",
          type : 1,
          noCollect: true,
          path : "fields.damageDice.values.ones",
          hideLabel : true
      },
      twos : {
          label : "Twos Value",
          type : 1,
          noCollect: true,
          path : "fields.damageDice.values.twos",
          hideLabel : true
      },
      threes : {
          label : "Threes Value",
          type : 1,
          noCollect: true,
          path : "fields.damageDice.values.threes",
          hideLabel : true
      },
      fours : {
          label : "Fours Value",
          type : 1,
          noCollect: true,
          path : "fields.damageDice.values.fours",
          hideLabel : true
      },
      fives : {
          label : "Fives Value",
          type : 1,
          noCollect: true,
          path : "fields.damageDice.values.fives",
          hideLabel : true
      },
      sixes : {
          label : "Sixes Value",
          type : 1,
          noCollect: true,
          path : "fields.damageDice.values.sixes",
          hideLabel : true
      }
  }, super.tooltipConfig)
}

  _getSubmissionData()
  {
    let data = super._getSubmissionData();
    data.damageDice.values = {
      1 : data.damageDice.values.ones,
      2 : data.damageDice.values.twos,
      3 : data.damageDice.values.threes,
      4 : data.damageDice.values.fours,
      5 : data.damageDice.values.fives,
      6 : data.damageDice.values.sixes
    }
    return data;
  }

  _defaultFields() 
  {
      return mergeObject({
          damage : 0,
          ed : {
            value : 0,
            dice : 0
          },
          ap : {
            value : 0,
            dice : 0
          },
          damageDice : {
            values : {
              ones : 0,
              twos : 0,
              threes : 0,
              fours : 1,
              fives : 1,
              sixes : 2,
            },
            addValue : 0
          }
      }, super._defaultFields());
  }
}
