let weapons = ["Chainsword",
              "Chainaxe",
              "Power Sword",
              "Power Fist",
              "Unarmed Strike"]
return args.weapon && (weapons.includes(args.weapon.name) || args.weapon.keywords.includes("BOLT") || args.weapon.keywords.includes("ADEPTUS ASTARTES"))