<template>
    <v-container>
        <v-layout row>
            <v-flex xs12>
                <v-card min-height="200px">

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
                        <div class="no-results" v-show="searchHasHappened && !results.length">
                            There are no articles matching "{{search}}" published by any of the <router-link to="./subscriptions">cancelled journals.</router-link>
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
                                <div class="oa-link publisher">
                                    <v-btn :href="result.doi_url" class="publisher" v-if="result.publisherLocation">
                                        <span class="text">
                                            <i class="fas fa-unlock"></i>
                                            Publisher fulltext
                                        </span>
                                    </v-btn>
                                </div>

                                <div class="oa-link repository" v-if="result.repositoryLocations.length">
                                    <v-menu bottom left>
                                        <template v-slot:activator="{ on }">
                                            <v-btn
                                                    v-on="on"
                                            >
                                                <span class="text">
                                                    <i class="fas fa-unlock"></i>
                                                    Repository fulltext
                                                </span>
                                            </v-btn>
                                        </template>

                                        <v-list>
                                            <v-list-tile
                                                    v-for="(loc, i) in result.repositoryLocations"
                                                    :key="i"
                                                    @click=""
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


    export default {
        name: 'Articles',
        data: () => ({
            resultsRaw: [],
            search: '',
            searchHasHappened: false
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
            fetch() {
                return axios.get(this.searchUrl)
                    .then(resp => {
                        console.log("got search results back", resp.data.list)
                        this.resultsRaw = resp.data.list
                        this.searchHasHappened = true
                        return true
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        this.searchHasHappened = true
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
            .no-results {
                padding: 20px;
            }

            .result {
                padding: 20px;
                .line.oa {

                }
            }
        }
    }

</style>
