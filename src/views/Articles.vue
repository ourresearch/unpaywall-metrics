<template>
    <v-container>
        <v-layout row>
            <h1>Affected articles</h1>
            <v-spacer></v-spacer>
            <v-btn @click="getCsv">CSV</v-btn>
            <v-btn @click="getJson">JSON</v-btn>


        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <v-card min-height="200px">
                    <div class="search-inputs">
                        <v-layout>
                            <v-flex sm9>
                                <v-text-field
                                        single-line
                                        v-model="search"
                                        append-icon="search"
                                        label="Search by title or DOI"
                                        type="text"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout class="align-center">
                            <v-switch
                                    v-model="oaOnly"
                                    label="Show only articles with OA copies"
                            ></v-switch>
                        </v-layout>

                    </div>

                    <v-divider></v-divider>

                    <div class="results">
                        <div class="header" v-show="searchHasHappened">

                            <div class="descr">
                                <div class="no-results" v-show="!results.length">
                                    There are no articles matching "{{search}}" published by any of the
                                    <router-link to="./subscriptions">cancelled journals.</router-link>
                                </div>
                                <div class="results-meta" v-show="results.length">
                                    <!--                                    <span>Showing</span>-->

                                    <!--                                     {{ results.length }}  articles-->
                                </div>
                            </div>


                        </div>


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
                            <v-layout row>


                                <!--                                NO LINK-->
                                <div class="oa-link toll-access" v-if="!result.is_oa">
                                    <i class="fas fa-lock"></i>
                                    No OA copy found
                                </div>


                                <!--                                PUBLISHER LINK-->
                                <div class="oa-link publisher" v-if="result.publisherLocation">
                                    <a :href="result.doi_url" class="fulltext-link publisher">
                                        <span class="text">
                                            <i class="fas fa-unlock"></i>
                                            Publisher fulltext
                                        </span>
                                    </a>
                                </div>

                                <!--                                REPOSITORY LINK-->
                                <div class="oa-link repository" v-if="result.repositoryLocations.length">
                                    <v-menu bottom left>
                                        <template v-slot:activator="{ on }">
                                            <span
                                                    v-on="on"
                                                    class="fulltext-link repository"
                                            >
                                                <span class="text">
                                                    <i class="fas fa-unlock"></i>
                                                    Repository fulltext
                                                </span>
                                            </span>
                                        </template>

                                        <v-list>
                                            <v-list-tile
                                                    v-for="(loc, i) in result.repositoryLocations"
                                                    :key="i"
                                                    @click="visitLink(loc.url)"
                                            >
                                                <v-list-tile-title>
                                                    <i class="fas fa-unlock"></i>
                                                    {{ loc.url }}
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                    </v-menu>

                                </div>


                            </v-layout>
                        </div>
                    </div>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>


</template>


<script>
    import axios from 'axios'
    import _ from 'lodash'


    export default {
        name: 'Articles',
        data: () => ({
            resultsRaw: [],
            search: '',
            searchHasHappened: false,
            oaOnly: false
        }),
        computed: {
            searchUrl() {

                let host = "none"
                if (this.oaOnly) host = "any"

                return "https://rickscafe-api.herokuapp.com/unpaywall-metrics/articles?q={q}&oa_host={host}"
                    .replace("{q}", this.search)
                    .replace("{host}", host)

            },
            results() {
                return this.resultsRaw.map(r => {
                    r.publisherLocation = r.oa_locations.find(x => {
                        return x.host_type === "publisher"
                    })
                    r.repositoryLocations = r.oa_locations.filter(x => {
                        return x.host_type === "repository"
                    })
                    return r
                })
            }
        },
        methods: {
            getCsv() {
                alert("coming soon!")
            },
            getJson() {
                alert("coming soon!")
            },
            visitLink(url) {
                window.location.href = url
            },
            fetch() {
                this.searching = true
                console.log("fetching!", this.search, this.oaHost)
                return axios.get(this.searchUrl)
                    .then(resp => {
                        console.log("got search results back", resp.data.list)
                        this.resultsRaw = resp.data.list
                        this.searchHasHappened = true
                        this.searching = false
                        return true
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        this.searchHasHappened = true
                        this.searching = false
                        return false
                    })
            }

        },
        mounted() {
            let q = this.$route.query.q
            if (q) {
                console.log("query:", q)
                this.search = q
            }

            this.fetch()
        },
        watch: {
            oaOnly: function (newVal) {
                console.log("oaOnly changed")
                this.fetch()
            },
            search: _.debounce(function (newVal) {
                this.fetch()
                let queryObj
                if (this.search === "") {
                    queryObj = {}
                }
                else {
                    queryObj = {q: this.search}
                }

                this.$router.push({query: queryObj})

            }, 250),
        }
    }
</script>


<style scoped lang="scss">
    .v-card {
        .search-inputs {
            padding: 20px 20px 0;
        }

        .results {
            .header {
                padding: 0 20px;
            }

            .result {
                padding: 20px;

                .oa-link {
                    display: block;
                    border-radius: 20px;
                    padding: 3px 15px;
                    color: #fff;
                    margin-right: 10px;
                    font-size: 14px;

                    &.repository {
                        background: #4CAF50;
                        cursor: pointer;
                    }

                    &.publisher {
                        background: #FF8F00;
                        cursor: pointer;
                    }

                    &.toll-access {
                        background: #eee;
                        color: #777;
                    }

                    a {
                        color: #fff;
                        text-decoration: #fff;
                    }
                }
            }
        }
    }

</style>
