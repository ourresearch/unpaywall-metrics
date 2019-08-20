<template>
    <v-flex>
        <v-layout row align-baseline>
            <h1>Affected articles</h1>
            <v-spacer></v-spacer>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn
                            small
                            flat
                            v-on="on"
                    >
                        <div>Export <i class="fas fa-file-export"></i></div>

                    </v-btn>
                </template>
                <v-list>
                    <v-list-tile @click="articleSearch.getApiUrl()">
                        <v-list-tile-title>View current page in API (JSON)</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>


        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <v-card min-height="200px">
                    <div class="search-inputs">
                        <v-layout align-center>
                            <v-flex xs6 grow>
                                <v-text-field
                                        single-line
                                        v-model="searchInputNow"
                                        append-outer-icon="search"
                                        @click:append-outer="articleSearch.params.q.set(searchInputNow)"
                                        @keypress.enter="articleSearch.params.q.set(searchInputNow)"
                                        label="Search by title, ISSN, or DOI"
                                        type="text"
                                        box
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout class="align-center">
                            <v-switch
                                    v-model="articleSearch.params.isOa.selected"
                                    label="Show only articles with OA copies"
                            ></v-switch>
                        </v-layout>

                    </div>

                    <v-divider></v-divider>


                    <div class="loading" v-show="articleSearch.loadingState=='loading'">
                        <v-progress-linear
                                indeterminate
                        ></v-progress-linear>
                    </div>

                    <div class="results-header" v-show="articleSearch.loadingState=='complete'">
                        <div class="descr">
                            <div class="no-results" v-show="!results.length">
                                Sorry, there are no articles matching "{{articleSearch.params.q.selected}}" published by any of the
                                <router-link to="./subscriptions">cancelled journals.</router-link>
                            </div>

                            <div class="results-meta" v-show="results.length">
                                Showing
                                {{ articleSearch.getPageOffsets().start }}&ndash;{{ articleSearch.getPageOffsets().end }} of {{ articleSearch.resultsCount.toLocaleString() }} matching results


                                <span v-show="results.length > 1" class="sort">(most recent first)</span>


                            </div>


                        </div>
                    </div>

                    <div class="results" v-show="results.length">


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
                                                    Hosted by
                                                    {{ loc.hostName }}
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                    </v-menu>

                                </div>


                            </v-layout>
                        </div>
                    </div>

                    <v-layout justify-center class="show-more" v-show="articleSearch.loadingState=='complete' && results.length">
                        <v-pagination
                                class="ma-4"
                          v-model="articleSearch.params.page.selected"
                          :length="articleSearch.getNumPages()"
                          :total-visible="7"
                        ></v-pagination>



                    </v-layout>


                </v-card>
            </v-flex>
        </v-layout>
    </v-flex>


</template>


<script>
    import axios from 'axios'
    import _ from 'lodash'
    import {hosts} from "../hosts";
    import {articleSearch} from "../search"


    export default {
        name: 'Articles',
        data: () => ({
            resultsRaw: [],
            search: '',
            searchInputNow: '',
            searchHasHappened: false,
            oaOnly: false,
            resultsPage: 1,
            resultsTotalCount: 0,
            hosts: hosts,
            articleSearch: articleSearch
        }),
        computed: {
            searchUrl() {

                let host = "none"
                if (this.oaOnly) host = "any"

                return "https://api.cdl.metrics.unpaywall.org/articles?q={q}&oa_host={host}&page={page}"
                    .replace("{q}", this.search)
                    .replace("{host}", host)
                    .replace("{page}", this.resultsPage)

            },
            serverHasMoreResults() {
                return this.resultsTotalCount > this.resultsRaw.length
            },
            results() {
                return this.articleSearch.results.map(r => {
                    r.publisherLocation = r.oa_locations.find(x => {
                        return x.host_type === "publisher"
                    })
                    r.repositoryLocations = r.oa_locations.filter(x => {
                        return x.host_type === "repository"
                    })

                    r.oa_locations.filter(x => x.endpoint_id).map(x => {
                        if (hosts[x.endpoint_id]) {
                            x.hostName = hosts[x.endpoint_id].institution_name
                        } else {
                            x.hostName = x.url
                        }
                    })


                    return r
                })
            },
            searchType() {
                let issnRe = /^\d{4}-\d{4}$/
                let doiRe = /^10\..+/
                if (issnRe.test(this.search)) {
                    return "issn"
                } else if (doiRe.test(this.search)) {
                    return "doi"
                } else {
                    return "string"
                }
            }
        },
        methods: {
            getCsv() {
                alert("coming soon!")
            },
            getJson() {
                window.location.href = this.searchUrl
            },
            visitLink(url) {
                window.location.href = url
            },
            updateModel(){
                this.$router.push({
                        query: articleSearch.getParams(true)
                    });
                this.articleSearch.fetchResults()
            },
            fetch() {
                this.loading = true
                this.search = this.searchInputNow
                console.log("fetching!", this.search, this.oaHost, this.resultsPage)

                return axios.get(this.searchUrl)
                    .then(resp => {
                        console.log("got search results back", resp.data.list)
                        this.resultsRaw = resp.data.list
                        this.resultsTotalCount = resp.data.total_count
                        this.searchHasHappened = true
                        this.loading = false
                        return true
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        this.searchHasHappened = true
                        this.loading = false
                        return false
                    })
            }

        },
        mounted() {
            this.articleSearch.setUserInputsFromUrl(this.$route.query)
            this.articleSearch.fetchResults()
            this.searchInputNow = this.articleSearch.params.q.selected.slice()
        },
        watch: {
            // not the most elegant solution.
            // we need to reset the page for most searches, except of course
            // when we are just changing the page. figure out a nicer way
            // to do this later.
            "articleSearch.params.isOa.selected": function (newVal) {
                this.articleSearch.params.page.reset()
                this.updateModel()
            },
            "articleSearch.params.q.selected": function (newVal) {
                this.articleSearch.params.page.reset()
                this.updateModel()
            },
            "articleSearch.params.page.selected": function (newVal) {
                this.updateModel()
            },

        }
    }
</script>


<style scoped lang="scss">
    .v-card {
        .search-inputs {
            padding: 40px 20px 0;

            .search-type {
                padding: 10px;
                font-weight: bold;
                font-size: 22px;
            }

            .v-input {
                font-size: 22px !important;
            }
        }

        .results-header {
            padding: 20px;
        }
        .results {
            &.loading {
                opacity: .5;
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
