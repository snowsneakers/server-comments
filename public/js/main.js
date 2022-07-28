//asigns all trash can icons to the deleteBtn variable
const deleteBtn = document.querySelectorAll('.fa-trash')
//asigns all items with the class of .item span to the item variable
const item = document.querySelectorAll('.item span')
//asigns all the completed items to the itemCompleted variable
const itemCompleted = document.querySelectorAll('.item span.completed')

//adds a click event listener to all trash can icons
//will call the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//adds a click event listener to all the items
//will call the markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//adds a click event listener to all the items that have the class of completed
//will call the markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//function to delete item
async function deleteItem(){
    //take the inputed text and asigns it to the itemText variable
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch blocks
    try{
        //fetching from the http://localhost:2121/deleteItem route
        const response = await fetch('deleteItem', {
            //sending a delete request
            method: 'delete',
            //allows app to send and recieve different file formats 
            //in this case json
            headers: {'Content-Type': 'application/json'},
            //sends obj to server which uses itemFromJS to find which one to delete
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //asigns res.json() to data variable
        const data = await response.json()
        //console.log data
        console.log(data)
        //refresh page to show changes made
        location.reload()

    }catch(err){
        //console.log the error if try encouters one
        console.log(err)
    }
}

//markComplete function
async function markComplete(){
     //take the inputed text and asigns it to the itemText variable
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch block
    try{
        //fetching from the http://localhost:2121/markComplete route
        const response = await fetch('markComplete', {
            //sending a put/update request
            method: 'put',
             //allows app to send and recieve different file formats 
            //in this case json
            headers: {'Content-Type': 'application/json'},
            //sends obj to server which uses itemFromJS to find which one to update
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //asigns res.json() to data variable
        const data = await response.json()
        //console.log data
        console.log(data)
        //refresh page to show changes made
        location.reload()

    }catch(err){
        //console.log the error if try encouters one
        console.log(err)
    }
}

//markUnComplete function
async function markUnComplete(){
    //fetching from the http://localhost:2121/markUnComplete route
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch block
    try{
        const response = await fetch('markUnComplete', {
             //sending a put/update request
            method: 'put',
            //allows app to send and recieve different file formats
            //in this case json
            headers: {'Content-Type': 'application/json'},
            //sends obj to server which uses itemFromJS to find which one to update
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //asigns res.json() to data variable
        const data = await response.json()
          //console.log data
        console.log(data)
        //refresh page to show changes made
        location.reload()

    }catch(err){
        //console.log the error if try encouters one
        console.log(err)
    }
}