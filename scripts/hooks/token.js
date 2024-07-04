export default function() {
    Hooks.on("createToken", (token) => token.object.drawMobNumber())
    Hooks.on("updateToken", (token) => token.object.drawMobNumber())
    
    Hooks.on("hoverToken", (token, hover) => {
        let actor = token.actor;
        token.passengers?.forEach(i => i.destroy());
        delete token.passengers;
        if (actor && actor.type == "vehicle" && actor.system.complement.list.length > 0 && !actor.getFlag("wrath-and-glory", "hidePassengers"))
        {
            if (hover)
            {
                const ROW_SIZE = 8
                let rowCount = Math.ceil(actor.system.complement.list.length / ROW_SIZE);
                let sprites = actor.system.complement.list.map(i => i.document).filter(i => i).map((a, i) => 
                {
                    let scene = token.document.parent;
                    let sprite = PIXI.Sprite.from(a.prototypeToken.texture.src)
                    sprite.height = scene.grid.size;
                    sprite.width = scene.grid.size;
                    
                    let row = Math.floor(i / ROW_SIZE) * scene.grid.size;
                    let column = i % ROW_SIZE * scene.grid.size;

                    let tokenCenterMod = (token.document.width * scene.grid.size) / 2
                    if (rowCount > 1)
                    {
                        tokenCenterMod += scene.grid.size / 2;
                    }
                    else if (rowCount == 1)
                    {
                        let missing = 8 - actor.system.complement.list.length;
                        tokenCenterMod += Math.ceil(missing/2) * scene.grid.size;
                    }
                    let xOffset = -1 * ((ROW_SIZE / 2) * scene.grid.size) + tokenCenterMod


                    let yOffset = -1 * rowCount * scene.grid.size;

                    sprite.x = column + xOffset;
                    sprite.y = row + yOffset;

                    return sprite
                })
                token.addChild(...sprites);
                token.passengers = sprites;
            }
        }
    })
}