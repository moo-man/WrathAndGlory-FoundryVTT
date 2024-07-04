import WNGUtility from "../common/utility";

export default WNGDocumentMixin = (cls) => class extends cls 
{

    async _preCreate(data, options, user) 
    {
        if (data._id)
        {
            options.keepId = WNGUtility._keepID(data._id, this);
        }

        await super._preCreate(data, options, user);
        await this.system._preCreate(data, options);
    }

    async _preUpdate(data, options, user) 
    {
        await super._preUpdate(data, options, user);
        await this.system._preUpdate(data, options);
    }

    async _preDelete(options, user)
    {
        await super._preDelete(options, user);
        await this.system._preDelete(options, user)
    }

    async _onUpdate(data, options, user)
    {
        await super._onUpdate(data, options, user);
        await this.system._onUpdate(data, options, user);
    }

    async _onCreate(data, options, user)
    {
        await super._onCreate(data, options, user);
        await this.system._onCreate(data, options, user);
    }

    async _onDelete(options, user)
    {
        await super._onDelete(options, user);
        await this.system._onDelete(options, user)
    }

    // Assigns a property to all datamodels are their embedded models
    propagateDataModels(model, name, value)
    {
        if (model instanceof foundry.abstract.DataModel && !model[name])
        {
            Object.defineProperty(model, name, {
                value, 
                enumerable : false
            });
        }

        for(let property in model)
        {
            if (model[property] instanceof foundry.abstract.DataModel)
            {
                this.propagateDataModels(model[property], name, value);
            }
        }
    }
};