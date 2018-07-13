const User = require('../../models/User')
const bcrypt = require('bcrypt')

exports.signup = (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if(!email || !password){
        return res.status(400).send({error: 'user or password incorrect'})
    }
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'email already exists' })
            } else {
                const newUser = new User({
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (_, salt) => {
                    bcrypt.hash(newUser.password, salt, (_, hash) => {
                        newUser.password = hash
                        newUser.save()
                            .then(user => res.json(
                                {
                                    data: {
                                        email: user.email,
                                        password: user.password
                                    },
                                    code: 200,
                                    status: "ok"
                                }
                            ))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
}
