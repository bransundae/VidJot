if (process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI:'mongodb+srv://nullfinder:<1234>@vidjot-prod-blw7r.gcp.mongodb.net/test?retryWrites=true'
    }
} else {
    module.exports = { 
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}