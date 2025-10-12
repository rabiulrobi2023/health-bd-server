const oldObj = {
    page :"1",
    limit: "2"
}
const newObj = {}

newObj["page"] = oldObj["page"]
newObj["limit"] =5
console.log(newObj)