if (args.test?.result.isWrathCritical && args.test.testData.charging)
{
	args.modifiers.mortal.push({label : this.effect.name, value : 2})
}