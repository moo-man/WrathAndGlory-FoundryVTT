if (
    args.result.isWrathComplication &&
    args.weapon?.hasKeyword(["LAS"]) &&
    args.weapon.traitList.reliable &&
    !this.actor.hasCondition("dying")
) {
        args.result.isWrathComplication = false;
        args.result.text["oldReliable"] = {label : "Old Reliable", description : "Wrath Die Complication Ignored"};
}