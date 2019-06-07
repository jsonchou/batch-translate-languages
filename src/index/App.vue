<template>
    <div class="template-inner">
        <div class="tip f10" :class="[tip?'on':'']">copy done</div>
        <div class="box flex mb20">
            <div class="dimension">
                <p class="flex"><label class="tc">W</label><input type="text" @input="filterImg" data-tag="width" :value="width" class="width" />
                    <span>px</span></p>
                <p class="flex"><label class="tc">H</label><input type="text" @input="filterImg" data-tag="height" :value="height" class="height" />
                    <span>px</span></p>
            </div>
            <input type="text" class="sub" readonly :value="'save to: '+cfg.folder_name" placeholder="input a folder name" title="Set the name of the subfolder you want to download the images to." />
            <span class="btn" @click="downloadImages">DOWNLOAD</span>
            <span class="settings pointer f10" @click="openSettings">Settings <i class="icon iconfont icon-icon_shezhi"></i></span>
        </div>

        <div class="box-list">
            <div class="control-bar">
                <label for="checkAll"><input id="checkAll" name="checkAll" type="checkbox" class="vm" @change="checkAll" name="" :checked="all"> <span class="vm">ALL</span> </label>
            </div>
            <ul class="flex start">
                <li v-for="(item,index) in list" :key="index">

                    <p class="p1"><img :data-width="item.width" :data-height="item.height" :src="item.url"></p>
                    <p class="p2">
                        <input type="checkbox" :data-index="index" @change="checkSingle" :checked="item.enable">
                        <span @click="setSize" :data-width="item.width" :data-height="item.height">x:{{item.width}},y:{{item.height}}</span>
                    </p>
                    <p class="p3 f10 ">
                        <span class="s pointer" title="copy">
                            <i class="icon iconfont icon-icon_fuzhi copy" @click="bindCopy" :data-url="item.url"></i>
                        </span>
                        <span class="s view pointer" title="view">
                            <i class="icon iconfont icon-icon_yulan view" @click="bindView" :data-url="item.url"></i>
                        </span>
                    </p>

                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import "../styles/main.css"
    import mixins from '../api/mixins.js'
    import defaultOpts from '../api/config.js'

    const cacheImageKey = "accurate_tmp_images"
    const cacheConfigKey = "accurate_tmp_config"

    let indexConfig = {
        tip: false,
        all: true,
        width: '',
        height: '',
        list: []
    }

    export default {
        mixins: [mixins],
        data() {
            return {
                cfg: defaultOpts,
                ...indexConfig
            }
        },
        watch: {},
        methods: {
            copyToClipboard(text) {
                const input = document.createElement('input');
                input.style.position = 'fixed';
                input.style.opacity = 0;
                input.value = text;
                document.body.appendChild(input);
                input.select();
                document.execCommand('Copy');
                document.body.removeChild(input);
            },
            bindCopy(e) {
                let me = this;
                let { url } = e.target.dataset
                me.copyToClipboard(url)
                me.tip = true
                setTimeout(() => {
                    me.tip = false
                }, 2000)
            },
            bindView(e) {
                let me = this;
                console.log(1234, e)
                let { url } = e.target.dataset
                chrome.tabs.create({ url });
            },
            async openSettings(e) {
                let me = this;
                chrome.runtime.openOptionsPage(() => {
                    console.log(123)
                })
            },
            async setSize(e) {
                let me = this;
                let { width, height } = e.target.dataset
                me.width = width;
                me.height = height;
                await me.filterImg()
            },
            folderNameListener(e) {
                let me = this;
                chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
                    suggest({ filename: me.cfg.folder_name + "/" + item.filename });
                });

            },
            checkAll(e) {
                let me = this;
                me.all = !me.all
                let tmp = JSON.parse(JSON.stringify(me.list));
                tmp = tmp.map(c => {
                    c.enable = me.all
                    return c
                })
                me.list = tmp
            },
            checkSingle(e) {
                let me = this;
                let len = me.list.length
                let { index } = e.target.dataset
                let checked = e.target.checked;
                let tmp = JSON.parse(JSON.stringify(me.list));
                tmp[index].enable = checked
                me.list = tmp
                let len2 = me.list.filter(c => c.enable).length
                if (len == len2) {
                    me.all = true
                } else {
                    me.all = false
                }
            },
            downloadImages(e) {
                let me = this;
                me.list.filter(c => c.enable).forEach(item => {
                    item.url && chrome.downloads.download({
                        url: item.url
                    });
                });
            },
            async filterImg(e) {
                let me = this
                let cache = await me.getCache(cacheImageKey).catch(err => {
                    console.log(err)
                })

                if (e) {
                    let { tag } = e.target.dataset
                    me[tag] = e.target.value
                }

                let w = me.width
                let h = me.height

                if (cache && cache.length) {
                    let tmp = []
                    w && (tmp = cache.filter(c => {
                        return c.width == w
                    }))
                    h && (tmp = cache.filter(c => {
                        return c.height == h
                    }))
                    if (tmp && tmp.length) {
                        me.list = tmp
                    } else if (!w && !h) {
                        me.list = cache
                    }
                }
            },
            getImgInfo(url) {

                return new Promise((resolve, reject) => {
                    let width, height
                    let img = new Image()
                    img.src = url
                    if (img.complete) {
                        width = img.width
                        height = img.height
                        resolve({
                            width,
                            height
                        })
                    } else {
                        img.onload = function() {
                            width = img.width
                            height = img.height
                            resolve({
                                width,
                                height
                            })
                        }

                        img.onerror = function() {
                            reject('image onerror')
                        }
                    }
                })

            },
            async beforeCreate() {
                let me = this
                chrome.runtime.onStartup.addListener(async function() {
                    await me.removeCache(cacheImageKey)
                })
            },
            async init() {
                let me = this;

                let cfg = await me.getCache(cacheConfigKey) || defaultOpts
                console.log(1111111111, cfg)
                Object.assign(this.$data, { cfg })

                // Get images on the page
                chrome.windows.getCurrent(function(currentWindow) {
                    chrome.tabs.query({
                        active: true,
                        windowId: currentWindow.id
                    }, function(activeTabs) {
                        try {
                            chrome.tabs.executeScript(activeTabs[0].id, {
                                file: '/libs/downloader.js',
                                allFrames: true
                            }, _ => {
                                let e = chrome.runtime.lastError;
                                if (e !== undefined) {
                                    console.log(_, e);
                                }
                            });
                        } catch (err) {
                            console.log(err)
                        }
                    });
                });

                me.folderNameListener()

                chrome.runtime.onMessage.addListener(async function(result) {
                    let list = []
                    let arr = [];
                    if (Array.isArray(result.linkedImages)) {
                        arr = arr.concat(result.linkedImages)
                    }
                    if (Array.isArray(result.images)) {
                        arr = arr.concat(result.images)
                    }
                    if (arr && arr.length) {
                        arr.map(item => {
                            list.push({
                                url: item,
                                enable: true
                            });
                        })
                        let proms = []
                        list.length && list.map(async item => {
                            item.url && proms.push(me.getImgInfo(item.url))
                        })

                        let res = await Promise.all(proms).catch(err => {
                            console.log(err)
                        })

                        res.map((item, index) => {
                            list[index].width = item.width;
                            list[index].height = item.height;
                        })

                        if (list && list.length) {
                            console.log('init list', list)
                            // remove the miniWidth & minHeight images
                            let tmp = list.filter(c => {
                                return c.width >= me.cfg.minWidth && c.height >= me.cfg.minHeight
                            })
                            await me.setCache(cacheImageKey, tmp).catch(err => {
                                console.log(err)
                            })
                            me.list = tmp

                        }
                    }
                });
            }
        },
        created: function() {
            let me = this;
        },
        mounted: function() {
            let me = this;
            me.init()
        },
    };
</script>