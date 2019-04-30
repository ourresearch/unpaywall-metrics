<template>
    <v-container>
        <v-layout row>
            <v-flex xs12>
                <v-card>

                    <div class="header">
                        <v-text-field
                                single-line
                                v-model="search"
                                append-icon="search"
                                label="Search for articles"
                                type="text"
                                @click:append="fetch"
                                @keyup.enter="fetch"
                        ></v-text-field>
                    </div>

                    <div class="results">
                        <div class="result" v-for="result in results">
                            <div class="title">
                                {{result.title}}
                            </div>
                            <div class="line meta">
                                <span class="year">
                                    {{result.year}}
                                </span>
                                <span class="journal">
                                    {{result.journal_name}}
                                </span>
                            </div>
                            <div class="line authors" v-if="result.z_authors">
                                {{result.z_authors.map(function(x){return x.family}).join(", ")}}
                            </div>
                            <div class="line oa">

                                    <v-chip color="orange" text-color="white" href="http://google.com">
                                        <v-avatar>
                                            <v-icon>unlock</v-icon>
                                        </v-avatar>
                                        Publisher fulltext


                                    </v-chip>


                            </div>


                        </div>


                    </div>


                </v-card>


            </v-flex>


        </v-layout>


    </v-container>


    <!--    <div class="page journals">-->
    <!--        <h1>Articles</h1>-->


    <!--            <v-layout>-->


    <!--                    <v-card>-->
    <!--                        <v-text-field-->
    <!--                                single-line-->
    <!--                                v-model="search"-->
    <!--                                append-icon="search"-->
    <!--                                label="Search for articles"-->
    <!--                                type="text"-->
    <!--                                @click:append="fetch"-->
    <!--                                @keyup.enter="fetch"-->


    <!--                        ></v-text-field>-->


    <!--                    </v-card>-->


    <!--            </v-layout>-->

    <!--            <v-layout>-->
    <!--                <v-flex text-xs-center >-->
    <!--                    <v-list two-line>-->
    <!--                        <template v-for="result in results">-->
    <!--                            <v-list-tile :key="result.doi">-->
    <!--                                <v-list-tile-content>-->
    <!--                                    <v-list-tile-content>-->
    <!--                                        <v-list-tile-title>{{ result.title }}</v-list-tile-title>-->
    <!--                                        <v-list-tile-sub-title class="text&#45;&#45;primary">-->
    <!--                                            {{ result.year }}-->
    <!--                                            {{ result.journal}}-->
    <!--                                        </v-list-tile-sub-title>-->

    <!--&lt;!&ndash;                                        <v-list-tile-sub-title>{{ result.z_authors.map(function(x){return x.family}).join(', ') }}</v-list-tile-sub-title>&ndash;&gt;-->
    <!--                                    </v-list-tile-content>-->
    <!--                                </v-list-tile-content>-->

    <!--                            </v-list-tile>-->

    <!--                        </template>-->


    <!--                    </v-list>-->
    <!--                </v-flex>-->

    <!--            </v-layout>-->


    <!--    </div>-->
</template>


<script>
    import axios from 'axios'


    export default {
        name: 'Articles',
        data: () => ({
            results: [],
            search: '',
        }),
        computed: {
            searchUrl() {
                let doiSearchUrl = "https://api.rickscafe.io/unpaywall-metrics/article/doi/{}"

                let titleSearchUrl = "https://api.rickscafe.io/unpaywall-metrics/articles/title/{}?bigdeal=cdl_elsevier"

                let url
                if (this.search.indexOf("10.") === 0) {
                    url = doiSearchUrl.replace("{}", this.search)
                } else {
                    url = titleSearchUrl.replace("{}", this.search)
                }
                return url
            }
        },
        methods: {
            fetch() {
                return axios.get(this.searchUrl)
                    .then(resp => {
                        console.log("got search results back", resp.data.list)
                        this.results = resp.data.list
                        return true
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        return false
                    })
            }
        },
        mounted() {
            // this.fetch()
        }
    }
</script>


<style scoped lang="scss">
    .v-card {
        .header {
            padding: 20px;
        }

        .results {
            .result {
                padding: 20px;
            }
        }
    }

</style>
