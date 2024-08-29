const pool = require('../../config/db/index');
const userModel = require('../../app/models/UserModel');

const getUsers = (req, res) => {
    pool.query(userModel.getUsers, (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

const getUsersById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(userModel.getUsersById, [id], (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};
const addUser = (req, res) => {
    const { email, phone, password } = req.body;

    // Check if email exists
    pool.query(userModel.checkEmailExits, [email], (CheckMailError, CheckMailResults) => {
        if (CheckMailError) {
            console.error('Error checking email existence:', CheckMailError);
            return res.status(500).send('Internal Server Error');
        }

        if (CheckMailResults.rows.length > 0) {
            return res.status(400).send('Email already exists.');
        }

        // Add User to db
        pool.query(userModel.addUser, [email, phone, password], (addError, addResults) => {
            if (addError) {
                console.error('Error adding user:', addError);
                return res.status(500).send('Internal Server Error');
            }

            const newUser = addResults.rows[0];
            res.status(201).json(newUser); // Return the newly created user
        });
    });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    // Check if the user exists
    pool.query(userModel.deleteUser, [id], (error, results) => {
        if(error) {
            console.log("Error checking user existence",error);
            return res.status(500).send("Internal Server Error");
        }
        if (results.rows.length === 0) {
            return res.status(404).send('User does not exist in the database');
        }

        // Delete the user
        pool.query(userModel.deleteUser, [id], (error, results) => {
            if (error) {
                console.error('Error deleting user:', error);
                return res.status(500).send('Internal Server Error');
            }

            res.status(200).send('User deleted successfully');
        });
    });
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { email, phone, password } = req.body;
    
    // Check if the user exists
    pool.query(userModel.getUsersById, [id], (error, results) => {
        if (error) {
            console.error('Error checking user existence:', error);
            return res.status(500).send('Internal Server Error');
        }
        const noUserFound = results.rows.length === 0;
        if (noUserFound) {
            return res.status(404).send('User does not exist');
        }

        // Update the user
        pool.query(userModel.updateUser, [email, phone, password, id], (updateError, updateResults) => {
            if (updateError) {
                console.error('Error updating user:', updateError);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).json(updateResults.rows[0]);
        });
    });
}
module.exports = {
    getUsers,
    getUsersById,
    addUser,
    deleteUser,
    updateUser,
};