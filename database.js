import { MongoClient } from 'mongodb';

class Database {
    constructor() {
        this.url = "mongodb+srv://access:access_granted@cluster0.ona4xqo.mongodb.net/";
        this.client = new MongoClient(this.url);
        this.db = "cookbook";
        this.users = this.client.db(this.db).collection("users");
        this.recipes = this.client.db(this.db).collection("recipes");
    }

    async connect() {
        await this.client.connect();
    }

    async saveUser(username, password) {
        if (await this.users.findOne({username: username}) !== null) {
            return false;
        } else {
            await this.users.insertOne({username: username, password: password, recipes: [], week: [], palette: "charcoal"});
            return true;
        }
    }

    async saveRecipe(username, recipe) {
        this.users.findOneAndUpdate({username: username}, {$push: {recipes: recipe}});
    }

    async deleteRecipe(username, recipe) {
        this.users.findOneAndUpdate({username: username}, {$pull: {recipes: recipe}});
    }

    async getPalette(username) {
        return await this.users.findOne({username: username}).then((found) => {return found.palette;});
    }

    async getUser(username) {
        return await this.users.findOne({username: username});
    }

    async changePalette(username, palette) {
        await this.users.updateOne({username: username}, {$set: {palette: palette}});
    } 

    async deleteUser(username) {
        try {
            await this.users.deleteOne({username: username});  
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async login(username, password) {
        return await this.users.findOne({username: username, password: password});
    }

    /*
    async top10WordScores() {
        let highest = await this.words.find({}).sort({score: -1}).limit(10).toArray();
        console.log(highest);
        return highest;
    }
    */
}

const database = new Database();
database.connect();

export { database };
