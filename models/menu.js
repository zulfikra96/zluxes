"use strict"
const { Database } = require('../core/database')
class MenuModel extends Database{
    async createMenu(data)
    {
        data = await this
            .Insert()
            .Into('users_manajemen.menu')
            .Columns(data)
            .SetAsync().catch((err) => {
                console.log(err);
            })
        return data
    }
    async updateMenu(data, menu_id)
    {
        data = await this
            .Update('users_manajemen.menu')
            .SetColumns(data)
            .Where({column:'menu_id', value:menu_id})
            .SetAsync().catch((err) => {
                console.log(err);
            })
        return data
    }
    async getMenu(data)
    {
        data  = await this.Select(['menu.menu_id','nama_menu','url','menu_type','from_menu_id'])
            .From('users_manajemen.user_menu')
            .InnerJoin('users_manajemen.menu').On({table:'user_menu', column:'menu_id',value:'menu.menu_id' })
            .Where({column:'user_id', value:`'${data.user_id}'`})
            .GetAsync().catch((err) => console.log(err))
        return data
    }
}
exports.MenuModel = new MenuModel()