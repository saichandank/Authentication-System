const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../schema/userSchema');

const {createTable, checkRecord, insertRecord} = require('../sqlFunctions');
const { password } = require('../db/config');

const generateToken = (userId) => {

    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d', });

};

const register = async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);

    if ( !email || !password ) {
        res.status(400).json({ error: 'Please fill all fields' });
        return ;
    }

    const salt = await bcrypt.genSalt(10);
    hashedPassword = bcrypt.hashSync(password, salt);
    const user={
        userId: uuidv4(),
        email,
        password: hashedPassword,
    };

    try{
        console.log("hel");
        await createTable(userSchema);
        const userExists = await checkRecord('users', 'email', email);
        
        if (userExists){
            res.status(400).json({ error: 'User already exists' });
        }
        else{
            await insertRecord('users', user);
            res.status(201).json({ message: 'User registered successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }


};

const login = async(req, res) => {
    try{
        const { email, password} = req.body;
        const checkUser = await checkRecord('users', 'email', email);
        if (checkUser){
            if (!checkUser.password){
                res.status(400).json({ error: 'Invalid credentials' });
                return;
            }
            const matchpassword = await bcrypt.compareSync(password, checkUser.password);

            if (!matchpassword){
                res.status(400).json({ error: 'Invalid credentials' });
                return;
            }
            else{
                res.status(200).json({
                    userId: checkUser.userId,
                    email: checkUser.email,
                    access_token: generateToken(checkUser.userId),

                });
            }
            
        }else{
            res.status(400).json({ error: 'Invalid credentials' 
            });

        }
}catch (error) {
    res.status(500).json({ error: 'Server error' });
} 
};

module.exports = { register, login };