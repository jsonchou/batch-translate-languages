<template>
    <div class="template-inner app-config">
        <form action="">
            <fieldset>
                <legend>
                    General
                </legend>
                <div class="app-config-inner">
                    <ul>
                        <li>
                            <p class="p1">default download folder:</p>
                            <p class="p2"><input style="width:130px" v-model="folder_name" /></p>
                        </li>
                        <li>
                            <p class="p1">never download the image size of:</p>
                            <p class="p2">
                                width:<input placeholder="image size of min width" v-model="minWidth" /> px,
                                height:<input placeholder="image size of min height" v-model="minHeight" /> px
                            </p>
                        </li>
                        <li><button class="btn" @click="saveConfig">SAVE</button></li>
                    </ul>
                </div>
            </fieldset>
        </form>
    </div>
</template>

<script>
    import mixins from '../api/mixins.js'
    import config from '../api/config.js'
    const cacheKey = "accurate_tmp_config"

    export default {
        mixins: [mixins],
        data() {
            return {
                ...config,
            }
        },
        watch: {},
        methods: {
            async saveConfig() {
                let me = this;
                await me.setCache(cacheKey, me.$data)
            },
            async init() {
                let me = this;
                let res = await me.getCache(cacheKey)
                console.log('init res', res)
                Object.assign(this.$data, res)
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