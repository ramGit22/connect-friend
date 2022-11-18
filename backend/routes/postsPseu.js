//create post
const post = createPost(req.bod)
post.save()

//update post
selectPostWithId("/:id", async(req, res) =>{
    checkIfPostExits()
})