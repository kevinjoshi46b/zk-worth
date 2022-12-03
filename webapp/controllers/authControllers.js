import expressAsyncHandler from 'express-async-handler'

const login = expressAsyncHandler(async (req, res, next) => {
    return res.send("Login route")
})

const signup = expressAsyncHandler(async (req, res, next) => {
    return res.send("Signup route")
})

export {
    login, signup
}
