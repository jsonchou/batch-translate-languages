export default {
    methods: {
        removeCache(key) {
            return new Promise((resolve, reject) => {
                try {
                    chrome.storage.local.remove(chrome.storage.local.get(key))
                    resolve('done')
                } catch (err) {
                    reject(err)
                    console.log('getCache', err)
                }
            })
        },
        getCache(key) {
            return new Promise((resolve, reject) => {
                try {
                    chrome.storage.local.get([key], function(result) {
                        resolve(result[key])
                    });
                } catch (err) {
                    reject(err)
                    console.log('getCache', err)
                }
            })
        },
        setCache(key, info) {
            return new Promise((resolve, reject) => {
                console.log('set cache info', info)
                try {
                    chrome.storage.local.set({
                        [key]: info
                    }, function(result) {
                        console.log('set cache result', result)
                        resolve(result)
                    });
                } catch (err) {
                    reject(err)
                    console.log('setCache', err)
                }
            })
        },
    }
}