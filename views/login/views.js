const login = {
    main:function()
    {
        render(/*html*/`
            <h1>{{ nama }}</h1>
            <input type="text" v-model="nama">
            <input type="text" v-model="nama">
        `)

        return this
    },controller:function()
    {
        new Vue({
            el:'#App',
            data:{
                nama:''
            }
        })
    }
}