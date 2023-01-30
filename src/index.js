const express = require('express')
const fs = require('fs')
const path = require('path')
const PORT = process.env.PORT || 3001

const app = express()
const filedb = path.join(__dirname, '../public/db/db.json')

function createFile(filename) {
    fs.open(filename, 'r', function (err, fd) {
        if (err) {
            fs.writeFile(filename, '{}', function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("Файл с базой данных создан");
            });
        } else {
            console.log("Файл с базой данных уже существует");
        }
    });
}
createFile(filedb)
app.post('/counter/:bookId/incr', (req, res) => {
    let { bookId } = req.params
    fs.readFile(filedb, function (err, data) {
        if (err) throw err;
        var obj = JSON.parse(data.toString());
        if(obj[bookId]){
            obj[bookId] +=1
        } else{
            obj[bookId] = 1
        }
        fs.writeFile(filedb, JSON.stringify(obj), function (err) {
            if (err) {
                console.log(err);
            }
        });
        res.json(obj)
    });
})
app.get('/counter/:bookId', (req, res) => {
    let { bookId } = req.params
    fs.readFile(filedb, function (err, data) {
        if (err) throw err;
        var obj = JSON.parse(data.toString());
        res.json(obj[bookId])
    });
})

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
})