export async function migrateWorld() {
    const schemaVersion = 8;
    const worldSchemaVersion = Number(game.settings.get("wrath-and-glory", "worldSchemaVersion"));
    if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
        ui.notifications.info("Upgrading the world, please wait...");
            for (let actor of game.actors.contents) {
                try {
                    const update = migrateActorData(actor);
                    if (!isEmpty(update)) {
                        console.log(`Migrating ${actor.name}`)
                        await actor.update(update);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            for (let item of game.items.contents) {
                try {
                    console.log(`Migrating ${item.name}`)
                    const update = migrateItemData(item);
                    if (!isEmpty(update)) {
                        console.log(`Migrating ${item.name}`)
                        await item.update(update);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            for (let journal of game.journal.contents) {
              try {
                  console.log(`Migrating ${journal.name}`)
                  const update = migrateJournalData(journal);
                  if (!isEmpty(update)) {
                      console.log(`Migrating ${journal.name}`)
                      await journal.update(update);
                  }
              } catch (e) {
                  console.error(e);
              }
            }
            for (let table of game.tables.contents) {
              try {
                  console.log(`Migrating ${table.name}`)
                  const update = migrateTableData(table);
                  if (!isEmpty(update)) {
                      console.log(`Migrating ${table.name}`)
                      await table.update(update);
                  }
              } catch (e) {
                  console.error(e);
              }
            }
        game.settings.set("wrath-and-glory", "worldSchemaVersion", schemaVersion);
        ui.notifications.info("Upgrade complete!");
    }
};


let v10Conversions = {
  "wng-core.bestiary" : "wng-core.actors",
  "wng-core.abilities" : "wng-core.items",
  "wng-core.archetypes" : "wng-core.items",
  "wng-core.equipment" : "wng-core.items",
  "wng-core.keywords" : "wng-core.items",
  "wng-core.species-factions" : "wng-core.items",
  "wng-core.spells" : "wng-core.items",
  "wng-core.talents" : "wng-core.items",
  "wng-core.mutations" : "wng-core.items",
  "wng-forsaken.archetypes" : "wng-forsaken.items",
  "wng-forsaken.species-factions" : "wng-forsaken.items",
  "wng-forsaken.equipment" : "wng-forsaken.items",
  "wng-forsaken.abilities" : "wng-forsaken.items",
 }


function migrateActorData(actor) {
    const updateData = {
      items : []
    }

    let html = _migrateV10Links(actor.system.notes)
    if (html != actor.system.notes)
    {
      updateData["system.notes"] = html;
    }

    for(let item of actor.items)
    {
        let itemData = migrateItemData(item);
        if (!foundry.utils.isEmpty(itemData))
        {
            itemData._id = item.id;
            updateData.items.push(itemData);
        }
    }

    if (updateData.items.length == 0)
    {
        delete updateData.items;
    }


    return updateData;
}

function migrateJournalData(journal)
{
  let updateData = {_id : journal.id, pages : []};

  for(let page of journal.pages)
  {
    let html = page.text.content;
    console.log(`Checking Journal Page HTML ${journal.name}.${page.name}`)
    let newHTML = _migrateV10Links(html)

    if (html != newHTML)
    {
      updateData.pages.push({_id : page.id, "text.content" : newHTML});
    }
  }
  return updateData;
}

function migrateTableData(table)
{
  let updateData = {_id : table.id, results : []};

  for(let result of table.results)
  {
    if (result.type == 0)
    {
      let html = result.text;
      let newHTML = _migrateV10Links(html)

      if (html != newHTML)
      {
        updateData.results.push({_id : result.id, text : newHTML});
      }
    }

    else if (result.type == 2 && v10Conversions[result.documentCollection])
    {
      updateData.results.push({_id : result.id, documentCollection : v10Conversions[result.documentCollection]});
    }
  }
  return updateData;
}


function migrateItemData(item) {
    let updateData
    
    let newDescription = _migrateV10Links(item.system.description);
    let newBenefits = _migrateV10Links(item.system.benefits);

    if (item.system.description != newDescription)
    {
      updateData["system.description"] = newDescription
    }

    if (item.system.benefits != newBenefits)
    {
      updateData["system.benefits"] = newBenefits
    }

    return updateData;
}

function migrateEffectData(effect)
{
    let effectData = effect.toObject()
    let description = getProperty(effectData, "flags.wrath-and-glory.description")
    effectData.changes.forEach((change, i) => {
        if (change.mode == 0)
        {
            change.mode = 6
            setProperty(effectData, `flags.wrath-and-glory.changeCondition.${i}`, {description, script:""})
        }
    })
    return effectData
}

function _migrateV10Links(html)
{
  try 
  {
    if (!html) return 
    
    for(let key in v10Conversions)
    {
      let priorHTML = html
      html = html.replaceAll(key, v10Conversions[key])
      if (html != priorHTML)
      {
        console.log(`Replacing ${key} with ${v10Conversions[key]}`)
      }
    }
    return html;
  }
  catch (e)
  {
    console.error("Error replacing links: " + e);
  }
}