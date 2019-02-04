exports.dateSet = function(args)
{
    let date = new Date(args)
    let month = (date.getMonth()<10)? "0"+date.getMonth():date.getMonth();
    let day = (date.getDate()<10)? "0"+date.getDate():date.getDate();
    date   = date.getFullYear() + '-' + month + '-' + day

    return date

}