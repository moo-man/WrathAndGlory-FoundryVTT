let difference = args.actor.system.attributes[args.data.attribute].total - args.actor.system.attributes["willpower"].total;
args.fields.pool -= difference;
args.data.attribute = "willpower";