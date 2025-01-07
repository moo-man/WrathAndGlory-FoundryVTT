let bonus = args.target.statuses.has("fullCover")?2:1;

args.fields.difficulty += bonus;