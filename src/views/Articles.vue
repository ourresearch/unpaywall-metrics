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
                    <v-list-tile @click="getJson">
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
                            <!--                            <v-flex shrink  class="search-type" v-show="search">-->
                            <!--                                <span v-show="searchType=='doi'">-->
                            <!--                                    DOI:-->
                            <!--                                </span>-->
                            <!--                                <span v-show="searchType=='issn'">-->
                            <!--                                    ISSN:-->
                            <!--                                </span>-->
                            <!--                                <span v-show="searchType=='string'">-->
                            <!--                                    Title:-->
                            <!--                                </span>-->

                            <!--                            </v-flex>-->
                            <v-flex xs6 grow>
                                <v-text-field
                                        single-line
                                        v-model="search"
                                        append-outer-icon="search"
                                        @click:append-outer="fetch"
                                        @keypress.enter="fetch"
                                        label="Search by title, ISSN, or DOI"
                                        type="text"
                                        box
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


                    <div class="loading" v-show="loading">
                        <v-progress-linear
                                indeterminate
                        ></v-progress-linear>
                    </div>

                    <div class="results" v-show="!loading">
                        <div class="header" v-show="searchHasHappened">
                            <div class="descr">
                                <div class="no-results" v-show="!results.length">
                                    There are no articles matching "{{search}}" published by any of the
                                    <router-link to="./subscriptions">cancelled journals.</router-link>
                                </div>
                                <div class="results-meta" v-show="results.length">
                                    Showing

                                    <span v-show="!serverHasMoreResults" class="all">all</span>

                                    {{ results.length }}

                                    <span v-show="serverHasMoreResults" class="total-count">of {{resultsTotalCount.toLocaleString()}}</span>
                                    <span v-show="search"> matching </span>

                                    articles

                                    <!--                                    <span v-show="search" class="search-is-dirty">-->
                                    <!--                                        matching-->
                                    <!--                                        <span v-show="searchType=='issn'" class="issn">ISSN</span>-->
                                    <!--                                        <span v-show="searchType=='doi'" class="doi">DOI</span>-->
                                    <!--                                        "{{search}}"-->
                                    <!--                                    </span>-->
                                    <span v-show="results.length > 1" class="sort">(most recent first)</span>


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

                    <v-layout justify-center class="show-more" v-show="!loading">
                        <v-btn class="ma-4"
                               v-show="serverHasMoreResults"
                               @click="fetchNextResultsPage"
                               color="primary">Show more results
                        </v-btn>
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


    export default {
        name: 'Articles',
        data: () => ({
            resultsRaw: [],
            search: '',
            searchHasHappened: false,
            oaOnly: false,
            resultsPage: 1,
            resultsTotalCount: 0,
            loading: false,
            hosts: hosts
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
                return this.resultsRaw.map(r => {
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
            fetchNextResultsPage() {
                this.resultsPage += 1
                this.fetch(true)
            },
            fetch(append) {
                this.loading = true
                this.search
                console.log("fetching!", this.search, this.oaHost)
                return axios.get(this.searchUrl)
                    .then(resp => {
                        console.log("got search results back", resp.data.list)
                        if (append) {
                            this.resultsRaw.push(...resp.data.list)
                        } else {
                            this.resultsRaw = resp.data.list
                        }
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
            }
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

        .results {
            &.loading {
                opacity: .5;
            }

            .header {
                padding: 20px;
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
