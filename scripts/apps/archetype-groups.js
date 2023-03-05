/**
 * Welcome to my incredibly over-engineered concept for archetype wargear
 * 
 * "groups" is the concept to convey how an archetype gets wargear A, B, C, and D (such as (A or B) and (C or D))
 * 
 * An archetype's wargear list is flat, however their "groups" object stores the instructions on how to distribute those items
 * 
 * Within the groups object are objects of type "and", "or", "item". 
 * 
 * "and/or" objects have an "items" property that can store "and/or/item" type objects
 * "item" type objects exist at the bottom of the structure, and they store the index of the item in the wargear array
 * 
 * So this structure can go arbitraritly deep (ands storing ors storing ands storing ors ... to finally storing items). Absolutely overkill, but whatever
 * 
 * Example:
 * (0 AND 1 AND 2 AND (3 OR 4)) AND (5 OR 6 OR (7 AND 8)) 
 * {
       type: "and", 
       items : [
           {type : 'and', items : [
               {type: 'item', index: 0},
               {type: 'item', index: 1},
               {type: 'item', index: 2},
               {type: 'or', items: [
                   {type: 'item', index: 3},
                   {type: 'item', index: 4},
               ]}
           ]},
           {type: "or", items : [
               {type: 'item', index: 5},
               {type: 'item', index: 6},
               {type: "and", items : [
                   {type: 'item', index: 7},
                   {type: 'item', index: 8}
               ]}
           ]}
       ]
   }

 * 
 */


export default class ArchetypeGroups extends Application {

    constructor(object) {
        super()
        this.object = object
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "archetype-groups",
            template: "systems/wrath-and-glory/template/apps/archetype-groups.hbs",
            height: "auto",
            width: 285,
            title: "Archetype Groups",
            resizable: true,
            dragDrop: [{ dragSelector: ".wargear", dropSelector: ".group", permissions: { dragstart: true, drop: true } }]
        })
    }

    getData() {
        let data = super.getData();

        data.groupHtml = this._constructHTML()
        return data
    }


    _groupIndexToObjects() {
        return ArchetypeGroups.groupIndexToObjects(this.object.groups, this.object)
    }

    _constructHTML()
    {
        return ArchetypeGroups.constructHTML(this.object)
    }



    // Recursive function to convert group index arrays into their corresponding objects objects
    // Also assigns a temporary ID to easily handle moving groups around
    static groupIndexToObjects(groupObject, item) {
            if (["and", "or"].includes(groupObject.type))
            {
                return {
                    type: groupObject.type, 
                    items : groupObject.items.map(i => this.groupIndexToObjects(i, item)),
                    groupId: groupObject.groupId
                }
            }
            
            // Base case
            else if (["item", "generic"].includes(groupObject.type))
            {
                return mergeObject(item.wargear[groupObject.index], {index : groupObject.index, groupId : groupObject.groupId})
            }
        }

    /**
     * Construct html to display the groups in a readable format
     * 
     * @param {Object} displayGroups Group object that has been processed with actual items (gone through groupIndexToObjects)
     * @returns 
     */
    static constructHTML(item, {parentheses=false, commas=false, draggable=true}={}) {
        let displayGroups = this.groupIndexToObjects(item.groups, item)
        let html = `
        <div class="group-wrapper">
        `

        let groupToHtml = (groupObject) => {
            let html = ``
            if (["and", "or"].includes(groupObject.type)) // If is group collection, create group html and recursively call this function on items within
            {
                html += `<div class="group">`
                html += `<div class="group-list" data-id="${groupObject.groupId}">
                ${parentheses // Denote groups with parenthes or not
                    ? "<span class='parentheses'> ( </span>" 
                    : "" }

                ${groupObject.items.map(groupToHtml).join( // Join subgroups and items with "connector", that being AND or OR (comma can be substituted for AND)
                
                commas && groupObject.type == "and" // If group type is AND with comma option, use comma, otherwise, use AND or OR
                ? `<span class="comma">,</span>`
                :  `<a class="connector">${groupObject.type.toUpperCase()}</a>
                `)}

                ${parentheses // End group with parentheses if option is present
                    ? " <span class='parentheses'> ) </span> " 
                    : ""}
                </div>`

                html += `</div>`
            }
            else
                html += `<div class="wargear" draggable=${draggable} data-path="data.wargear" data-index="${groupObject.index}" data-id="${groupObject.groupId}">${groupObject.name}</div>`
            return html
        }


        html += groupToHtml(displayGroups)

        html += "</div>"
        return html
    }

    _onDragStart(ev) {
        ev.dataTransfer.setData("text/plain", ev.target.dataset.id)
    }

    _onDrop(ev) {
        let dropID = ev.target.dataset.id
        let dragID= ev.dataTransfer.getData("text/plain")

        if (dropID && dragID && dropID != dragID)
        {
            this.moveObject(dragID, dropID)
        }
        else if (dragID && !dropID)
        {
            this.moveObject(dragID, "root")
        }


    }

    async moveObject(moveID, destID)
    {
        let groups = duplicate(this.object.groups)

        let objectToMove = ArchetypeGroups.search(moveID, groups)
        this.delete(moveID, groups)
        this.insert(objectToMove, destID, groups)
        this.clean(groups)
        await this.object.update({"data.groups" : groups})
        this.render(true)

    }


    // search groups object for ID
    static search(id, groups)
    {
        // base case
        if (groups.groupId == id)
            return groups

        if (["and", "or"].includes(groups.type))
        {
            for(let item of groups.items)
            {
                let innerSearch = ArchetypeGroups.search(id, item)
                if (innerSearch)
                    return innerSearch
            }
        }
    }

    delete(id, groups)
    {
            // base case
            if (groups.groupId == id)
                return groups
    
            if (["and", "or"].includes(groups.type))
            {
                for(let [index, item] of groups.items.entries())
                {
                    let innerSearch = this.delete(id, item)
                    if (innerSearch)
                    {
                        groups.items.splice(index, 1)
                        if (groups.items.length == 1)
                            groups = groups.items[0]
                    }
                }
            }
    }

    // Inserts obj into the dest, if dest is an item, create an or container for both of them, if it's a container, simply add it to the list
    insert(obj, dest, groups)
    {
            // base case
        if (groups.groupId == dest)
        {
            if (dest == "root") // Special case where root is the destination
                groups.items.push(obj)
            return groups
        }

        if (["and", "or"].includes(groups.type))
        {
            for(let [index, item] of groups.items.entries())
            {
                let innerSearch = this.insert(obj, dest, item)
                if (innerSearch?.items) // if object is a collection: easy, just add to collection
                {
                    innerSearch.items.push(obj)
                }   
                else if(innerSearch) // If destination is another item, create a collection for that item and the one being added
                {
                    groups.items[index] = {type : 'or', items: [groups.items[index], obj], groupId : randomID()}
                }
            }
        }
    }


    // Removes empty container objects (and/or with 0 items) and changes container objects that have 1 item to simply be that element
    clean(groups) {
        if (["and", "or"].includes(groups.type))
        {          
            for (let [index,item] of groups.items.entries())
            {
                let action = this.clean(item)
                if (action == "remove")
                    groups.items.splice(index, 1)
                if (action == "single")
                    groups.items[index] = groups.items[index].items[0]
            }
            if (groups.items.length == 1)
            {
                groups = groups.items[0]
                return "single"
            }
            else if (groups.items.length == 0 && groups.groupId != "root")
                return "remove"
        }
        return "keep"
    }


    activateListeners(html)
    {
        super.activateListeners(html)


        html.find(".connector").click(async ev => {
            let id = $(ev.currentTarget).parents(".group-list").attr("data-id")
            let groups = duplicate(this.object.groups);
            let obj = ArchetypeGroups.search(id, groups);
            obj.type = obj.type == "and" ? "or" : "and"; // flip and/or
            await this.object.update({"data.groups" : groups})
            this.render(true);
        })

        html.on("dragenter", ".group-list,.wargear", ev => {
            ev.currentTarget.classList.add("dragenter")
            $(ev.currentTarget).parents(".dragenter").each((i, e) => e.classList.remove("dragenter"))
        })

        html.on("dragleave", ".group-list,.wargear", ev => {
            ev.currentTarget.classList.remove("dragenter")
            let parent = $(ev.currentTarget).parents(".group-list")[0]
            if (parent)
                parent.classList.add("dragenter")
        })
    }

}