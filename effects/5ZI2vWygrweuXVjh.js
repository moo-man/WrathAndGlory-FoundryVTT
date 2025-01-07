if (args.target.statuses.has("fullCover"))
{
    args.fields.difficulty -= 2;
}
else if (args.target.statuses.has("halfCover"))
{
    args.fields.difficulty -= 1;
}