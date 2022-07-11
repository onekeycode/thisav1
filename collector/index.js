const Pornhub = require('./pornhub');
const Xvideos = require('./xvideos');
const Vjav = require('./vjav');
// import Pornzog from './pornzog';
let modules = [Pornhub, Xvideos, Vjav];
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
class Pornsearch {
    constructor(driver) {
        this.driver = driver;
    }

    getVideoList(keywords, page) {
        return new Promise((resolve, reject) => {
            keywords = encodeURIComponent(keywords);
            var promises = modules.map(function (obj) {
                let drive = new obj(keywords, page);
                return drive[`videoParser`]();
            })
            Promise.all(promises).then(function (results) {
                let res = [];
                res = res.concat(...results)
                res = shuffle(res)
                resolve(res)
            }).catch((reason) => {
                resolve([])
            })
        });
    }

    getVideo(keywords, page) {
        keywords = encodeURIComponent(keywords);
        let drive = new modules[this.driver](keywords);
        let url = drive.videoUrl(page);
        return new Promise((resolve, reject) => {
            Axios.get(url)
                .then(({ data: body }) => {
                    const data = drive[`videoParser`](Cheerio.load(body), body);

                    if (!data.length) {
                        throw new Error('No results');
                    }

                    resolve(data);
                })
                .catch((error) => {
                    resolve([])
                });
        });
    }
}

module.exports = Pornsearch;